import os
from fastapi import FastAPI, Depends, HTTPException, Header, status
from pydantic import BaseModel, Field
import firebase_admin
from firebase_admin import credentials, auth, firestore
import google.generativeai as genai
import json

# --- Firebase Initialization ---
if not firebase_admin._apps:
    firebase_admin.initialize_app()
db = firestore.client()

# --- Gemini Initialization ---
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro')

app = FastAPI(title="CivicConnect API")

# --- Pydantic Schemas ---
class ReportSubmit(BaseModel):
    image_url: str = Field(..., description="URL of the uploaded image")
    latitude: float = Field(..., description="Latitude of the issue")
    longitude: float = Field(..., description="Longitude of the issue")
    address: str | None = None

class ComplaintGenerate(BaseModel):
    issueType: str = Field(..., description="Type of the issue")
    location: str = Field(..., description="Location of the issue")
    severity: str = Field(..., description="Severity of the issue")
    description: str = Field(..., description="Description of the issue")

class ReportData(BaseModel):
    imageDescription: str | None = None
    location: str
    issueType: str
    time: str
    description: str

class ReportCompareRequest(BaseModel):
    report1: ReportData
    report2: ReportData

class SeverityDetermineRequest(BaseModel):
    issueType: str
    description: str
    location: str | None = None
    traffic: str | None = None
    healthRisk: str | None = None
    accidentRisk: str | None = None
    population: str | None = None
    roadBlock: str | None = None

# --- Authentication Middleware / Dependency ---
async def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")
    token = authorization.split(" ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# --- Routes ---
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "CivicConnect API - FastAPI"}

@app.post("/api/reports", status_code=status.HTTP_201_CREATED)
async def create_report(report: ReportSubmit, user: dict = Depends(verify_token)):
    try:
        # 1. Analyze image using Gemini
        prompt = f"""Analyze this civic issue image: {report.image_url}. 
Return ONLY JSON matching the schema below. Never return markdown. Never explain.
Schema:
{{
  "issue_type": "string (e.g. Garbage, Pothole, Water Leakage, Streetlight, Road Damage, Illegal Dumping, Tree Fallen, Drainage, Animal, Construction Waste)",
  "confidence": "number (0-1)",
  "severity": "string",
  "department": "string",
  "title": "string",
  "description": "string",
  "safety_advice": "string",
  "estimated_priority": "string",
  "duplicate_keywords": ["string"]
}}"""
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.1,
            ),
        )
        
        # Parse Gemini JSON response (simplified for example)
        try:
            analysis = json.loads(response.text)
        except json.JSONDecodeError:
            analysis = {
                "title": "Issue Detected",
                "issue_type": "Unknown",
                "severity": "Moderate",
                "department": "Public Works",
                "description": "An issue was reported.",
                "confidence": 0,
                "safety_advice": "",
                "estimated_priority": "Medium",
                "duplicate_keywords": []
            }
            
        # 2. Save to Firestore
        report_ref = db.collection("reports").document()
        report_data = {
            "reportId": report_ref.id,
            "authorId": user["uid"],
            "title": analysis.get("title", "Untitled Issue"),
            "category": analysis.get("issue_type", "General"),
            "severity": analysis.get("severity", "Moderate"),
            "department": analysis.get("department", "Public Works"),
            "description": analysis.get("description", ""),
            "aiAnalysis": {
                "confidence": analysis.get("confidence", 0),
                "safetyAdvice": analysis.get("safety_advice", ""),
                "estimatedPriority": analysis.get("estimated_priority", "Medium"),
                "duplicateKeywords": analysis.get("duplicate_keywords", [])
            },
            "imageUrl": report.image_url,
            "location": firestore.GeoPoint(report.latitude, report.longitude),
            "address": report.address or "Unknown",
            "upvoteCount": 0,
            "commentCount": 0,
            "status": "Open",
            "createdAt": firestore.SERVER_TIMESTAMP,
            "updatedAt": firestore.SERVER_TIMESTAMP
        }
        
        report_ref.set(report_data)
        
        return {"message": "Report created successfully", "report": report_data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/complaint/generate", status_code=status.HTTP_200_OK)
async def generate_complaint(complaint: ComplaintGenerate, user: dict = Depends(verify_token)):
    try:
        prompt = f"""Generate a professional municipal complaint.
Input:
Issue Type: {complaint.issueType}
Location: {complaint.location}
Severity: {complaint.severity}
Description: {complaint.description}

Output a formal complaint in both English and Hindi. Return ONLY JSON matching the schema below. Never explain.
Schema:
{{
  "title": "string",
  "complaint_en": "string",
  "complaint_hi": "string",
  "suggested_department": "string",
  "priority": "string"
}}"""
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )
        
        try:
            result = json.loads(response.text)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Failed to parse AI response")
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/reports/compare", status_code=status.HTTP_200_OK)
async def compare_reports(req: ReportCompareRequest, user: dict = Depends(verify_token)):
    try:
        prompt = f"""Compare these two reports to determine if they are duplicates.
Report 1:
- Image Description: {req.report1.imageDescription or "N/A"}
- Location: {req.report1.location}
- Issue Type: {req.report1.issueType}
- Time: {req.report1.time}
- Description: {req.report1.description}

Report 2:
- Image Description: {req.report2.imageDescription or "N/A"}
- Location: {req.report2.location}
- Issue Type: {req.report2.issueType}
- Time: {req.report2.time}
- Description: {req.report2.description}

Return ONLY JSON matching the schema below. Never explain.
Schema:
{{
  "duplicate": true/false,
  "confidence": "number (0-100)",
  "reason": "string"
}}"""
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.1,
            ),
        )
        
        try:
            result = json.loads(response.text)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Failed to parse AI response")
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/severity/determine", status_code=status.HTTP_200_OK)
async def determine_severity(req: SeverityDetermineRequest, user: dict = Depends(verify_token)):
    try:
        prompt = f"""Determine the severity of this civic issue.
Possible values: Low, Medium, High, Critical
Consider factors like Traffic, Health Risk, Accident Risk, Population, and Road Block if provided.
Explain your reasoning.

Input:
Issue Type: {req.issueType}
Description: {req.description}
Location: {req.location or "N/A"}
"""

        if any([req.traffic, req.healthRisk, req.accidentRisk, req.population, req.roadBlock]):
            prompt += f"""
Factors:
- Traffic: {req.traffic or "Unknown"}
- Health Risk: {req.healthRisk or "Unknown"}
- Accident Risk: {req.accidentRisk or "Unknown"}
- Population: {req.population or "Unknown"}
- Road Block: {req.roadBlock or "Unknown"}
"""

        prompt += """
Return ONLY JSON matching the schema below. Never explain outside of the JSON.
Schema:
{
  "severity": "string (Low, Medium, High, Critical)",
  "reasoning": "string"
}"""
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.1,
            ),
        )
        
        try:
            result = json.loads(response.text)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Failed to parse AI response")
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

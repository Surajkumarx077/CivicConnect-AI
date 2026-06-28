import { GoogleGenAI, Type, Schema } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getGemini() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing");
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

export async function analyzeIssueImage(imageUrl: string, imageBase64?: string, mimeType: string = "image/jpeg") {
  const aiClient = getGemini();
  
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      issue_type: { 
        type: Type.STRING, 
        description: "Must be one of: Garbage, Pothole, Water Leakage, Streetlight, Road Damage, Illegal Dumping, Tree Fallen, Drainage, Animal, Construction Waste" 
      },
      confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" },
      severity: { type: Type.STRING },
      department: { type: Type.STRING },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      safety_advice: { type: Type.STRING },
      estimated_priority: { type: Type.STRING },
      duplicate_keywords: { 
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: [
      "issue_type", "confidence", "severity", "department", 
      "title", "description", "safety_advice", "estimated_priority", 
      "duplicate_keywords"
    ]
  };

  const contents: any[] = [];
  
  if (imageBase64) {
    contents.push({
      inlineData: {
        data: imageBase64,
        mimeType: mimeType
      }
    });
  }
  
  contents.push(
    `Analyze this civic issue image. Return ONLY JSON matching the schema. Never return markdown. Never explain.`
  );
  if (!imageBase64) {
    contents.push(`Image URL: ${imageUrl}`);
  }
  
  const response = await aiClient.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.1,
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function generateComplaint(
  issueType: string,
  location: string,
  severity: string,
  description: string
) {
  const aiClient = getGemini();

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      complaint_en: { type: Type.STRING },
      complaint_hi: { type: Type.STRING },
      suggested_department: { type: Type.STRING },
      priority: { type: Type.STRING }
    },
    required: ["title", "complaint_en", "complaint_hi", "suggested_department", "priority"]
  };

  const prompt = `Generate a professional municipal complaint.
Input:
Issue Type: ${issueType}
Location: ${location}
Severity: ${severity}
Description: ${description}

Output a formal complaint in both English and Hindi. Return ONLY JSON matching the schema. Never explain.`;

  const response = await aiClient.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [prompt],
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.2,
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function compareReports(report1: any, report2: any) {
  const aiClient = getGemini();

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      duplicate: { type: Type.BOOLEAN },
      confidence: { type: Type.NUMBER },
      reason: { type: Type.STRING }
    },
    required: ["duplicate", "confidence", "reason"]
  };

  const prompt = `Compare these two reports to determine if they are duplicates.
Report 1:
- Image Description: ${report1.imageDescription || "N/A"}
- Location: ${report1.location}
- Issue Type: ${report1.issueType}
- Time: ${report1.time}
- Description: ${report1.description}

Report 2:
- Image Description: ${report2.imageDescription || "N/A"}
- Location: ${report2.location}
- Issue Type: ${report2.issueType}
- Time: ${report2.time}
- Description: ${report2.description}

Return ONLY JSON matching the schema. Never explain.`;

  const response = await aiClient.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [prompt],
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.1,
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function determineSeverity(
  issueType: string,
  description: string,
  location?: string,
  factors?: {
    traffic?: string;
    healthRisk?: string;
    accidentRisk?: string;
    population?: string;
    roadBlock?: string;
  }
) {
  const aiClient = getGemini();

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      severity: { type: Type.STRING, description: "Must be one of: Low, Medium, High, Critical" },
      reasoning: { type: Type.STRING }
    },
    required: ["severity", "reasoning"]
  };

  let promptStr = `Determine the severity of this civic issue.
Possible values: Low, Medium, High, Critical
Consider factors like Traffic, Health Risk, Accident Risk, Population, and Road Block if provided.
Explain your reasoning.

Input:
Issue Type: ${issueType}
Description: ${description}
Location: ${location || "N/A"}
`;

  if (factors) {
    promptStr += `
Factors:
- Traffic: ${factors.traffic || "Unknown"}
- Health Risk: ${factors.healthRisk || "Unknown"}
- Accident Risk: ${factors.accidentRisk || "Unknown"}
- Population: ${factors.population || "Unknown"}
- Road Block: ${factors.roadBlock || "Unknown"}
`;
  }

  promptStr += `\nReturn ONLY JSON matching the schema. Never explain outside of the JSON.`;

  const responseSev = await aiClient.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [promptStr],
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.1,
    }
  });

  return JSON.parse(responseSev.text || "{}");
}

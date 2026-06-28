import { Router, Request, Response } from "express";
import { authMiddleware } from "./middleware";
import { ReportSubmissionSchema, ComplaintGenerationSchema, ReportComparisonSchema, SeverityDeterminationSchema } from "./schema";
import { analyzeIssueImage, generateComplaint, compareReports, determineSeverity } from "./gemini";
import admin from "firebase-admin";
import { getFirestore, FieldValue, GeoPoint } from "firebase-admin/firestore";

export const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
  res.json({ status: "ok", service: "CivicConnect API" });
});

// Protected route to create a report
apiRouter.post("/reports", authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    
    // Validation
    const result = ReportSubmissionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation Error", details: result.error.flatten() });
    }
    
    const { imageUrl, latitude, longitude, address, imageBase64 } = result.data as any;
    
    // Gemini Integration
    const analysis = await analyzeIssueImage(imageUrl || "", imageBase64);
    
    // Save to Firestore
    const db = getFirestore();
    const reportRef = db.collection("reports").doc();
    
    const reportData = {
      reportId: reportRef.id,
      authorId: user.uid,
      title: analysis.title,
      description: analysis.description,
      category: analysis.issue_type,
      severity: analysis.severity,
      status: "Open",
      department: analysis.department,
      imageUrl: imageUrl,
      location: new GeoPoint(latitude, longitude),
      address: address || "Unknown Location",
      upvoteCount: 0,
      commentCount: 0,
      isDuplicate: false,
      aiAnalysis: {
        confidence: analysis.confidence,
        safetyAdvice: analysis.safety_advice,
        estimatedPriority: analysis.estimated_priority,
        duplicateKeywords: analysis.duplicate_keywords,
      },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    
    await reportRef.set(reportData);
    
    return res.status(201).json({ 
      message: "Report created successfully",
      report: reportData 
    });
    
  } catch (error: any) {
    console.error("Error creating report:", error);
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// Route to generate professional complaint
apiRouter.post("/complaint/generate", authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const result = ComplaintGenerationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation Error", details: result.error.flatten() });
    }

    const { issueType, location, severity, description } = result.data;
    
    const complaint = await generateComplaint(issueType, location, severity, description);
    
    return res.status(200).json(complaint);
    
  } catch (error: any) {
    console.error("Error generating complaint:", error);
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// Route to compare reports
apiRouter.post("/reports/compare", authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const result = ReportComparisonSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation Error", details: result.error.flatten() });
    }

    const { report1, report2 } = result.data;
    
    const comparison = await compareReports(report1, report2);
    
    return res.status(200).json(comparison);
    
  } catch (error: any) {
    console.error("Error comparing reports:", error);
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// Route to determine severity
apiRouter.post("/severity/determine", authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const result = SeverityDeterminationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation Error", details: result.error.flatten() });
    }

    const { issueType, description, location, traffic, healthRisk, accidentRisk, population, roadBlock } = result.data;
    
    const factors = { traffic, healthRisk, accidentRisk, population, roadBlock };
    const severityResult = await determineSeverity(issueType, description, location, factors);
    
    return res.status(200).json(severityResult);
    
  } catch (error: any) {
    console.error("Error determining severity:", error);
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});


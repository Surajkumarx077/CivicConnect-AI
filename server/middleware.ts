import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

// Initialize Firebase Admin lazily
let adminApp: any = null;

function getFirebaseAdmin() {
  if (!adminApp) {
    adminApp = admin.initializeApp({
      projectId: "able-dock-54dh4" // from our earlier setup
    });
  }
  return adminApp;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid Bearer token" });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const firebaseAdmin = getFirebaseAdmin();
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

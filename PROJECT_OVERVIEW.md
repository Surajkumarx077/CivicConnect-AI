                                                                                                                                                                                                                                                                                  # CivicConnect AI - Project Overview & Structure

## 1. Project Description
CivicConnect AI is an AI-powered platform designed to streamline civic issue reporting and resolution. It empowers citizens to report local issues (e.g., potholes, broken streetlights) and provides city administrators with powerful tools to manage, verify, and resolve these issues efficiently.

The platform leverages the **Gemini API** for automated severity determination and complaint generation, **Google Maps** for geospatial visualization, and **Firebase** for data persistence and authentication.

---

## 2. Core Features

### For Citizens:
* **Interactive Dashboard:** View, upvote, and track the status of reported civic issues.
* **Map Explorer:** A geospatial view of all reports using Google Maps, with color-coded markers based on severity and status.
* **AI Complaint Generation:** Uses Gemini AI to automatically generate formal complaints based on user input.
* **Gamification:** Users earn points and badges for reporting issues, voting, and helping others (outlined in `GAMIFICATION_DESIGN.md`).

### For Administrators:
* **Admin Dashboard:** A centralized control panel to view all reports, filter by department or status, and update report statuses (Approve, Reject, Resolve).
* **AI Severity Determination:** Gemini AI automatically analyzes the description and factors (traffic, health risks) to determine the severity (Critical, High, Medium, Low) of a reported issue.
* **Department Assignment:** Easily route verified reports to specific municipal departments (e.g., Sanitation, Public Works).

---

## 3. Tech Stack
* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, `@vis.gl/react-google-maps`, Lucide React (Icons).
* **Backend (Node.js):** Express.js, TypeScript, Gemini SDK (`@google/genai`).
* **Backend (Python):** FastAPI (Alternative/Microservice for AI endpoints).
* **Database & Auth:** Firebase (Firestore & Firebase Authentication).

---

## 4. Directory Structure

```text
/
├── src/                      # Frontend React application
│   ├── components/           # Reusable UI components (e.g., layout, ProtectedRoute)
│   ├── data/                 # Static or dummy data (e.g., dummyReports.ts)
│   ├── pages/                # Top-level route components
│   │   ├── AdminDashboard.tsx# Admin interface for managing reports
│   │   ├── Dashboard.tsx     # Citizen interface for tracking reports
│   │   ├── MapExplorer.tsx   # Google Maps integration for viewing reports
│   │   ├── Home.tsx          # Landing page
│   │   └── Auth.tsx          # Login and registration
│   ├── store/                # State management (e.g., AuthContext.tsx)
│   ├── types/                # Shared TypeScript interfaces (e.g., index.ts)
│   ├── App.tsx               # Main application component and router
│   ├── main.tsx              # React entry point
│   └── index.css             # Global Tailwind styles
│
├── server/                   # Node.js Express Backend
│   ├── routes.ts             # API route definitions (e.g., /api/severity/determine)
│   ├── gemini.ts             # Gemini AI integration logic (severity, complaints)
│   ├── middleware.ts         # Express middleware (e.g., authentication)
│   └── schema.ts             # Zod validation schemas for API requests
│
├── fastapi_backend/          # Python FastAPI Backend (Microservice)
│   └── main.py               # API endpoints mirroring Node functionality using Python
│
├── firebase-blueprint.json   # Firestore database schema definitions
├── GAMIFICATION_DESIGN.md    # Documentation for the points and badge system
├── package.json              # Node.js dependencies and build scripts
└── vite.config.ts            # Vite bundler configuration
```

---

## 5. Key Architecture Decisions

### Dual Backend Support
The project contains both a Node.js/Express backend (`/server`) and a Python/FastAPI backend (`/fastapi_backend`). This allows flexibility in handling heavy AI operations or serving as microservices for different platforms.

### AI Integration (`/server/gemini.ts`)
All Gemini interactions are strictly kept on the server-side to protect API keys. The server exposes structured JSON endpoints for the frontend to consume.
* `determineSeverity`: Evaluates civic issues against environmental factors to prioritize city response.
* `generateComplaint`: Drafts formal civic letters.
* `compareReports`: Detects duplicate reports based on visual and textual data.

### Geospatial Mapping (`/src/pages/MapExplorer.tsx`)
Uses Google's official `@vis.gl/react-google-maps` library. Markers are dynamically styled (Red, Orange, Yellow, Green) based on the AI-determined severity and resolution status.

### State & Authentication
Authentication is handled via Firebase Auth, heavily utilizing a global `AuthContext` to protect routes and ensure only authorized users access the Dashboard and Admin tools.

# CivicConnect AI Architecture

## 1. System Architecture & Deployment

CivicConnect AI is built as a full-stack application using React (Vite) for the frontend and Express (Node.js) for the backend, deployed on Google Cloud Run. It leverages Firebase for authentication and database, and Google Maps for location services.

```mermaid
graph TD
    Client[React Frontend] -->|HTTPS / REST| CDN[Cloud CDN / Load Balancer]
    CDN --> CloudRun[Cloud Run - Express Backend]
    
    CloudRun -->|Admin SDK| Firestore[(Firestore DB)]
    CloudRun -->|API Key| Gemini[Gemini Vision 1.5 API]
    
    Client -->|Maps API Key| Maps[Google Maps Platform]
    Client -->|Client SDK| FirebaseAuth[Firebase Auth]
    Client -->|Uploads| FirebaseStorage[Firebase Storage]
```

## 2. Folder Structure

The project follows a modular, feature-based folder structure to ensure maintainability and scalability.

```text
/
├── .env.example              # Environment variables template
├── package.json              # Project dependencies and scripts
├── server.ts                 # Express backend entry point
├── vite.config.ts            # Vite build configuration
├── src/                      # Frontend source code
│   ├── components/           # Reusable UI components
│   │   ├── common/           # Buttons, inputs, modals
│   │   ├── map/              # Google Maps components
│   │   └── reports/          # Report cards, feeds
│   ├── hooks/                # Custom React hooks (e.g., useAuth, useReports)
│   ├── lib/                  # Utility functions and configurations
│   │   ├── firebase.ts       # Firebase client initialization
│   │   └── utils.ts          # Helper functions (formatting, validation)
│   ├── pages/                # Page-level components
│   │   ├── Dashboard.tsx     # Main application view
│   │   ├── ReportIssue.tsx   # Issue reporting flow
│   │   └── Auth.tsx          # Login/Signup view
│   ├── types/                # TypeScript interfaces and types
│   ├── App.tsx               # Main React application component
│   └── main.tsx              # React DOM entry point
└── dist/                     # Compiled production build
```

## 3. Database Schema & Firestore Collections

We use Firebase Firestore as a NoSQL database.

```mermaid
erDiagram
    USERS ||--o{ REPORTS : creates
    USERS ||--o{ UPVOTES : casts
    REPORTS ||--o{ UPVOTES : receives
    
    USERS {
        string uid PK
        string displayName
        string email
        string photoURL
        timestamp createdAt
    }
    
    REPORTS {
        string reportId PK
        string authorId FK
        string title
        string description
        string category "Pothole, Garbage, Water, etc."
        string severity "Low, Moderate, Critical"
        string status "Open, In Progress, Resolved"
        string department "Public Works, Sanitation, etc."
        string imageUrl
        geopoint location
        int upvoteCount
        timestamp createdAt
        timestamp updatedAt
    }
    
    UPVOTES {
        string upvoteId PK
        string reportId FK
        string userId FK
        timestamp createdAt
    }
```

## 4. Authentication Flow

Firebase Authentication is used to secure the application.

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React Frontend
    participant Auth as Firebase Auth
    participant Backend as Express Backend
    participant DB as Firestore
    
    User->>Frontend: Clicks Login (Google/Email)
    Frontend->>Auth: Request Authentication
    Auth-->>Frontend: Returns JWT Token & User Profile
    Frontend->>Backend: API Request + Bearer Token
    Backend->>Auth: Verify Token (Admin SDK)
    Auth-->>Backend: Token Valid (uid)
    Backend->>DB: Fetch/Update User Data
    DB-->>Backend: User Record
    Backend-->>Frontend: Authorized Data Response
    Frontend-->>User: Displays Dashboard
```

## 5. API Flow (Issue Reporting)

When a user submits a report, the backend orchestrates image uploads and AI analysis.

```mermaid
sequenceDiagram
    actor User
    participant App as Frontend
    participant Storage as Firebase Storage
    participant API as Express API
    participant Gemini as Gemini Vision API
    participant DB as Firestore
    
    User->>App: Uploads Image & Location
    App->>Storage: Upload Image to Bucket
    Storage-->>App: Returns Image URL
    App->>API: POST /api/reports (Image URL, Lat/Lng)
    API->>Gemini: Analyze Image (Detect issue, severity, department)
    Gemini-->>API: Returns structured JSON analysis
    API->>DB: Save Report (AI data + Image URL + Location)
    DB-->>API: Success (reportId)
    API-->>App: 201 Created (Report Data)
    App-->>User: Show Success & Update Map
```

## 6. Gemini Integration

The Gemini Vision 1.5 Pro model acts as the core intelligence layer. It is accessed securely from the Node.js backend to prevent exposing the API key to the client.

- **Input:** Image URL (or base64) and context (e.g., location data).
- **Prompt:** "Analyze this image of a civic issue. Identify the type of issue (pothole, garbage, etc.), estimate severity (Low, Moderate, Critical), generate a professional complaint description, and recommend the responsible government department."
- **Output:** Structured JSON containing `category`, `severity`, `description`, `department`, and `multilingual_descriptions`.

## 7. Google Maps Integration

The `@vis.gl/react-google-maps` library is used for a declarative map experience.

- **Map View:** Displays the city or user's current location.
- **Markers:** Custom markers represent reports. Marker colors correspond to the AI-predicted severity (e.g., Red = Critical, Amber = Moderate, Green = Resolved).
- **Interactions:** Clicking a map marker opens a bottom sheet or side panel with the full report details fetched from Firestore.

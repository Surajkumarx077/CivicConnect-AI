# CivicConnect AI

**Smart Civic Issue Reporting & Management**

AI-powered hyperlocal civic issue reporting platform using Google Gemini, Firebase, FastAPI, and Google Maps.

CivicConnect AI bridges the gap between citizens and local government by leveraging AI to streamline issue reporting. Users simply upload a photo of a civic issue (like a pothole, illegal dumping, or broken streetlight), and our Gemini-powered engine automatically detects the problem, predicts its severity, and drafts an official complaint routed to the correct department.

## Features

- **🤖 AI-Powered Analysis**: Auto-detects issue categories, estimates severity, and assigns the correct municipal department using Gemini Vision.
- **🗺️ Interactive Map Explorer**: View reported issues in your community on a live, interactive Google Map.
- **🔒 Secure Authentication**: Firebase-powered user accounts to track your reports and community impact.
- **📊 Real-time Dashboard**: Track the status of reports and view AI-generated insights.
- **📱 Responsive Design**: A clean, accessible interface that works seamlessly on both desktop and mobile devices.

## Tech Stack

- **Frontend**: React (TypeScript), Tailwind CSS, Vite
- **Backend**: Express.js, Node.js
- **Database & Auth**: Firebase Firestore, Firebase Authentication
- **AI Integration**: Google Gemini API
- **Mapping**: Google Maps Platform

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or higher)
- A Google Cloud Project (for Gemini API and Google Maps API)
- A Firebase Project (for Auth and Firestore)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/civicconnect-ai.git
   cd civicconnect-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy the example environment file and fill in your keys:
   ```bash
   cp .env.example .env
   ```
   *Note: You will need to provide your `GEMINI_API_KEY`, `VITE_GOOGLE_MAPS_API_KEY`, and Firebase configuration credentials.*

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Architecture

This project uses a full-stack architecture where a Node/Express backend safely proxies requests to the Gemini API and Firebase Admin SDK, ensuring sensitive credentials are never exposed to the client browser. The frontend is a React Single Page Application (SPA) styled with Tailwind CSS.

## License

This project is open-source and available under the MIT License.

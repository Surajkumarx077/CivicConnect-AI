# CivicConnect AI - Frontend Architecture & Folder Structure

We follow a modular, scalable React architecture based on feature separation and clean code principles.

## `src/` - Root Source Directory
The main container for all application source code.

### `src/assets/`
Static assets like images, SVGs, and fonts that are imported directly into components.
- `icons/` - SVG icons used across the app.
- `images/` - Global images like logos or placeholder graphics.

### `src/components/`
Reusable UI components, separated by domain or function.
- `common/` - Dumb/presentational components like Buttons, Inputs, Modals, and Spinners. These rely purely on props and have no side effects.
- `layout/` - Structural components like `Header.tsx`, `Sidebar.tsx`, `Footer.tsx`, and overall page wrappers.
- `map/` - Complex, specific components related to the Google Maps integration (e.g., `IssueMap.tsx`, `MapMarker.tsx`).
- `reports/` - Domain-specific components for reports (e.g., `ReportCard.tsx`, `ReportFeed.tsx`).

### `src/hooks/`
Custom React Hooks to encapsulate reusable stateful logic.
- `useAuth.ts` - Firebase Authentication logic and state.
- `useLocation.ts` - Browser Geolocation API wrapper.
- `useReports.ts` - Logic for fetching and mutating report data.

### `src/lib/`
Configuration and initialization for third-party libraries.
- `firebase.ts` - Firebase App, Auth, Firestore, and Storage initialization.
- `axios.ts` - Axios instance configuration, interceptors, and default headers.

### `src/pages/`
Route-level components. Each file represents a full page in the application.
- `Dashboard.tsx` - Main view showing the map and recent reports.
- `ReportIssue.tsx` - The form page to submit a new civic issue.
- `Auth.tsx` - Login and registration screen.

### `src/services/`
Functions for interacting with external APIs and databases. Separating this from UI components makes testing and refactoring easier.
- `api.ts` - Backend Express API wrappers.
- `reportsService.ts` - Firestore/API methods specifically for report CRUD operations.

### `src/store/`
Global state management (if applicable, e.g., using Zustand or React Context).
- `AuthContext.tsx` - Global context provider for the current user session.

### `src/types/`
TypeScript type definitions and interfaces.
- `index.ts` - Shared models like `User`, `Report`, `Location`.

### `src/utils/`
Pure helper functions that do not depend on React.
- `formatDate.ts` - Date parsing and formatting.
- `validators.ts` - Form validation helpers for React Hook Form.

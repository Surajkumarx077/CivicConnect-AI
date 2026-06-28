# Gamification & Rewards System Design

## 1. Points System
Users earn points for active civic participation to encourage community engagement.

### Point Values
*   **Reporting (10 Points)**: Earned when a user successfully submits a new civic issue report (e.g., pothole, broken streetlight).
*   **Voting (1 Point)**: Earned when a user upvotes an existing report, helping to prioritize community issues.
*   **Verified Reports (50 Points)**: Awarded when a submitted report is verified by an admin or the respective civic department as a legitimate and actionable issue.
*   **Helping Others (20 Points)**: Awarded when a user provides helpful information, updates, or comments on another user's report (e.g., confirming an issue is resolved, providing a temporary workaround).

## 2. Badge Logic
Badges represent milestones in the user's civic journey, unlocking as they accumulate points and interact with the platform.

### Standard Point-Based Badges
*   **Bronze Citizen**: 100 Points
*   **Silver Citizen**: 500 Points
*   **Gold Citizen**: 1,000 Points
*   **Civic Hero**: 5,000 Points

### Action-Specific Badges (Examples)
*   **First Reporter**: Awarded on the first submitted report.
*   **Community Voice**: Awarded after casting 10 votes on community issues.
*   **Trusted Source**: Awarded when 3 of the user's reports are officially "Verified".
*   **Good Samaritan**: Awarded for receiving "Helping Others" points 5 times.

## 3. Suggested Firestore Schema

This schema is designed to track points, badges, and the necessary relationship between users, their actions, and the gamification ledger.

### Collection: `users`
Stores the overall gamification state for each user.
```json
{
  "uid": "string",
  "displayName": "string",
  "email": "string",
  "gamification": {
    "totalPoints": "number",
    "badges": ["badge_bronze", "badge_first_reporter"],
    "stats": {
      "reportsCreated": "number",
      "votesGiven": "number",
      "verifiedReports": "number",
      "helpedOthersCount": "number"
    }
  },
  "createdAt": "timestamp"
}
```

### Collection: `badges` (Optional, Reference Data)
Stores metadata for the badges available in the system.
```json
{
  "badgeId": "string (e.g., badge_bronze)",
  "name": "string (e.g., Bronze Citizen)",
  "description": "string",
  "iconUrl": "string",
  "criteriaType": "string (e.g., points, action)",
  "criteriaValue": "number"
}
```

### Collection: `point_transactions` (Ledger)
Crucial for a robust points system to prevent race conditions and maintain an auditable ledger of *why* points were awarded.

```json
{
  "transactionId": "string",
  "userId": "string",
  "action": "string (e.g., REPORT_SUBMITTED, VOTE_CAST, REPORT_VERIFIED)",
  "pointsDelta": "number (e.g., 10, 1, 50)",
  "referenceId": "string (e.g., the ID of the report or vote)",
  "timestamp": "timestamp"
}
```

### Collection: `reports` (Updates for Gamification)
The reports collection would include fields indicating verification status and helpful comments to trigger the 50 and 20 point rewards.
```json
{
  "reportId": "string",
  "authorId": "string",
  "title": "string",
  "status": "string (e.g., open, in-progress, resolved)",
  "isVerified": "boolean",
  "verifiedBy": "string (Admin UID)",
  "verifiedAt": "timestamp"
}
```

### Gamification Cloud Function Logic (Implementation Note)
When updating points, use Firestore transactions or Cloud Functions triggered by the `point_transactions` collection to atomically increment the `totalPoints` in the `users` document and check for new badge thresholds.

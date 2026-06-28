export interface Report {
  id: string;
  title: string;
  location: string;
  category: string;
  severity: "Critical" | "High" | "Moderate" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved" | "Rejected";
  upvotes: number;
  timeAgo: string;
  imageUrl?: string;
  department?: string;
  lat?: number;
  lng?: number;
  description?: string;
  isVerified?: boolean;
}

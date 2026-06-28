import { Report } from "../types";

export const dummyReports: Report[] = [
  {
    id: "1",
    title: "Major Main Water Leakage",
    location: "5th Ave North, Midtown",
    category: "Water",
    severity: "Critical",
    status: "Open",
    upvotes: 14,
    timeAgo: "2m ago",
    department: "Public Works",
    lat: 37.7749,
    lng: -122.4194,
    description: "Huge water leak in the middle of the road.",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "2",
    title: "Broken Street Lighting",
    location: "Sector-7 Block",
    category: "Infrastructure",
    severity: "High",
    status: "In Progress",
    upvotes: 8,
    timeAgo: "45m ago",
    department: "Power & Light",
    lat: 37.7849,
    lng: -122.4094,
    description: "Street light is completely out, creating a safety hazard.",
    imageUrl: "https://images.unsplash.com/photo-1512411995874-51ce4a822097?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "3",
    title: "Illegal Garbage Dumping",
    location: "Alley behind Central Market",
    category: "Sanitation",
    severity: "Low",
    status: "Resolved",
    upvotes: 3,
    timeAgo: "1h ago",
    department: "Sanitation",
    lat: 37.7649,
    lng: -122.4294,
    description: "A pile of garbage left in the alleyway.",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "4",
    title: "Deep Pothole on Highway 4",
    location: "Highway 4, Mile Marker 12",
    category: "Roads",
    severity: "Critical",
    status: "Open",
    upvotes: 25,
    timeAgo: "3h ago",
    department: "Transportation",
    lat: 37.7549,
    lng: -122.4194,
    description: "Very deep pothole causing car damage.",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "5",
    title: "Fallen Tree Blocking Sidewalk",
    location: "Oak St & 2nd Ave",
    category: "Parks",
    severity: "Medium",
    status: "Open",
    upvotes: 5,
    timeAgo: "5h ago",
    department: "Parks & Recreation",
    lat: 37.7749,
    lng: -122.4394,
    description: "A large tree fell and is blocking the walkway.",
    imageUrl: "https://images.unsplash.com/photo-1596767664319-35c8e310029b?auto=format&fit=crop&w=800&q=80"
  }
];

export interface Internship {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: "Remote" | "On-site" | "Hybrid";
  duration: string;
  stipend: number;
  stipendType: "Fixed" | "Performance-based" | "Negotiable";
  startDate: string;
  deadline: string;
  description: string;
  requirements: string[];
  skills: string[];
  category: string;
  postedDate: string;
  applicants: number;
  rating: number;
  isBookmarked?: boolean;
  isLiked?: boolean;
  imageUrl?: string;
  combinedScore?: number;
  simScore?: number;
  metaScore?: number;
}

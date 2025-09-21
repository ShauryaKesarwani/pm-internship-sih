interface Company {
  _id: string;
  name: string;
  uniqueName: string;
  description: string;
  industry: string;
  website: string;
  location: string;
}

export interface Internship {
  id: string;
  title: string;
  company: Company | string; // Allow string for backward compatibility
  companyLogo: string;
  location: string;
  type: "Remote" | "On-site" | "Hybrid";
  duration: string;
  stipend: number | string;
  stipendType: "Fixed" | "Performance-based" | "Negotiable";
  startDate: string;
  deadline: string;
  description: string;
  requirements: string[] | string;
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
  // New detailed fields
  responsibilities?: string[];
  department?: string;
  companyDetails?: {
    name: string;
    industry: string;
    website: string | null;
    location: string;
    _id: string;
  };
  fullLocation?: {
    address: string | null;
    city: string | null;
    pinCode: number | null;
  };
}

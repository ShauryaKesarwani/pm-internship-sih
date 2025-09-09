export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`,
    {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      ...init,
    }
  );
  if (!res.ok) {
    let detail: string | undefined;
    try {
      const data = await res.json();
      detail = (data && (data.message || data.error)) as string | undefined;
    } catch {}
    throw new Error(detail || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Types for internship data
export interface InternshipHistory {
  id: number;
  company: string;
  position: string;
  status: 'Completed' | 'Rejected' | 'Cancelled';
  duration: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface OpenApplication {
  id: number;
  company: string;
  position: string;
  status: 'Under Review' | 'Interview Scheduled' | 'Application Submitted' | 'Rejected';
  appliedDate: string;
  deadline: string;
  location: string;
  description: string;
}

// API functions for internship data
export async function fetchInternshipHistory(): Promise<InternshipHistory[]> {
  try {
    return await fetchJson<InternshipHistory[]>('/api/internships/history');
  } catch (error) {
    console.error('Failed to fetch internship history:', error);
    // Return dummy data as fallback
    return [
      {
        id: 1,
        company: "Google",
        position: "Software Engineering Intern",
        status: "Completed",
        duration: "3 months",
        startDate: "June 2024",
        endDate: "August 2024",
        location: "Mountain View, CA",
        description: "Worked on Google Cloud Platform features and contributed to open-source projects."
      },
      {
        id: 2,
        company: "Microsoft",
        position: "Product Management Intern",
        status: "Completed",
        duration: "2 months",
        startDate: "January 2024",
        endDate: "February 2024",
        location: "Seattle, WA",
        description: "Assisted in product strategy and user research for Office 365 features."
      },
      {
        id: 3,
        company: "Amazon",
        position: "Data Science Intern",
        status: "Rejected",
        duration: "3 months",
        startDate: "May 2024",
        endDate: "August 2024",
        location: "Seattle, WA",
        description: "Applied for machine learning research position in AWS team."
      }
    ];
  }
}

export async function fetchOpenApplications(): Promise<OpenApplication[]> {
  try {
    return await fetchJson<OpenApplication[]>('/api/internships/applications');
  } catch (error) {
    console.error('Failed to fetch open applications:', error);
    // Return dummy data as fallback
    return [
      {
        id: 1,
        company: "Apple",
        position: "iOS Development Intern",
        status: "Under Review",
        appliedDate: "2024-12-01",
        deadline: "2024-12-15",
        location: "Cupertino, CA",
        description: "Developing iOS applications using Swift and SwiftUI."
      },
      {
        id: 2,
        company: "Meta",
        position: "Frontend Engineering Intern",
        status: "Interview Scheduled",
        appliedDate: "2024-11-28",
        deadline: "2024-12-20",
        location: "Menlo Park, CA",
        description: "Building user interfaces for Meta's social platforms."
      },
      {
        id: 3,
        company: "Netflix",
        position: "Backend Engineering Intern",
        status: "Application Submitted",
        appliedDate: "2024-12-05",
        deadline: "2024-12-25",
        location: "Los Gatos, CA",
        description: "Working on scalable backend systems for streaming services."
      }
    ];
  }
}



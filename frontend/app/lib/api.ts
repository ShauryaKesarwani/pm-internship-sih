export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:7470";

export async function fetchJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
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

// Types for user profile data
export interface UserData {
  _id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  field?: string;
  gender?: string;
  about?: string;
  title?: string;
  location?: string;
  contact?: string;
  residence?: {
    pin?: number;
    city?: string;
    state?: string;
  };
  resume?: {
    skills?: string[];
    socialLinks?: string[];
    certifications?: string[];
  };
  links?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

// Types for internship data
export interface InternshipHistory {
  id: number;
  company: string;
  position: string;
  status: "Completed" | "Rejected" | "Cancelled";
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
  status:
    | "Under Review"
    | "Interview Scheduled"
    | "Application Submitted"
    | "Rejected";
  appliedDate: string;
  deadline: string;
  location: string;
  description: string;
}

// Types for test results
export interface TestResult {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  testId: string;
  testName: string;
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: string;
  timeTaken: number;
  status: string;
  skills: string[];
  answers: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
  overallRating: string;
}

// API functions
export async function fetchUserProfile(): Promise<UserData> {
  try {
    const data = await fetchJson<{ success: boolean; user: UserData }>(
      "/user/profile"
    );
    if (data.success && data.user) {
      return {
        ...data.user,
        resume: {
          skills: data.user.skills || [],
          socialLinks: data.user.socialLinks || [],
          certifications: data.user.certifications || [],
        },
        links: {
          linkedin:
            data.user.socialLinks?.find((link: string) =>
              link.includes("linkedin")
            ) || "",
          github:
            data.user.socialLinks?.find((link: string) =>
              link.includes("github")
            ) || "",
          website:
            data.user.socialLinks?.find(
              (link: string) =>
                !link.includes("linkedin") && !link.includes("github")
            ) || "",
        },
      };
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
}

export async function fetchInternshipHistory(): Promise<InternshipHistory[]> {
  try {
    return await fetchJson<InternshipHistory[]>("/internships/history");
  } catch (error) {
    console.error("Failed to fetch internship history:", error);
    // Return dummy data as fallback
    return [
      {
        id: 1,
        company: "Google",
        position: "Software Engineering Intern",
        status: "Completed",
        duration: "3 months",
        startDate: "2024-06-01",
        endDate: "2024-08-31",
        location: "Mountain View, CA",
        description:
          "Worked on Google Cloud Platform features and contributed to open-source projects.",
      },
      {
        id: 2,
        company: "Microsoft",
        position: "Product Management Intern",
        status: "Completed",
        duration: "2 months",
        startDate: "2024-01-01",
        endDate: "2024-02-28",
        location: "Seattle, WA",
        description:
          "Assisted in product strategy and user research for Office 365 features.",
      },
      {
        id: 3,
        company: "Amazon",
        position: "Data Science Intern",
        status: "Rejected",
        duration: "3 months",
        startDate: "2024-05-01",
        endDate: "2024-08-31",
        location: "Seattle, WA",
        description:
          "Applied for machine learning research position in AWS team.",
      },
    ];
  }
}

export async function fetchOpenApplications(): Promise<OpenApplication[]> {
  try {
    return await fetchJson<OpenApplication[]>("/internships/applications");
  } catch (error) {
    console.error("Failed to fetch open applications:", error);
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
        description: "Developing iOS applications using Swift and SwiftUI.",
      },
      {
        id: 2,
        company: "Meta",
        position: "Frontend Engineering Intern",
        status: "Interview Scheduled",
        appliedDate: "2024-11-28",
        deadline: "2024-12-20",
        location: "Menlo Park, CA",
        description: "Building user interfaces for Meta's social platforms.",
      },
      {
        id: 3,
        company: "Netflix",
        position: "Backend Engineering Intern",
        status: "Application Submitted",
        appliedDate: "2024-12-05",
        deadline: "2024-12-25",
        location: "Los Gatos, CA",
        description:
          "Working on scalable backend systems for streaming services.",
      },
    ];
  }
}

export async function fetchTestResults(): Promise<TestResult[]> {
  try {
    return await fetchJson<TestResult[]>("/test-results");
  } catch (error) {
    console.error("Failed to fetch test results:", error);
    // Return dummy data as fallback
    return [
      {
        id: "1",
        userId: "user1",
        userName: "John Doe",
        userEmail: "john.doe@example.com",
        testId: "test1",
        testName: "Frontend Development Assessment",
        score: 85,
        maxScore: 100,
        percentage: 85,
        completedAt: "2024-12-10T10:30:00Z",
        timeTaken: 45,
        status: "completed",
        skills: ["React", "JavaScript", "CSS", "HTML"],
        answers: [
          {
            questionId: "q1",
            question: "What is React?",
            userAnswer: "A JavaScript library for building user interfaces",
            correctAnswer: "A JavaScript library for building user interfaces",
            isCorrect: true,
          },
          {
            questionId: "q2",
            question: "What is JSX?",
            userAnswer: "JavaScript XML syntax extension",
            correctAnswer: "JavaScript XML syntax extension",
            isCorrect: true,
          },
        ],
        overallRating: "excellent",
      },
      {
        id: "2",
        userId: "user2",
        userName: "Jane Smith",
        userEmail: "jane.smith@example.com",
        testId: "test2",
        testName: "Backend Development Assessment",
        score: 72,
        maxScore: 100,
        percentage: 72,
        completedAt: "2024-12-09T14:20:00Z",
        timeTaken: 60,
        status: "completed",
        skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
        answers: [
          {
            questionId: "q1",
            question: "What is Node.js?",
            userAnswer: "A JavaScript runtime built on Chrome's V8 engine",
            correctAnswer: "A JavaScript runtime built on Chrome's V8 engine",
            isCorrect: true,
          },
          {
            questionId: "q2",
            question: "What is middleware in Express?",
            userAnswer:
              "Functions that execute during the request-response cycle",
            correctAnswer:
              "Functions that execute during the request-response cycle",
            isCorrect: true,
          },
        ],
        overallRating: "good",
      },
      {
        id: "3",
        userId: "user3",
        userName: "Mike Johnson",
        userEmail: "mike.johnson@example.com",
        testId: "test1",
        testName: "Frontend Development Assessment",
        score: 45,
        maxScore: 100,
        percentage: 45,
        completedAt: "2024-12-08T16:45:00Z",
        timeTaken: 30,
        status: "completed",
        skills: ["React", "JavaScript", "CSS", "HTML"],
        answers: [
          {
            questionId: "q1",
            question: "What is React?",
            userAnswer: "A database management system",
            correctAnswer: "A JavaScript library for building user interfaces",
            isCorrect: false,
          },
          {
            questionId: "q2",
            question: "What is JSX?",
            userAnswer: "A programming language",
            correctAnswer: "JavaScript XML syntax extension",
            isCorrect: false,
          },
        ],
        overallRating: "poor",
      },
      {
        id: "4",
        userId: "user4",
        userName: "Sarah Wilson",
        userEmail: "sarah.wilson@example.com",
        testId: "test3",
        testName: "Data Science Assessment",
        score: 90,
        maxScore: 100,
        percentage: 90,
        completedAt: "2024-12-07T09:15:00Z",
        timeTaken: 75,
        status: "completed",
        skills: ["Python", "Pandas", "NumPy", "Machine Learning"],
        answers: [
          {
            questionId: "q1",
            question: "What is Pandas?",
            userAnswer: "A Python library for data manipulation and analysis",
            correctAnswer:
              "A Python library for data manipulation and analysis",
            isCorrect: true,
          },
          {
            questionId: "q2",
            question: "What is NumPy?",
            userAnswer: "A Python library for numerical computing",
            correctAnswer: "A Python library for numerical computing",
            isCorrect: true,
          },
        ],
        overallRating: "excellent",
      },
    ];
  }
}

export async function exportTestResults(format: string): Promise<Blob> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/test-results/export?format=${format}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to export test results: ${response.status}`);
    }
    return await response.blob();
  } catch (error) {
    console.error("Failed to export test results:", error);
    throw error;
  }
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Building2,
  Users,
  Star,
  ChevronDown,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Heart,
  Bookmark,
  Share2,
  Eye,
  ExternalLink,
} from "lucide-react";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";
import Menu from "../components/menu";

interface Internship {
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
  // Additional fields from recommendation API
  combinedScore?: number;
  simScore?: number;
  metaScore?: number;
}

const InternshipsPage = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [minStipend, setMinStipend] = useState(0);
  const [maxStipend, setMaxStipend] = useState(100000);
  const [sortBy, setSortBy] = useState("postedDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Generate functionality
  const [showGeneratedInternships, setShowGeneratedInternships] =
    useState(false);
  const [generatedInternships, setGeneratedInternships] = useState<
    Internship[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Dummy data for demonstration
  const dummyInternships: Internship[] = [
    {
      id: "1",
      title: "Frontend Developer Intern",
      company: "OpenAI",
      companyLogo: "https://picsum.photos/100/100?random=1",
      location: "San Francisco, CA",
      type: "Remote",
      duration: "6 months",
      stipend: 15000,
      stipendType: "Fixed",
      startDate: "2025-01-15",
      deadline: "2024-12-30",
      description:
        "Join our frontend team to build cutting-edge AI interfaces using React, TypeScript, and modern web technologies.",
      requirements: ["React", "TypeScript", "CSS", "Git"],
      skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Git"],
      category: "Technology",
      postedDate: "2024-12-01",
      applicants: 245,
      rating: 4.8,
      imageUrl: "https://picsum.photos/400/200?random=1",
    },
    {
      id: "2",
      title: "Data Science Intern",
      company: "Google",
      companyLogo: "https://picsum.photos/100/100?random=2",
      location: "Bangalore, India",
      type: "On-site",
      duration: "3 months",
      stipend: 25000,
      stipendType: "Fixed",
      startDate: "2025-02-01",
      deadline: "2025-01-15",
      description:
        "Work on machine learning models and data analysis projects that impact millions of users worldwide.",
      requirements: ["Python", "Machine Learning", "Statistics", "SQL"],
      skills: [
        "Python",
        "Machine Learning",
        "Pandas",
        "NumPy",
        "SQL",
        "Statistics",
      ],
      category: "Data Science",
      postedDate: "2024-11-28",
      applicants: 189,
      rating: 4.9,
      imageUrl: "https://picsum.photos/400/200?random=2",
    },
    {
      id: "3",
      title: "UI/UX Designer Intern",
      company: "Figma",
      companyLogo: "https://picsum.photos/100/100?random=3",
      location: "New York, NY",
      type: "Hybrid",
      duration: "4 months",
      stipend: 10000,
      stipendType: "Fixed",
      startDate: "2025-01-20",
      deadline: "2025-01-05",
      description:
        "Design intuitive user experiences and create beautiful interfaces for our design platform.",
      requirements: [
        "Figma",
        "Design Thinking",
        "Prototyping",
        "User Research",
      ],
      skills: [
        "Figma",
        "Adobe Creative Suite",
        "Prototyping",
        "User Research",
        "Design Systems",
      ],
      category: "Design",
      postedDate: "2024-11-25",
      applicants: 156,
      rating: 4.7,
      imageUrl: "https://picsum.photos/400/200?random=3",
    },
    {
      id: "4",
      title: "Backend Developer Intern",
      company: "Netflix",
      companyLogo: "https://picsum.photos/100/100?random=4",
      location: "Los Gatos, CA",
      type: "On-site",
      duration: "5 months",
      stipend: 20000,
      stipendType: "Fixed",
      startDate: "2025-02-15",
      deadline: "2025-01-20",
      description:
        "Build scalable backend services that power our streaming platform serving millions of users.",
      requirements: ["Node.js", "Python", "Databases", "APIs"],
      skills: [
        "Node.js",
        "Python",
        "PostgreSQL",
        "MongoDB",
        "REST APIs",
        "Microservices",
      ],
      category: "Technology",
      postedDate: "2024-11-20",
      applicants: 298,
      rating: 4.6,
      imageUrl: "https://picsum.photos/400/200?random=4",
    },
    {
      id: "5",
      title: "Product Management Intern",
      company: "Microsoft",
      companyLogo: "https://picsum.photos/100/100?random=5",
      location: "Seattle, WA",
      type: "Hybrid",
      duration: "6 months",
      stipend: 18000,
      stipendType: "Fixed",
      startDate: "2025-01-10",
      deadline: "2024-12-25",
      description:
        "Work with product teams to define features, analyze user data, and drive product strategy.",
      requirements: [
        "Analytics",
        "Product Strategy",
        "Communication",
        "Data Analysis",
      ],
      skills: [
        "Product Management",
        "Analytics",
        "SQL",
        "Figma",
        "Communication",
        "Strategy",
      ],
      category: "Product",
      postedDate: "2024-11-15",
      applicants: 167,
      rating: 4.5,
      imageUrl: "https://picsum.photos/400/200?random=5",
    },
    {
      id: "6",
      title: "DevOps Engineer Intern",
      company: "Amazon",
      companyLogo: "https://picsum.photos/100/100?random=6",
      location: "Austin, TX",
      type: "Remote",
      duration: "4 months",
      stipend: 22000,
      stipendType: "Fixed",
      startDate: "2025-02-01",
      deadline: "2025-01-10",
      description:
        "Learn cloud infrastructure, automation, and deployment pipelines in a fast-paced environment.",
      requirements: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Linux"],
      category: "Technology",
      postedDate: "2024-11-10",
      applicants: 134,
      rating: 4.4,
      imageUrl: "https://picsum.photos/400/200?random=6",
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchInternships = async () => {
      setIsLoading(true);
      try {
        // In real implementation, this would be an API call
        setTimeout(() => {
          setInternships(dummyInternships);
          setFilteredInternships(dummyInternships);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch internships:", error);
        setIsLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = internships;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (internship) =>
          internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          internship.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (internship) => internship.category === selectedCategory
      );
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter((internship) =>
        internship.location
          .toLowerCase()
          .includes(selectedLocation.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (internship) => internship.type === selectedType
      );
    }

    // Duration filter
    if (selectedDuration !== "all") {
      filtered = filtered.filter(
        (internship) => internship.duration === selectedDuration
      );
    }

    // Stipend filter
    filtered = filtered.filter(
      (internship) =>
        internship.stipend >= minStipend && internship.stipend <= maxStipend
    );

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Internship];
      let bValue: any = b[sortBy as keyof Internship];

      if (sortBy === "postedDate") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setFilteredInternships(filtered);
    setCurrentPage(1);
  }, [
    internships,
    searchTerm,
    selectedCategory,
    selectedLocation,
    selectedType,
    selectedDuration,
    minStipend,
    maxStipend,
    sortBy,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredInternships.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInternships = filteredInternships.slice(startIndex, endIndex);

  const categories = useMemo(() => {
    const cats = [...new Set(internships.map((i) => i.category))];
    return cats;
  }, [internships]);

  const locations = useMemo(() => {
    const locs = [...new Set(internships.map((i) => i.location.split(",")[0]))];
    return locs;
  }, [internships]);

  const durations = useMemo(() => {
    const dur = [...new Set(internships.map((i) => i.duration))];
    return dur;
  }, [internships]);

  const toggleBookmark = (id: string) => {
    setInternships((prev) =>
      prev.map((internship) =>
        internship.id === id
          ? { ...internship, isBookmarked: !internship.isBookmarked }
          : internship
      )
    );
  };

  const toggleLike = (id: string) => {
    setInternships((prev) =>
      prev.map((internship) =>
        internship.id === id
          ? { ...internship, isLiked: !internship.isLiked }
          : internship
      )
    );
  };

  // Generate internships function
  const generateInternships = async () => {
    setIsGenerating(true);
    try {
      console.log("Attempting to fetch recommendations...");
      // Backend API call for generating internships
      const response = await fetch(`http://127.0.0.1:8000/recommend/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "68c07211acffea4d6b24fa9f  ", // You can replace this with dynamic user ID
        }),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Received data:", data);

        // Check if recommendations exist
        if (data.recommendations && data.recommendations.length > 0) {
          // Transform the recommendation data to match our Internship interface
          const transformedInternships = data.recommendations.map(
            (rec: any) => ({
              id: rec.job_id,
              title: rec.title,
              company: rec.company,
              companyLogo: "/api/placeholder/40/40",
              location: "Remote", // Default since not provided in API
              type: "Remote" as const,
              duration: "3 months", // Default since not provided in API
              stipend: 3000, // Default since not provided in API
              stipendType: "Fixed" as const,
              startDate: new Date().toISOString().split("T")[0],
              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0], // 30 days from now
              description: `Join ${rec.company} as a ${
                rec.title
              }. This role focuses on ${rec.tags.join(", ")} technologies.`,
              requirements: rec.requirements,
              skills: rec.tags,
              category: rec.tags[0] || "Technology",
              postedDate: new Date().toISOString().split("T")[0],
              applicants: Math.floor(Math.random() * 50) + 10, // Random number between 10-60
              rating: Math.round(rec.combined_score * 5 * 10) / 10, // Convert score to 5-star rating
              isBookmarked: false,
              isLiked: false,
              imageUrl: "/api/placeholder/300/200",
              // Additional fields from API
              combinedScore: rec.combined_score,
              simScore: rec.sim_score,
              metaScore: rec.meta_score,
            })
          );

          setGeneratedInternships(transformedInternships);
          setShowGeneratedInternships(true);
        } else {
          console.log("No recommendations found, using dummy data");
          generateDummyInternships();
        }
      } else {
        console.error("Generate failed:", response.status);
        // Fallback to dummy data
        generateDummyInternships();
      }
    } catch (error) {
      console.error("Generate error:", error);
      console.log("Network error - using dummy data as fallback");
      // Fallback to dummy data
      generateDummyInternships();
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate dummy internships as fallback
  const generateDummyInternships = () => {
    const dummyGeneratedInternships: Internship[] = [
      {
        id: "gen_1",
        title: "AI/ML Development Intern",
        company: "TechInnovate Labs",
        companyLogo: "/api/placeholder/40/40",
        location: "Bangalore, India",
        type: "Hybrid",
        duration: "6 months",
        stipend: 4500,
        stipendType: "Performance-based",
        startDate: "2024-03-01",
        deadline: "2024-02-15",
        description:
          "Work on cutting-edge AI projects including machine learning models, natural language processing, and computer vision applications.",
        requirements: ["Python", "TensorFlow", "PyTorch", "SQL"],
        skills: ["Machine Learning", "Deep Learning", "Data Science", "Python"],
        category: "Technology",
        postedDate: "2024-01-15",
        applicants: 67,
        rating: 4.9,
        isBookmarked: false,
        isLiked: false,
        imageUrl: "/api/placeholder/300/200",
      },
      {
        id: "gen_2",
        title: "Full Stack Development Intern",
        company: "StartupHub Technologies",
        companyLogo: "/api/placeholder/40/40",
        location: "Mumbai, India",
        type: "Remote",
        duration: "4 months",
        stipend: 3500,
        stipendType: "Fixed",
        startDate: "2024-02-15",
        deadline: "2024-01-30",
        description:
          "Build scalable web applications using modern technologies like React, Node.js, and cloud platforms.",
        requirements: ["React", "Node.js", "JavaScript", "MongoDB"],
        skills: [
          "Frontend Development",
          "Backend Development",
          "Database Design",
        ],
        category: "Technology",
        postedDate: "2024-01-20",
        applicants: 89,
        rating: 4.7,
        isBookmarked: false,
        isLiked: false,
        imageUrl: "/api/placeholder/300/200",
      },
      {
        id: "gen_3",
        title: "Digital Marketing Intern",
        company: "GrowthMax Agency",
        companyLogo: "/api/placeholder/40/40",
        location: "Delhi, India",
        type: "On-site",
        duration: "3 months",
        stipend: 2800,
        stipendType: "Fixed",
        startDate: "2024-02-01",
        deadline: "2024-01-25",
        description:
          "Manage social media campaigns, create engaging content, and analyze marketing performance metrics.",
        requirements: [
          "Social Media Marketing",
          "Content Creation",
          "Analytics",
        ],
        skills: ["Digital Marketing", "Social Media", "Content Strategy"],
        category: "Marketing",
        postedDate: "2024-01-18",
        applicants: 45,
        rating: 4.5,
        isBookmarked: false,
        isLiked: false,
        imageUrl: "/api/placeholder/300/200",
      },
    ];

    setGeneratedInternships(dummyGeneratedInternships);
    setShowGeneratedInternships(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <HeaderWhite />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9982] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading internships...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeaderWhite />
      <Menu />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream Internship
          </h1>
          <p className="text-lg text-gray-600">
            Discover opportunities from top companies worldwide
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search internships, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent"
              >
                <option value="all">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={20} />
                <span>More Filters</span>
                <ChevronDown size={16} />
              </button>

              <button
                onClick={generateInternships}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent"
                  >
                    <option value="all">All Durations</option>
                    {durations.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Stipend (₹)
                  </label>
                  <input
                    type="number"
                    value={minStipend}
                    onChange={(e) => setMinStipend(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Stipend (₹)
                  </label>
                  <input
                    type="number"
                    value={maxStipend}
                    onChange={(e) => setMaxStipend(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generated Internships Section */}
        {showGeneratedInternships && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <span>✨</span>
                  <span>Generated Internships</span>
                </h2>
                <p className="text-gray-600 mt-1">
                  AI-powered recommendations based on your search criteria
                </p>
              </div>
              <button
                onClick={() => setShowGeneratedInternships(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedInternships.map((internship) => (
                <div
                  key={internship.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-300 group relative overflow-hidden"
                >
                  {/* Generated Badge and Score */}
                  <div className="absolute top-3 right-3 flex flex-col items-end space-y-1">
                    <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full">
                      AI Generated
                    </span>
                    {internship.combinedScore && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Match: {Math.round(internship.combinedScore * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Company Logo and Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {internship.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {internship.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {internship.rating}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {internship.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{internship.location}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {internship.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{internship.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>₹{internship.stipend.toLocaleString()}/month</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {internship.stipendType}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {internship.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {internship.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{internship.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  {internship.combinedScore && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-2 font-medium">
                        Recommendation Scores:
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium text-blue-600">
                            {Math.round((internship.simScore || 0) * 100)}%
                          </div>
                          <div className="text-gray-500">Similarity</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-green-600">
                            {Math.round((internship.metaScore || 0) * 100)}%
                          </div>
                          <div className="text-gray-500">Metadata</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-purple-600">
                            {Math.round(internship.combinedScore * 100)}%
                          </div>
                          <div className="text-gray-500">Combined</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{internship.applicants} applicants</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Apply by{" "}
                          {new Date(internship.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors text-sm font-medium">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium text-purple-700">
                Generate More Internships
              </button>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredInternships.length} internships found
            </h2>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#FF9982] focus:border-transparent"
              >
                <option value="postedDate-desc">Newest First</option>
                <option value="postedDate-asc">Oldest First</option>
                <option value="stipend-desc">Highest Stipend</option>
                <option value="stipend-asc">Lowest Stipend</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="rating-asc">Lowest Rated</option>
                <option value="applicants-desc">Most Popular</option>
                <option value="applicants-asc">Least Popular</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-[#FF9982] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? "bg-[#FF9982] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Internships Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {currentInternships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              viewMode={viewMode}
              onBookmark={() => toggleBookmark(internship.id)}
              onLike={() => toggleLike(internship.id)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 border rounded-md ${
                    currentPage === i + 1
                      ? "bg-[#FF9982] text-white border-[#FF9982]"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {filteredInternships.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No internships found matching your criteria.
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLocation("all");
                setSelectedType("all");
                setSelectedDuration("all");
                setMinStipend(0);
                setMaxStipend(100000);
              }}
              className="mt-4 text-[#FF9982] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Internship Card Component
interface InternshipCardProps {
  internship: Internship;
  viewMode: "grid" | "list";
  onBookmark: () => void;
  onLike: () => void;
}

const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  viewMode,
  onBookmark,
  onLike,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Remote":
        return "bg-green-100 text-green-800";
      case "On-site":
        return "bg-blue-100 text-blue-800";
      case "Hybrid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline(internship.deadline);

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4">
          <img
            src={internship.companyLogo}
            alt={internship.company}
            className="w-16 h-16 rounded-lg object-cover"
          />

          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {internship.title}
                </h3>
                <p className="text-gray-600 mb-2">{internship.company}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onLike}
                  className={`p-2 rounded-full ${
                    internship.isLiked ? "text-red-500" : "text-gray-400"
                  } hover:bg-gray-100`}
                >
                  <Heart
                    size={20}
                    fill={internship.isLiked ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={onBookmark}
                  className={`p-2 rounded-full ${
                    internship.isBookmarked ? "text-blue-500" : "text-gray-400"
                  } hover:bg-gray-100`}
                >
                  <Bookmark
                    size={20}
                    fill={internship.isBookmarked ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-2">
              {internship.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center space-x-1 text-gray-600">
                <MapPin size={16} />
                <span>{internship.location}</span>
              </div>

              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                  internship.type
                )}`}
              >
                {internship.type}
              </span>

              <div className="flex items-center space-x-1 text-gray-600">
                <Clock size={16} />
                <span>{internship.duration}</span>
              </div>

              <div className="flex items-center space-x-1 text-gray-600">
                <DollarSign size={16} />
                <span>{formatCurrency(internship.stipend)}/month</span>
              </div>

              <div className="flex items-center space-x-1 text-gray-600">
                <Users size={16} />
                <span>{internship.applicants} applicants</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">
                    {internship.rating}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {internship.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                  {internship.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      +{internship.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm font-medium ${
                    daysLeft <= 7 ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  {daysLeft > 0 ? `${daysLeft} days left` : "10"}
                </span>
                <button className="px-4 py-2 bg-[#FF9982] text-white rounded-lg hover:bg-[#FF876A] transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={internship.imageUrl || internship.companyLogo}
          alt={internship.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={onLike}
            className={`p-2 rounded-full bg-white/80 backdrop-blur-sm ${
              internship.isLiked ? "text-red-500" : "text-gray-600"
            } hover:bg-white`}
          >
            <Heart
              size={18}
              fill={internship.isLiked ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={onBookmark}
            className={`p-2 rounded-full bg-white/80 backdrop-blur-sm ${
              internship.isBookmarked ? "text-blue-500" : "text-gray-600"
            } hover:bg-white`}
          >
            <Bookmark
              size={18}
              fill={internship.isBookmarked ? "currentColor" : "none"}
            />
          </button>
        </div>

        <div className="absolute bottom-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
              internship.type
            )}`}
          >
            {internship.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img
              src={internship.companyLogo}
              alt={internship.company}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {internship.title}
              </h3>
              <p className="text-gray-600 text-sm">{internship.company}</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{internship.rating}</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {internship.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <MapPin size={16} />
            <span>{internship.location}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <Clock size={16} />
            <span>{internship.duration}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <DollarSign size={16} />
            <span>{formatCurrency(internship.stipend)}/month</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <Users size={16} />
            <span>{internship.applicants} applicants</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {internship.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {skill}
            </span>
          ))}
          {internship.skills.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
              +{internship.skills.length - 4}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span
            className={`text-sm font-medium ${
              daysLeft <= 7 ? "text-red-600" : "text-gray-600"
            }`}
          >
            {daysLeft > 0 ? `${daysLeft} days left` : ""}
          </span>

          <div className="flex space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Share2 size={16} />
            </button>
            <button className="px-4 py-2 bg-[#FF9982] text-white rounded-lg hover:bg-[#FF876A] transition-colors text-sm">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipsPage;

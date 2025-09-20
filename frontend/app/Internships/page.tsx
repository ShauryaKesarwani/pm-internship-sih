"use client";

// React
import React, { useState, useEffect, useMemo } from "react";

// Icons
import {
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Building2,
  Users,
  Star,
  Grid,
  List,
  Heart,
  Bookmark,
} from "lucide-react";

// Components
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";
import Menu from "../components/menu";
import Loading from "./components/loading"; //Loading Screen
import InternshipCard from "./components/InternshipCard/InternshipCard";
import SearchAndFilterBar from "./components/SearchAndFilterBar/searchAndFilter";
import ResultsHeader from "./components/ResultsHeader";
import GeneratedInternshipsSection from "./components/GeneratedInternshipsSection";

import { Internship } from "./data/Internship";
import { dummyInternships } from "./data/dummyInternships";

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
      
      // Fetch current user's profile to get _id
      const profileRes = await fetch("http://localhost:7470/user/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const profileData = await profileRes.json();
      const userId = profileData._id;
      console.log(profileData);
      
      // Backend API call for generating internships
      const response = await fetch(`http://127.0.0.1:8000/recommend/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({
        //   user_id: "68c07211acffea4d6b24fa9f  ", // You can replace this with dynamic user ID
        // }),
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
              description: `Join ${rec.company} as a ${rec.title
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
    // const dummyGeneratedInternships: Internship[] = dummyInternships

    setGeneratedInternships(dummyInternships);
    setShowGeneratedInternships(true);
  };

  if (isLoading) return <Loading />

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

        {/* Search and Filter Bar Component */}
        <SearchAndFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          minStipend={minStipend}
          setMinStipend={setMinStipend}
          maxStipend={maxStipend}
          setMaxStipend={setMaxStipend}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          categories={categories}
          locations={locations}
          durations={durations}
          generateInternships={generateInternships}
          isGenerating={isGenerating}
        />

        {/* Generated Internships Section */}
        <GeneratedInternshipsSection
          generatedInternships={generatedInternships}
          showGeneratedInternships={showGeneratedInternships}
          setShowGeneratedInternships={setShowGeneratedInternships}
          // generateInternships={generateInternships} // Uncomment if needed
        />


        {/* Results Header */}
        <ResultsHeader
          filteredInternshipsLength={filteredInternships.length}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

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
                  className={`px-3 py-2 border rounded-md ${currentPage === i + 1
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

export default InternshipsPage;
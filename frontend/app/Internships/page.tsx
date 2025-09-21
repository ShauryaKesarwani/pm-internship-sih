"use client";

// React
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import SearchAndFilterBar from "./components/SearchAndFilterBar/searchAndFilter";
import ResultsHeader from "./components/ResultsHeader";
import GeneratedInternshipsSection from "./components/GeneratedInternshipsSection";

import { Internship } from "./data/Internship";
import { dummyInternships } from "./data/dummyInternships";
import {log} from "console";

const InternshipsPage = () => {
  const router = useRouter();
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
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
      const userId = profileData.user._id;

      // Backend API call for generating internships
      const response = await fetch(
        `http://127.0.0.1:8000/recommend/${userId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.recommendations && data.recommendations.length > 0) {
          const transformedInternships = await Promise.all(
            data.recommendations.map(async (rec: any) => {
              const detailRes = await fetch(
                `http://127.0.0.1:7470/user/internship/details/${rec.job_id}`
              );
              const detailData = await detailRes.json();
              const internship = detailData.internship;

              const d = internship.internshipDetails;
              const location =
                d?.location?.city && d?.location?.address
                  ? `${d.location.city}, ${d.location.address}`
                  : "Remote";

              console.log(d.skillsRequired)
              console.log(rec.tags)
              return {
                id: rec.job_id,
                title: d.title,
                company: internship.company.name,
                companyLogo: "/api/placeholder/40/40",
                location: location,
                type:
                  location === "Remote"
                    ? ("Remote" as const)
                    : ("On-site" as const),
                duration: d.duration || "N/A",
                stipend: d.stipend || "N/A",
                stipendType: "Fixed" as const,
                startDate:
                  d.startDate || new Date().toISOString().split("T")[0],
                deadline: d.applicationDeadline
                  ? new Date(d.applicationDeadline)
                      .toISOString()
                      .split("T")[0]
                  : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0],
                description: `Join ${internship.company.name} as a ${d.title}. ${d.responsibilities ? `Key responsibilities include ${d.responsibilities.slice(0, 2).join(", ")} and more.` : ""}`,
                requirements: d.skillsRequired || rec.requirements,
                skills: rec.tags,
                category: rec.tags[0] || "Technology",
                postedDate: new Date(internship.createdAt)
                  .toISOString()
                  .split("T")[0],
                applicants: d.openings,
                rating: Math.round(rec.combined_score * 5 * 10) / 10,
                isBookmarked: false,
                isLiked: false,
                imageUrl: "/api/placeholder/300/200",
                combinedScore: rec.combined_score,
                simScore: rec.sim_score,
                metaScore: rec.meta_score,
                // Additional detailed fields
                responsibilities: d.responsibilities || [],
                department: d.department || "N/A",
                companyDetails: {
                  name: internship.company.name,
                  industry: internship.company.industry || "N/A",
                  website: internship.company.website || null,
                  location: internship.company.location || "N/A",
                  _id: internship.company._id
                },
                fullLocation: {
                  address: d.location?.address || null,
                  city: d.location?.city || null,
                  pinCode: d.location?.pinCode || null
                }
              };
            })
          );

          setGeneratedInternships(transformedInternships);
          setShowGeneratedInternships(true);
        } else {
          generateDummyInternships();
        }
      } else {
        generateDummyInternships();
      }
    } catch (error) {
      console.error("Generate error:", error);
      generateDummyInternships();
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate dummy internships as fallback
  const generateDummyInternships = () => {
    setGeneratedInternships(dummyInternships);
    setShowGeneratedInternships(true);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#FAEFE9]">
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
          onInternshipClick={(internship) => setSelectedInternship(internship)}
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
            <div
              key={internship.id}
              onClick={() => setSelectedInternship(internship)}
              className={`cursor-pointer bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-orange-300 group relative overflow-hidden flex ${
                viewMode === "list" ? "flex-row gap-6 items-start" : "flex-col"
              }`}
            >
              {/* Company Logo and Header */}
              <div
                className={`flex items-start justify-between ${
                  viewMode === "list" ? "flex-1" : "mb-4"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {internship.title}
                    </h3>
                    <p className="text-sm text-gray-600">{internship.company}</p>
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
              <p
                className={`text-sm text-gray-600 ${
                  viewMode === "list"
                    ? "flex-1 line-clamp-2"
                    : "mb-4 line-clamp-3 flex-grow"
                }`}
              >
                {internship.description}
              </p>

              {/* Details */}
              <div className={`space-y-2 ${viewMode === "list" ? "flex-1" : "mb-4"}`}>
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
                  <span>₹{Number(internship.stipend).toLocaleString()}/month</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {internship.stipendType}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div
                className={`flex ${
                  viewMode === "list"
                    ? "flex-col sm:flex-row sm:items-center sm:justify-between flex-1"
                    : "flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100"
                } gap-2`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1 whitespace-nowrap">
                    <Users className="w-3 h-3" />
                    <span>{internship.applicants} applicants</span>
                  </div>
                  <div className="flex items-center space-x-1 whitespace-nowrap">
                    <Clock className="w-3 h-3" />
                    <span>Apply by {new Date(internship.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 whitespace-nowrap">
                    <Clock className="w-3 h-3" />
                    <span>listed on {new Date(internship.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end sm:justify-normal space-x-2 flex-shrink-0">
                  <button
                    onClick={()=> router.push(`/proficiencyTest/${internship.id}`)}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
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

        {/* Internship Modal Popup */}
        {selectedInternship && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto"
            tabIndex={-1}
            onClick={() => setSelectedInternship(null)}
          >
            <div className="min-h-screen p-4 flex items-start justify-center">
              <div
                className="w-full max-w-6xl bg-white rounded-xl shadow-2xl relative mt-8 mb-8"
                onClick={e => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors"
                  onClick={() => setSelectedInternship(null)}
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Header Section */}
                <div className="bg-[#FF9982] text-white p-6 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold mb-1">{selectedInternship.title}</h1>
                        <p className="text-orange-100 text-lg">
                          {typeof selectedInternship.company === 'string' 
                            ? selectedInternship.company 
                            : selectedInternship.companyDetails?.name || selectedInternship.company}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center text-orange-100">
                            <MapPin className="w-4 h-4 mr-1" />
                            {selectedInternship.location}
                          </span>
                          <span className="px-2 py-1 bg-white/20 rounded-full text-sm">
                            {selectedInternship.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end mb-1">
                        <Star className="w-5 h-5 text-yellow-300 fill-current mr-1" />
                        <span className="text-xl font-bold">{selectedInternship.rating}</span>
                      </div>
                      <div className="text-orange-100 text-sm">Match Rating</div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column - Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Job Description */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedInternship.description}</p>
                    </div>

                    {/* Responsibilities */}
                    {selectedInternship.responsibilities && selectedInternship.responsibilities.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
                        <ul className="space-y-2">
                          {selectedInternship.responsibilities.map((responsibility, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-2 h-2 bg-[#FF9982] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-700">{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Skills & Requirements */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Skills & Requirements</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Skills Needed</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedInternship.skills?.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {selectedInternship.requirements && (
                          <div>
                            <h4 className="font-medium text-gray-800 mb-2">Requirements</h4>
                            <ul className="space-y-1">
                              {(Array.isArray(selectedInternship.requirements)
                                ? selectedInternship.requirements
                                : [selectedInternship.requirements]
                              ).map((req, idx) => (
                                <li key={idx} className="flex items-start text-sm">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                  <span className="text-gray-600">{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Job Details */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Job Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">Duration</span>
                            <p className="font-medium">{selectedInternship.duration}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Stipend</span>
                            <p className="font-medium">{selectedInternship.stipend}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">Openings</span>
                            <p className="font-medium">{selectedInternship.applicants} positions</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Apply by</span>
                            <p className="font-medium">{new Date(selectedInternship.deadline).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      {selectedInternship.department && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-500">Department</span>
                          <p className="font-medium">{selectedInternship.department}</p>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Right Column - Company & AI Info */}
                  <div className="space-y-6">
                    
                    {/* Company Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Building2 className="w-5 h-5 mr-2 text-[#FF9982]" />
                        Company Info
                      </h2>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {selectedInternship.companyDetails?.name || 
                             (typeof selectedInternship.company === 'string' ? selectedInternship.company : selectedInternship.company?.name)}
                          </h4>
                          {selectedInternship.companyDetails?.industry && (
                            <p className="text-[#FF9982] text-sm">{selectedInternship.companyDetails.industry}</p>
                          )}
                        </div>
                        
                        {selectedInternship.companyDetails?.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{selectedInternship.companyDetails.location}</span>
                          </div>
                        )}
                        
                        {selectedInternship.fullLocation?.address && (
                          <div className="text-sm text-gray-600">
                            <strong>Full Address:</strong><br />
                            {selectedInternship.fullLocation.address}<br />
                            {selectedInternship.fullLocation.city} - {selectedInternship.fullLocation.pinCode}
                          </div>
                        )}
                        
                        {selectedInternship.companyDetails?.website && (
                          <div className="text-sm">
                            <span className="text-gray-600">Website: </span>
                            <a
                              href={selectedInternship.companyDetails.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FF9982] hover:underline"
                            >
                              {selectedInternship.companyDetails.website.replace('https://', '')}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Matching Insights */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-[#FF9982]" />
                        AI Match Analysis
                      </h2>
                      
                      <div className="space-y-4">
                        {/* Similarity Score */}
                        {typeof selectedInternship.simScore !== "undefined" && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">Skill Similarity</span>
                              <span className="text-sm font-bold text-blue-600">
                                {(selectedInternship.simScore * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${selectedInternship.simScore * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Metadata Score */}
                        {typeof selectedInternship.metaScore !== "undefined" && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">Profile Match</span>
                              <span className="text-sm font-bold text-purple-600">
                                {(selectedInternship.metaScore * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${selectedInternship.metaScore * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Combined Score */}
                        {typeof selectedInternship.combinedScore !== "undefined" && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">Overall Match</span>
                              <span className="text-sm font-bold text-[#FF9982]">
                                {(selectedInternship.combinedScore * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-[#FF9982] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${selectedInternship.combinedScore * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button 
                        onClick={() => router.push(`/proficiencyTest/${selectedInternship.id}`)}
                        className="w-full bg-[#FF9982] text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                      >
                        Apply Now
                      </button>
                      <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        Save for Later
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipsPage;
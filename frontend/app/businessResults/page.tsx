"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  User,
  Award,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { fetchTestResults, exportTestResults, TestResult } from "../lib/api";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";

export default function BusinessResultsPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof TestResult>("completedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Dummy data for demonstration
  const dummyData: TestResult[] = [
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
          correctAnswer: "A Python library for data manipulation and analysis",
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

  useEffect(() => {
    const loadTestResults = async () => {
      setIsLoading(true);
      try {
        const results = await fetchTestResults();
        if (results.length > 0) {
          setTestResults(results);
          setFilteredResults(results);
        } else {
          // Fallback to dummy data if no results from API
          setTestResults(dummyData);
          setFilteredResults(dummyData);
        }
      } catch (error) {
        console.error("Failed to fetch test results:", error);
        // Fallback to dummy data on error
        setTestResults(dummyData);
        setFilteredResults(dummyData);
      } finally {
        setIsLoading(false);
      }
    };

    loadTestResults();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = testResults;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (result) =>
          result.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.testName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((result) => result.status === filterStatus);
    }

    // Rating filter
    if (filterRating !== "all") {
      filtered = filtered.filter(
        (result) => result.overallRating === filterRating
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

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

    setFilteredResults(filtered);
  }, [testResults, searchTerm, filterStatus, filterRating, sortBy, sortOrder]);

  const toggleRowExpansion = (resultId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(resultId)) {
      newExpanded.delete(resultId);
    } else {
      newExpanded.add(resultId);
    }
    setExpandedRows(newExpanded);
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "average":
        return "text-yellow-600 bg-yellow-100";
      case "poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const exportResults = async () => {
    try {
      const blob = await exportTestResults("csv");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `test-results-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Export failed, falling back to client-side export:",
        error
      );
      // Fallback to client-side export
      const csvContent = [
        [
          "Name",
          "Email",
          "Test",
          "Score",
          "Percentage",
          "Status",
          "Rating",
          "Completed At",
          "Time Taken",
        ],
        ...filteredResults.map((result) => [
          result.userName,
          result.userEmail,
          result.testName,
          `${result.score}/${result.maxScore}`,
          `${result.percentage}%`,
          result.status,
          result.overallRating,
          new Date(result.completedAt).toLocaleDateString(),
          `${result.timeTaken} min`,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `test-results-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9982] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeaderWhite />

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Test Results Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                View and analyze all user test results
              </p>
            </div>
            <button
              onClick={exportResults}
              className="flex items-center space-x-2 bg-[#FF9982] text-white px-4 py-2 rounded-lg hover:bg-[#FF876A] transition-colors"
            >
              <Download size={20} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {testResults.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Average Score
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    testResults.reduce(
                      (acc, result) => acc + result.percentage,
                      0
                    ) / testResults.length
                  )}
                  %
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Excellent Ratings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    testResults.filter((r) => r.overallRating === "excellent")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    testResults.reduce(
                      (acc, result) => acc + result.timeTaken,
                      0
                    ) / testResults.length
                  )}
                  m
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, email, or test..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="poor">Poor</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field as keyof TestResult);
                setSortOrder(order as "asc" | "desc");
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent"
            >
              <option value="completedAt-desc">Newest First</option>
              <option value="completedAt-asc">Oldest First</option>
              <option value="percentage-desc">Score High to Low</option>
              <option value="percentage-asc">Score Low to High</option>
              <option value="userName-asc">Name A-Z</option>
              <option value="userName-desc">Name Z-A</option>
            </select>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.map((result) => (
                  <React.Fragment key={result.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {result.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.userEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {result.testName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.skills.join(", ")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${getScoreColor(
                            result.percentage
                          )}`}
                        >
                          {result.score}/{result.maxScore} ({result.percentage}
                          %)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRatingColor(
                            result.overallRating
                          )}`}
                        >
                          {result.overallRating}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.timeTaken} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(result.completedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleRowExpansion(result.id)}
                          className="text-[#FF9982] hover:text-[#FF876A] flex items-center space-x-1"
                        >
                          <Eye size={16} />
                          <span>Details</span>
                          {expandedRows.has(result.id) ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {expandedRows.has(result.id) && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900">
                              Detailed Results
                            </h4>

                            {/* Question Answers */}
                            <div>
                              <h5 className="text-md font-medium text-gray-700 mb-3">
                                Question Analysis
                              </h5>
                              <div className="space-y-3">
                                {result.answers.map((answer, index) => (
                                  <div
                                    key={answer.questionId}
                                    className="bg-white p-4 rounded-lg border"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <h6 className="font-medium text-gray-900">
                                        Question {index + 1}
                                      </h6>
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                          answer.isCorrect
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {answer.isCorrect
                                          ? "Correct"
                                          : "Incorrect"}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">
                                      {answer.question}
                                    </p>
                                    <div className="space-y-1">
                                      <p className="text-sm">
                                        <span className="font-medium text-gray-600">
                                          User Answer:
                                        </span>
                                        <span
                                          className={`ml-2 ${
                                            answer.isCorrect
                                              ? "text-green-700"
                                              : "text-red-700"
                                          }`}
                                        >
                                          {answer.userAnswer}
                                        </span>
                                      </p>
                                      <p className="text-sm">
                                        <span className="font-medium text-gray-600">
                                          Correct Answer:
                                        </span>
                                        <span className="ml-2 text-gray-700">
                                          {answer.correctAnswer}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No test results found matching your criteria.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

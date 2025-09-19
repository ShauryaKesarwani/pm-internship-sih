// src/components/ResultsHeader.tsx
import React from "react";
import { Grid, List } from "lucide-react";

// Define the Props Interface
interface ResultsHeaderProps {
  filteredInternshipsLength: number;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  viewMode: "grid" | "list";
  setViewMode: (viewMode: "grid" | "list") => void;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  filteredInternshipsLength,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {filteredInternshipsLength} internships found
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
  );
};

export default ResultsHeader;
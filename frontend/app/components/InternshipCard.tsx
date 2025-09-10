import React from "react";

interface InternshipCardProps {
  productName?: string;
  companyName?: string;
  stipend?: string;
  imageUrl?: string;
  location?: string;
  mode?: string;
  duration?: string;
  deadline?: string;
  startDate?: string;
}

const InternshipCard = ({
  productName = "Product Name",
  companyName = "Company Name",
  stipend = "Stipend",
  imageUrl = "https://www.hindustantimes.com/ht-img/img/2023/09/27/550x309/gooogle_1695777035538_1695777046846.JPG",
  location = "📍 Location",
  mode = "Remote / On-site",
  duration = "3 Months",
  startDate = "1st August, 2025",
  deadline = "20th Sept, 2025",
}: InternshipCardProps) => {
  return (
    <div
      className="w-[70%] rounded-xl overflow-hidden p-3 bg-white shadow-[0px_2px_6px_0px_#FF8F7644]
                    transform transition-transform duration-300 hover:scale-105"
    >
      {/* Image */}
      <div className="mb-3">
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-50 object-cover rounded-lg"
        />
      </div>

      {/* Header Section */}
      <div className="flex justify-between mb-4 gap-2">
        <div>
          <div className="text-black font-semibold text-[1rem]">
            {productName}
          </div>
          <div className="text-[0.7rem] text-gray-500">- {companyName}</div>
          <div className="text-gray-500 text-[0.75rem]">{stipend}</div>
        </div>
        <button className="w-[80px] h-8 px-2 py-1 bg-[#FF8F76] text-white text-sm rounded-md hover:bg-blue-600">
          View
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 text-gray-700 text-xs">
        <span>{mode}</span>

        <div className="flex flex-wrap items-center gap-1">
          <span className="text-blue-700 px-1 py-0.5 rounded-md">
            {location}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <span className="text-green-700 px-1 py-0.5 rounded-md">
            ⏳ Duration: {duration}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <span className="text-blue-700 px-1 py-0.5 rounded-md">
            🗓️ Start Date: {startDate}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <span className="text-red-700 px-1 py-0.5 rounded-md">
            🗓️ Deadline: {deadline}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;

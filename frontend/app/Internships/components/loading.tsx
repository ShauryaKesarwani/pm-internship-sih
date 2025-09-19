import React from "react";
import Navbar from "@/app/components/Navbar"
import HeaderWhite from "@/app/components/header";

const Loading: React.FC = () => {
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
};

export default Loading;

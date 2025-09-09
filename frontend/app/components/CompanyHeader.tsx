import React from "react";

interface HeaderProps {
  logoUrl: string;
  companyName: string;
}

const CompanyHeader: React.FC<HeaderProps> = ({ logoUrl, companyName }) => {
  return (
    <header className="w-full bg-orange-200 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt="Company Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover bg-black"
          />
          <h1 className="text-sm sm:text-[2rem] font-bold text-gray-800 truncate">{companyName}</h1>
        </div>
      </div>
    </header>

  );
};

export default CompanyHeader;

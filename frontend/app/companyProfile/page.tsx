"use client";

import React, { useState } from "react";
import CompanyHeader from "../components/CompanyHeader";
import CompanyInfo from "../components/CompanyInfo";

interface CompanyData {
  logoUrl: string;
  companyName: string;
  email: string;
  location: string;
  website: string;
  industry: string;
}

const CompanyPage: React.FC = () => {
  // Mock data for now
  const [company, setCompany] = useState<CompanyData>({
    logoUrl: "/logo.png",
    companyName: "Mock Company Pvt Ltd",
    email: "contact@mockcompany.com",
    location: "Bengaluru, India",
    website: "https://mockcompany.com",
    industry: "Tech",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Commented out backend fetch for now
  /*
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/company");
        const data = await res.json();
        setCompany(data);
      } catch (err) {
        console.error("Error fetching company data:", err);
      }
    };

    fetchCompanyData();
  }, []);
  */

  const handleChange = (field: keyof CompanyData, value: string) => {
    setCompany({ ...company, [field]: value });
  };

  const handleSave = async () => {
    try {
      // Mock save (API call commented)
      /*
      await fetch("http://localhost:3000/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
      });
      */
      console.log("Saved company data:", company);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving company data:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <CompanyHeader logoUrl={company.logoUrl} companyName={company.companyName} />

      {/* Editable Section */}
      <div className="w-full mx-auto p-6">
        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow">
            <input
              type="text"
              value={company.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              className="border p-2 rounded"
              placeholder="Company Name"
            />
            <input
              type="email"
              value={company.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="border p-2 rounded"
              placeholder="Email"
            />
            <input
              type="text"
              value={company.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="border p-2 rounded"
              placeholder="Location"
            />
            <input
              type="url"
              value={company.website}
              onChange={(e) => handleChange("website", e.target.value)}
              className="border p-2 rounded"
              placeholder="Website"
            />
            <input
              type="text"
              value={company.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
              className="border p-2 rounded"
              placeholder="Industry"
            />
            <input
              type="text"
              value={company.logoUrl}
              onChange={(e) => handleChange("logoUrl", e.target.value)}
              className="border p-2 rounded col-span-2"
              placeholder="Logo URL"
            />

            <div className="col-span-2 flex gap-4 justify-end mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <CompanyInfo
              email={company.email}
              location={company.location}
              website={company.website}
              industry={company.industry}
            />
            <div className="text-center mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
              >
                Edit Company Info
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPage;

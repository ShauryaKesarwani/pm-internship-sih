"use client";

import React, { useState, useEffect } from "react";
import InternshipCard from "../components/InternshipCard";
import FilterSidebar from "../components/FilterSidebar";

interface Internship {
  id: number;
  productName: string;
  companyName: string;
  stipend: string;
  imageUrl: string;
  mode: string;
  duration: string;
  deadline: string;
}

const Internship: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch("/api/internships"); // replace with your backend URL
        const data = await response.json();
        setInternships(data);
      } catch (error) {
        console.error("Error fetching internships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAEFE9] m-0 p-0">

      <main className="flex flex-col md:flex-row mt-4 px-4 md:px-8">
        <FilterSidebar />

        <div className="flex flex-col items-center mb-10 w-[100%] p-10">

          <GuideBox />

          <section className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InternshipCard
              productName="Frontend Developer Intern"
              companyName="OpenAI"
              stipend="₹15,000 / month"
              imageUrl="https://picsum.photos/300/200?random=1"
              mode="Remote"
              duration="6 Months"
              deadline="30th Sept, 2025"
            />

            <InternshipCard
              productName="Data Science Intern"
              companyName="Google"
              stipend="₹25,000 / month"
              imageUrl="https://picsum.photos/300/200?random=2"
              mode="On-site (Bangalore)"
              duration="3 Months"
              deadline="15th Oct, 2025"
            />

            <InternshipCard
              productName="UI/UX Designer Intern"
              companyName="Figma"
              stipend="₹10,000 / month"
              imageUrl="https://picsum.photos/300/200?random=3"
              mode="Hybrid"
              duration="4 Months"
              deadline="5th Nov, 2025"
            />

          </section>
        </div>
      </main>
    </div>
  );
};

const GuideBox = () => {
  return (
    <div className="w-full max-w-full mx-auto px-3 sm:px-6 py-2 sm:py-3 bg-white  rounded-xl shadow-sm text-gray-700 sm:text-sm md:text-base mb-8">

      <h2 className="text-sm sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">
        How this page works
      </h2>

      <p className="mb-1">
        Current Location: <span className="font-medium">Mumbai</span>
      </p>
      <p className="mb-1">
        To learn more about a particular internship, click on the{" "}
        <span className="font-semibold text-blue-600">View</span> button.
      </p>
      <p className="mb-1">
        If you want to search for a personalized internship based on the{" "}
        <span className="font-semibold">tech stack</span> you know and want to
        work on, use the search bar above.
      </p>
      <p>
        You can also explore internships from various{" "}
        <span className="font-semibold">companies and domains</span> listed below.
      </p>
    </div>
  );
};

export default Internship;

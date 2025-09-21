import React from "react";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";
import ClientLogos from "../components/ClientLogos";
import Menu from "../components/menu";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-[#FAEFE9]">

      <Navbar />
      <HeaderWhite />
      <Menu />

      {/* Hero Section */}
      <section className="w-600px bg-white py-6 px-6 flex flex-col md:flex-row items-center justify-between ml-10 mr-10 mt-4 mb-10 rounded-lg">
        <div className="md:w-1/2 space-y-6 pl-39">
          <h2 className="text-4xl font-bold text-gray-900">Stay Protected</h2>
          <p className="text-gray-700 text-lg max-w-md">
            Ensure your safety and security with our comprehensive protection plans tailored for you.
          </p>
          <a href="../verification">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-orange-600">
              Complete Process
            </button>
          </a>
        </div>
        <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
          <img
            src="/pmModi.jpg"
            alt="PM Modi"
            className="object-contain w-[300px] h-[400px]"
          />
        </div>
      </section>

      {/* Partners Section */}
      <section className="w-full px-6">
        <ClientLogos />
      </section>

      {/* Eligibility and Benefits Section */}
      <section className="w-full py-12 bg-[#FAEFE9]">
        <div className="w-full px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Eligibility */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 ">
                Are you{" "}
                <span className="text-orange-500">Eligible&nbsp;?</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Age Card */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <img src="/icons/age.png" alt="Age" className="w-12 h-12" />
                  <div>
                    <div className="font-semibold text-lg">Age</div>
                    <div className="text-gray-600">21-24 Years</div>
                  </div>
                </div>
                {/* Job Status Card */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <img src="/icons/job.png" alt="Job Status" className="w-12 h-12" />
                  <div>
                    <div className="font-semibold text-lg">Job Status</div>
                    <div className="text-gray-600">Not Employed Full Time</div>
                  </div>
                </div>
                {/* Education Card */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <img src="/icons/education.png" alt="Education" className="w-12 h-12" />
                  <div>
                    <div className="font-semibold text-lg">Education</div>
                    <div className="text-gray-600">Not Enrolled Full Time</div>
                  </div>
                </div>
                {/* Family Card */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <img src="/icons/family.png" alt="Family" className="w-12 h-12" />
                  <div>
                    <div className="font-semibold text-lg">Family</div>
                    <ul className="text-gray-600 text-left list-disc list-inside mt-2">
                      <li>Self</li>
                      <li>Spouse</li>
                      <li>Parents</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column: Benefits */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Core Benefits{" "}
                <span className="text-orange-500">for PM Internship Scheme</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Benefit 1 */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <img src="/icons/experience.png" alt="Experience" className="w-12 h-12" />
                  <div className="text-gray-800 font-medium">
                    12 months real-life experience in India’s top companies
                  </div>
                </div>
                {/* Benefit 2 */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <img src="/icons/money.png" alt="Monthly Assistance" className="w-12 h-12" />
                  <div className="text-gray-800 font-medium">
                    Monthly assistance of ₹4500 by Government + ₹500 by Industry
                  </div>
                </div>
                {/* Benefit 3 */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <img src="/icons/grant.png" alt="Grant" className="w-12 h-12" />
                  <div className="text-gray-800 font-medium">
                    One-time Grant of ₹6000 for incidentals
                  </div>
                </div>
                {/* Benefit 4 */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <img src="/icons/sector.png" alt="Sectors" className="w-12 h-12" />
                  <div className="text-gray-800 font-medium">
                    Select from Various Sectors and from top Companies of India.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
import React from "react";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";
import ClientLogos from "../components/ClientLogos";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-[#FAEFE9]">

      <Navbar />
      <HeaderWhite />
      <section className="w-365 bg-purple-600 py-4 ml-4 mr-4 mt-2 rounded-lg">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <ul className="flex space-x-8 text-white font-medium">
            <li className="relative group cursor-pointer">
              <span className="px-3 py-2">Home</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
            <li className="relative group cursor-pointer">
              <span className="px-3 py-2">About</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
            <li className="relative group cursor-pointer">
              <span className="px-3 py-2">Services</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
            <li className="relative group cursor-pointer">
              <span className="px-3 py-2">Contact</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
          </ul>
        </div>
      </section>

      {/* Hero Section */}
      <section className="w-600px bg-white py-6 px-6 flex flex-col md:flex-row items-center justify-between ml-10 mr-10 mt-10 mb-10 rounded-lg">
        <div className="md:w-1/2 space-y-6 pl-39">
          <h2 className="text-4xl font-bold text-gray-900">Stay Protected</h2>
          <p className="text-gray-700 text-lg max-w-md">
            Ensure your safety and security with our comprehensive protection plans tailored for you.
          </p>
          <button className="bg-orange-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-orange-600">
            Complete Process
          </button>
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
    </div>
  );
};

export default HomePage;
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
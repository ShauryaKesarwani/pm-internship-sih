import React from "react";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-white">

      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <img src="/gov-logo.png" alt="Government Logo" className="w-12 h-12 object-contain" />
          <h1 className="text-2xl font-bold text-gray-900">PM Internship</h1>
        </div>
        <div className="flex space-x-4">
          <button className="bg-orange-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-orange-600">
            Registration
          </button>
          <button className="border border-gray-400 text-gray-700 px-5 py-2 rounded-md font-semibold hover:bg-gray-100">
            Login
          </button>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="w-full bg-blue-900 text-white px-6 py-3 flex space-x-8 text-sm font-medium">
        <a href="#" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">Guidelines/Documentation</a>
        <a href="#" className="hover:underline">Gallery</a>
        <a href="#" className="hover:underline">Eligibility</a>
        <a href="#" className="hover:underline">Mobile App</a>
        <a href="#" className="hover:underline">Support</a>
        <a href="#" className="hover:underline">Compendium</a>
      </nav>

      {/* Hero Section */}
      <section className="w-full bg-gray-50 py-16 px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-6">
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
            src="/pm-modi.png"
            alt="PM Modi"
            className="object-contain w-[300px] h-[400px]"
          />
        </div>
      </section>

      {/* Partners Section */}
      <section className="w-full py-10 px-6">
        <h3 className="text-center text-lg font-semibold text-gray-800 mb-6">
          Our Partners
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-10">
          <img src="/logos/atul.png" alt="Atul" className="w-[100px] h-[50px]" />
          <img src="/logos/torent.png" alt="Torent" className="w-[100px] h-[50px]" />
          <img src="/logos/ae.png" alt="AE" className="w-[100px] h-[50px]" />
          <img src="/logos/mr.png" alt="MR" className="w-[100px] h-[50px]" />
          <img src="/logos/bayer.png" alt="Bayer" className="w-[100px] h-[50px]" />
          <img src="/logos/honeywell.png" alt="Honeywell" className="w-[100px] h-[50px]" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
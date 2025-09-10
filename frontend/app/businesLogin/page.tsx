"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";
import Button from "../components/buttons";

const BusinessLoginPage = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    industry: "",
    address: "",
    username: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContinue = () => {
    // Store employer data in localStorage with Indian language support
    const employerData = {
      name: formData.companyName || formData.username || "व्यवसाय उपयोगकर्ता",
      email: formData.email || formData.username,
      phone: formData.phone,
      industry: formData.industry,
      address: formData.address,
      type: "employer",
      language: "hi" // Default to Hindi
    };
    
    localStorage.setItem('user', JSON.stringify(employerData));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirect to home page to show logged in state
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#FAEFE9]">
      <Navbar />
      <HeaderWhite />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              व्यवसाय पंजीकरण / Business Registration
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              कृपया अपनी कंपनी की जानकारी प्रदान करें / Please provide your company details to continue
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    कंपनी का नाम / Company Name *
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="कंपनी का नाम दर्ज करें / Enter company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    ईमेल पता / Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="ईमेल पता दर्ज करें / Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    फोन नंबर / Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="फोन नंबर दर्ज करें / Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                    उद्योग / Industry *
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    value={formData.industry}
                    onChange={handleInputChange}
                  >
                    <option value="">उद्योग चुनें / Select industry</option>
                    <option value="technology">प्रौद्योगिकी / Technology</option>
                    <option value="finance">वित्त / Finance</option>
                    <option value="healthcare">स्वास्थ्य सेवा / Healthcare</option>
                    <option value="education">शिक्षा / Education</option>
                    <option value="manufacturing">विनिर्माण / Manufacturing</option>
                    <option value="retail">खुदरा / Retail</option>
                    <option value="agriculture">कृषि / Agriculture</option>
                    <option value="other">अन्य / Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  कंपनी का पता / Company Address *
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="कंपनी का पता दर्ज करें / Enter company address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    उपयोगकर्ता नाम / Username *
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="उपयोगकर्ता नाम दर्ज करें / Enter username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    पासवर्ड / Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="पासवर्ड दर्ज करें / Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="text-center">
                <Button onClick={handleContinue}>
                  जारी रखें / Continue
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessLoginPage;

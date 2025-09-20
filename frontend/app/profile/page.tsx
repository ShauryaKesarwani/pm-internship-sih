"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";
import Button from "../components/buttons";

interface User {
  name?: string;
  email?: string;
  phone?: string;
  type?: string;
  language?: string;
  industry?: string;
  address?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if no user data
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAEFE9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAEFE9]">
      <Navbar />
      <HeaderWhite />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.name || "User Profile"}
              </h1>
              <p className="text-gray-600 capitalize">
                {user.type === 'candidate' ? 'उम्मीदवार / Candidate' : 'नियोक्ता / Employer'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  व्यक्तिगत जानकारी / Personal Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      नाम / Name
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {user.name || "Not provided"}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ईमेल / Email
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {user.email || "Not provided"}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      फोन नंबर / Phone Number
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                  
                  {user.industry && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        उद्योग / Industry
                      </label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-md capitalize">
                        {user.industry}
                      </p>
                    </div>
                  )}
                  
                  {user.address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        पता / Address
                      </label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {user.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  खाता स्थिति / Account Status
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      स्थिति / Status
                    </span>
                    <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                      सक्रिय / Active
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      खाता प्रकार / Account Type
                    </span>
                    <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full capitalize">
                      {user.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      भाषा / Language
                    </span>
                    <span className="px-3 py-1 bg-purple-500 text-white text-sm rounded-full">
                      {user.language === 'hi' ? 'हिन्दी' : 'English'}
                    </span>
                  </div>
                </div>

                <div className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    कार्य / Actions
                  </h3>
                  
                  <div className="space-y-3">
                    <Button className="w-full">
                      प्रोफाइल संपादित करें / Edit Profile
                    </Button>
                    
                    <Button variant="secondary" className="w-full">
                      पासवर्ड बदलें / Change Password
                    </Button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-600 transition-colors"
                    >
                      लॉगआउट / Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;



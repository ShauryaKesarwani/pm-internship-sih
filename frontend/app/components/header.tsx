"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

export default function HeaderWhite() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || "User");
      } catch (e) {
        setUserName("User");
      }
    }
  }, []);

  // Listen for storage changes to update login state
  useEffect(() => {
    const handleStorageChange = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
      
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserName(userData.name || "User");
        } catch (e) {
          setUserName("User");
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName("User");
    window.location.href = "http://localhost:7470/logout";
    setTimeout(() => {
      window.location.href = "/";
    }, 20000);
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <Link href="/" className="flex items-center space-x-4">
        <img src="/gov-logo.png" alt="Government Logo" className="w-29 h-12 " />
        <img src="/pmInternship.png" alt="Pm internship Logo" className="w-29 h-12 " />
      </Link>
      <div className="flex space-x-4 items-center">
        {isLoggedIn ? (
          <>
            <Link href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-orange-600">
              <FaUser className="text-xl" />
              <span className="text-sm font-medium">{userName}</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-gray-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-gray-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="bg-orange-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-orange-600">
            Login/Sign-up
          </Link>
        )}
        <Link href="/" className="flex items-center space-x-4">
          <img src="/2047.png" alt="2047 goal Logo" className="w-12 h-12 " />
        </Link>
      </div>
    </header>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function HeaderWhite() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name?: string; avatar?: string }>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:7470/user/profile", {
          credentials: "include", // important so cookies are sent!
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setIsLoggedIn(true);
            setUser({
              name: data.user.name,
              avatar: data.user.avatar,
            });
          } else {
            setIsLoggedIn(false);
            setUser({});
          }
        } else {
          setIsLoggedIn(false);
          setUser({});
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
        setIsLoggedIn(false);
        setUser({});
      }
    };

    fetchProfile();

    // recheck every 30s in case login/logout happens in another tab
    const interval = setInterval(fetchProfile, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({});
    window.location.href = "http://localhost:7470/logout"; 
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
            <Link
              href="/profile"
              className="flex items-center space-x-2 text-gray-700 hover:text-orange-600"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "User"}
                  className="w-10 h-10 rounded-full border"
                />
              ) : (
                <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                  {user.name?.charAt(0) || "U"}
                </span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-orange-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-orange-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-orange-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-orange-600"
          >
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
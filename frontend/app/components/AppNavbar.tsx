"use client";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import LoggedInNavbar from "./LoggedInNavbar";
import LoggedOutNavbar from "./LoggedOutNavbar";

export default function AppNavbar() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return isAuthenticated ? <LoggedInNavbar /> : <LoggedOutNavbar />;
}

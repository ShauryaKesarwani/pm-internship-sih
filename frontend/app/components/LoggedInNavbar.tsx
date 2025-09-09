"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { 
  User, 
  LogOut, 
  Home, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Settings,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

export default function LoggedInNavbar() {
  const { user, isLoading, logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const navigationItems = [
    { name: "Home", href: "/Home", icon: Home },
    { name: "Internships", href: "/Internships", icon: Briefcase },
    { name: "Create Internship", href: "/createInternship", icon: FileText },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Proficiency Test", href: "/proficiencyTest", icon: Settings },
  ];

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

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/Home" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-[#FF9982] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">PM</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                PM Internship Portal
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-[#FF9982] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Profile Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Desktop Profile Dropdown */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#FF9982] focus:outline-none focus:ring-2 focus:ring-[#FF9982] focus:ring-offset-2 rounded-md px-3 py-2"
              >
                <div className="h-8 w-8 rounded-full bg-[#FFE1D7] flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User size={18} className="text-[#FF9982]" />
                  )}
                </div>
                <span className="text-sm font-medium">{user?.name || "User"}</span>
                <ChevronDown size={16} />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/resumeUploading"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <FileText size={16} />
                    <span>Upload Resume</span>
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-[#FF9982] focus:outline-none focus:ring-2 focus:ring-[#FF9982] focus:ring-offset-2 rounded-md p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#FF9982] hover:bg-white px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Profile Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="h-10 w-10 rounded-full bg-[#FFE1D7] flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-[#FF9982]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-[#FF9982] hover:bg-white px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                
                <Link
                  href="/resumeUploading"
                  className="flex items-center space-x-2 text-gray-700 hover:text-[#FF9982] hover:bg-white px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FileText size={20} />
                  <span>Upload Resume</span>
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-base font-medium"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </nav>
  );
}

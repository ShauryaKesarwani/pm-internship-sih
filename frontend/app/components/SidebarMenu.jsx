"use client";

import React from "react"; 
import { useState } from "react";
import { Menu, X, User } from "lucide-react"; // install lucide-react if not already

const SidebarMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 bg-gray-100 rounded-lg shadow-md fixed top-4 left-4 z-50"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg border-r w-64 transform 
        transition-transform duration-300 z-40 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Profile Section */}
        <div className="p-6 border-b flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <User size={28} className="text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">John Doe</p>
            <p className="text-sm text-gray-500">View Profile</p>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>

          <div className="flex flex-col gap-3 text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              Remote Only
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              Paid Internships
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              Duration: 3+ Months
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              Deadline This Week
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;

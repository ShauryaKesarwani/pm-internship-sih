"use client";
import React from "react";
import Link from "next/link";

export default function HeaderWhite() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <Link href="/" className="flex items-center space-x-4">
        <img src="/gov-logo.png" alt="Government Logo" className="w-12 h-12 object-contain" />
        <h1 className="text-2xl font-bold text-gray-900">PM Internship</h1>
      </Link>
      <div className="flex space-x-4">
        <button className="bg-orange-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-orange-600">
          Registration
        </button>
        <button className="border border-gray-400 text-gray-700 px-5 py-2 rounded-md font-semibold hover:bg-gray-100">
          Login
        </button>
      </div>
    </header>
  );
}

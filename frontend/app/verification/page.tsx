"use client"
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";

const HomePage = () => {
    const [mobile, setMobile] = useState("");

  const handleSubmit = async () => {
    if (!mobile) {
      alert("Please enter your mobile number");
      return;
    }

    try {
      const response = await fetch("http://localhost:7470/user/verify", {
        method: "POST",
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();
      console.log("Response:", data);
    } catch (error) {
      console.error("Error sending mobile number:", error);
    }
  };
  return (
    <div className="w-full min-h-screen bg-[#FAEFE9]">

      <Navbar />
      <HeaderWhite />
      <div className="flex flex-col items-center justify-center mt-40">
        <div className="bg-white rounded-lg shadow-md p-8 w-[400px]">
          <div className="flex justify-center items-center ">
            <img src="/emblem.png" className=" w-[80px] h-[60px] pr-6 border-r-1" />
            <img src="/digilocker.png" className=" w-[200px] h-[120px]" />
            <img src="/G20.jpg" className=" w-[100px] h-[80px]" />
          </div>
          <h2 className="text-xl font-bold text-center mb-6">Sign In to your account!</h2>
          <div className="flex w-full mb-6 border rounded-lg">
            <button className="bg-blue-500 text-white px-9 py-2 rounded-l-md">Mobile</button>
            <button className=" text-gray-700 px-10 py-2 rounded-r-md">Aadhaar/Username</button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Mobile number*"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-sm text-gray-500 mt-1">Enter your registered Mobile number</p>
          </div>
          <button className="w-full bg-green-500 text-white py-2 rounded-md">Next</button>
          <p className="text-center text-sm mt-4">
            Do not have an account?{" "}
            <a href="#" className="text-blue-600 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
      </div>
    )
};
export default HomePage;
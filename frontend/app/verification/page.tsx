"use client"
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";
import Menu from "../components/menu";

const HomePage = () => {
    const [mobile, setMobile] = useState("");
    const [loginMethod, setLoginMethod] = useState<"mobile" | "aadhaar">("mobile");
    const [aadhaar, setAadhaar] = useState("");

  const handleSubmit = async () => {
    if (!mobile) {
      alert("Please enter your mobile number");
      return;
    }

    try {
      console.log(1)
      const response = await fetch("http://localhost:7470/user/verify", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        // Redirect to resume uploading page on your frontend
        window.location.href = "http://localhost:3000/resumeUploading";
      } else {
        alert("Verification failed");
      }
    } catch (error) {
      console.error("Error sending mobile number:", error);
    }
  };
  return (
    <div className="w-full min-h-screen bg-[#FAEFE9]">

      <Navbar />
      <HeaderWhite />
      <Menu />
      <div className="flex flex-col items-center justify-center mt-40">
        <div className="bg-white rounded-lg shadow-md p-8 w-[400px]">
          <div className="flex justify-center items-center ">
            <img src="/emblem.png" className=" w-[80px] h-[60px] pr-6 border-r-1" />
            <img src="/digilocker.png" className=" w-[200px] h-[120px]" />
            <img src="/G20.jpg" className=" w-[100px] h-[80px]" />
          </div>
          <h2 className="text-xl font-bold text-center mb-6">Sign In to your account!</h2>
          <div className="flex w-full mb-6 border rounded-lg">
            <button
              className={`${loginMethod === "mobile" ? "bg-blue-500 text-white" : "text-gray-700"} px-14 py-2 rounded-l-md`}
              onClick={() => setLoginMethod("mobile")}
            >
              Mobile
            </button>
            <button
              className={`${loginMethod === "aadhaar" ? "bg-blue-500 text-white" : "text-gray-700"} ml-1 px-14 py-2 rounded-r-md`}
              onClick={() => setLoginMethod("aadhaar")}
            >
              Aadhaar
            </button>
          </div>
          <div className="mb-4">
            {loginMethod === "mobile" ? (
              <>
                <input
                  type="text"
                  placeholder="Mobile number*"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">Enter your registered Mobile number</p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Aadhaar number*"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">Enter your Aadhaar number</p>
              </>
            )}
          </div>

          <button
              className="w-full bg-green-500 text-white py-2 rounded-md"
              onClick={handleSubmit} 
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
};
export default HomePage;
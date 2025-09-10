"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";

const ResumePage = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://localhost:7470/user/resume/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        alert("Failed to upload resume.");
      } else {
        alert("Resume uploaded successfully.");
        setFile(null);
      }
    } catch (error) {
      alert("An error occurred while uploading.");
    }
  };

  return (
    <div className="bg-[#FAEFE9] min-h-screen">
      <Navbar />
      <HeaderWhite />
      <div className="flex items-center justify-center p-4">
        <div className="max-w-4xl w-full flex flex-col items-center space-y-8 mt-48">
          <div className="w-full flex justify-center">
            <h1 className="text-3xl font-bold text-center text-black">
              Resume uploader
            </h1>
          </div>
          <div className="w-full flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg max-w-xl w-full p-8 flex flex-col items-center "
            >
              <img
                src="/uploadIcon.png"
                alt="Upload Icon"
                className="w-16 h-16 mb-4"
              />
              <p className="text-gray-700 mb-1">choose resume to upload</p>
              <p className="text-gray-500 mb-6 text-sm">
                the file size should be lesser than 10 mb
              </p>

              <input
                type="file"
                id="fileInput"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer px-6 py-2 rounded-md bg-red-400 text-white font-semibold hover:bg-red-500 transition"
              >
                Choose File
              </label>
              <div className="flex flex-col items-center w-full">
                {file && <p className="mt-2 text-gray-600">{file.name}</p>}

                <button
                  type="submit"
                  disabled={!file}
                  className="mt-6 px-8 py-2 rounded-md bg-red-600 text-white font-semibold disabled:bg-red-300 transition"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;

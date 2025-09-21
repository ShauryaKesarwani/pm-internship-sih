"use client";
import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";
import Menu from "../components/menu";
import Button from "../components/buttons";

const ResumePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploaded(false);
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
        setUploaded(true);
        setFile(null);
        // window.location.href = "http://localhost:3000/profile";
      }
    } catch (error) {
      alert("An error occurred while uploading.");
    }
  };

  return (
    <div className="bg-[#FAEFE9] min-h-screen">
      <Navbar />
      <HeaderWhite />
      <Menu />
      <div className="flex items-center justify-center p-4 min-h-[75vh]">
        <div className="max-w-4xl w-full flex flex-col items-center space-y-8">
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
                ref={fileInputRef}
              />
              <Button
                variant="primary"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                style={uploaded ? { opacity: 0.5 } : {}}
              >
                Choose File
              </Button>
              <div className="flex flex-col items-center w-full mt-4">
                {file && <p className="mt-2 text-gray-600">{file.name}</p>}

                <Button
                  type="submit"
                  disabled={!file || uploaded}
                  style={!file || uploaded ? { opacity: 0.5 } : {}}
                >
                  Upload
                </Button>
                <a
                  href="http://localhost:3000/resume-builder"
                  className="text-gray-500 text-sm mt-2 underline pt-4"
                >
                  Don't have one? Create Instead
                </a>
                <a
                  href="http://localhost:3000/profile"
                  className="text-gray-500 text-sm mt-2 underline"
                >
                  Skip this step
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;

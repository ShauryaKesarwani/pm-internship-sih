"use client";
import React, { useState } from "react";

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
      const response = await fetch("/api/uploadResume", {
        method: "POST",
        body: formData,
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
    <div className="bg-red-50 min-h-screen flex items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Resume uploader</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg max-w-xl w-full p-8 flex flex-col items-center"
      >
        <div className="text-6xl mb-4 select-none">📤</div>
        <p className="text-gray-700 mb-1">choose resume to upload</p>
        <p className="text-gray-500 mb-6 text-sm">the file size should be lesser than 10 mb</p>

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
        {file && <p className="mt-2 text-gray-600">{file.name}</p>}

        <button
          type="submit"
          disabled={!file}
          className="mt-6 px-8 py-2 rounded-md bg-red-600 text-white font-semibold disabled:bg-red-300 transition"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default ResumePage;
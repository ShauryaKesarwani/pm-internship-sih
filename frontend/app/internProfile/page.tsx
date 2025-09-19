"use client";
import { useState, useEffect } from "react";

interface InternData {
  name: string;
  email: string;
  college: string;
  score: number;
  resumeUrl: string;
}

const InternProfile = () => {
  const [data, setData] = useState<InternData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Uncomment this to fetch from backend

    fetch("http://localhost:7470/user/")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));

    // Mock data for now
    const mockData: InternData = {
      name: "John Doe",
      email: "john.doe@example.com",
      college: "ABC University",
      score: 85,
      resumeUrl: "/mock-resume.pdf", // put a sample PDF in your public folder
    };

    setData(mockData);
    setLoading(false);
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!data) return <div className="p-4">No data found</div>;

  return (
    <div className="mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#FAEFE9] w-[100vw] h-[100vh]">
      <div className="flex flex-col gap-5">
        <div className="bg-white shadow-[0px_2px_6px_0px_#FF8F7644] rounded-lg p-6 max-h">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <p>
            <span className="font-semibold">Name:</span> {data.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {data.email}
          </p>
          <p>
            <span className="font-semibold">College:</span> {data.college}
          </p>
        </div>

        {/* Score Box */}
        <div className="bg-white shadow-[0px_2px_6px_0px_#FF8F7644] rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Score</h2>
          <p className="text-3xl font-bold text-green-600">{data.score}</p>
        </div>
      </div>

      {/* Resume Box */}
      <div className="bg-white shadow-[0px_2px_6px_0px_#FF8F7644] rounded-lg p-6 h-full">
        <h2 className="text-xl font-bold mb-4">Resume</h2>
        <iframe
          src={data.resumeUrl}
          width="100%"
          height="400px"
          className="border"
        ></iframe>
      </div>
    </div>
  );
};

export default InternProfile;

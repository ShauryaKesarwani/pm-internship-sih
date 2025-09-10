"use client"
import { useState, FormEvent } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Store employer data in localStorage
    const employerData = {
      name: username || "Business User",
      email: username,
      type: "employer"
    };
    
    localStorage.setItem('user', JSON.stringify(employerData));
    
    // Redirect to home page to show logged in state
    window.location.href = '/';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2L3 7v6c0 5 3 9 9 9s9-4 9-9V7l-9-5z"
            />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-semibold text-center mb-2">Welcome</h1>
        <p className="text-center text-gray-600 mb-8">
          Log in to don-t-byte-me to continue to Don'tByteMe.
        </p>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username or Email address*
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password*
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-3 pt-5 flex items-center text-gray-500"
              tabIndex={-1}
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-blue-600 text-sm hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </form>

        <p className="text-center text-gray-700 mt-6">
          Don't have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

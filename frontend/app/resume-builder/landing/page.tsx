"use client";
import React from "react";
import Menu from "../components/menu";
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  Star,
  ArrowRight,
  Users,
  Award,
  Briefcase,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import HeaderWhite from "../../components/header";
import Link from "next/link";

export default function ResumeBuilderLandingPage() {
  const features = [
    {
      icon: <FileText className="w-8 h-8 text-orange-500" />,
      title: "Professional Templates",
      description:
        "Choose from multiple professional resume templates designed by experts",
    },
    {
      icon: <Eye className="w-8 h-8 text-orange-500" />,
      title: "Live Preview",
      description:
        "See your resume come to life with real-time preview as you build",
    },
    {
      icon: <Download className="w-8 h-8 text-orange-500" />,
      title: "Multiple Formats",
      description: "Download your resume in HTML, PDF, or plain text formats",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-orange-500" />,
      title: "ATS Friendly",
      description: "Optimized for Applicant Tracking Systems used by employers",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Personal Information",
      description:
        "Enter your basic details, contact information, and professional summary",
    },
    {
      number: "02",
      title: "Work Experience",
      description:
        "Add your professional experience with detailed achievements and responsibilities",
    },
    {
      number: "03",
      title: "Education",
      description:
        "Include your educational background, degrees, and academic achievements",
    },
    {
      number: "04",
      title: "Skills & Certifications",
      description:
        "Highlight your technical skills, soft skills, and professional certifications",
    },
    {
      number: "05",
      title: "Projects & Portfolio",
      description: "Showcase your projects, work samples, and portfolio pieces",
    },
    {
      number: "06",
      title: "Review & Download",
      description:
        "Preview your resume and download it in your preferred format",
    },
  ];

  const stats = [
    { number: "10K+", label: "Resumes Created" },
    { number: "95%", label: "Success Rate" },
    { number: "50+", label: "Templates Available" },
    { number: "24/7", label: "Free to Use" },
  ];

  return (
    <div className="min-h-screen bg-[#FAEFE9]">
      <Navbar />
      <HeaderWhite />
      <Menu />

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Build Your Perfect Resume
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Create a professional resume that stands out to employers. Our
              step-by-step builder guides you through creating a compelling
              resume that gets you noticed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/resume-builder"
                className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                Start Building Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-colors flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" />
                View Examples
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Resume Builder?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our resume builder is designed to help you create a professional
              resume that effectively showcases your skills and experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Create your professional resume in just 6 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build Your Resume?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of job seekers who have successfully created
            professional resumes with our easy-to-use builder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/resume-builder"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Start Building Your Resume
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Resume Builder</h3>
              <p className="text-gray-400">
                Create professional resumes that get you noticed by employers.
                Free, easy-to-use, and effective.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/resume-builder" className="hover:text-white">
                    Start Building
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resume-builder/landing"
                    className="hover:text-white"
                  >
                    Templates
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resume-builder/landing"
                    className="hover:text-white"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resume-builder/landing"
                    className="hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Professional Templates</li>
                <li>Live Preview</li>
                <li>Multiple Formats</li>
                <li>ATS Optimization</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Resume Builder. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

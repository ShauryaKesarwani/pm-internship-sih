"use client";
import React, { useState, useEffect } from "react";
import Menu from "../components/menu";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";
import { div } from "framer-motion/client";

interface Question {
  question: string;
  options: string[];
}

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // ---------------- MOCK DATA ----------------
  const mockData: Question[] = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
    },
    {
      question: "Which language runs in a web browser?",
      options: ["Java", "C", "Python", "JavaScript"],
    },
    {
      question: "What does CSS stand for?",
      options: [
        "Central Style Sheets",
        "Cascading Style Sheets",
        "Cascading Simple Sheets",
        "Control Style Sheets",
      ],
    },
  ];
  // ------------------------------------------

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Uncomment this when backend is ready
        // const res = await fetch("/api/questions");
        // const data: Question[] = await res.json();

        // For now, use mock data
        const data: Question[] = mockData;

        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  // Timer effect
  useEffect(() => {
    if (questions.length === 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, questions, submitted]);

  const handleNext = () => {
    setSelectedOption(null);
    setTimeLeft(30);
    setCurrentIndex((prev) => (prev + 1 < questions.length ? prev + 1 : prev));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    console.log("Quiz submitted!");
    // 👉 here you can send answers to backend if needed
  };

  if (loading) {
    return (
      <div className="h-[100vh] flex justify-center items-center text-[3rem] font-semibold text-[#FF8F76] bg-[#FAEFE9]">
        Loading quiz...
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="h-[100vh] flex justify-center items-center text-[3rem] font-semibold text-[#FF8F76] bg-[#FAEFE9]">
        Quiz Finished! Thanks for submitting.
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div>
      <Navbar />
      <HeaderWhite />
      <Menu />
      <div className="flex flex-col w-full h-[100vh] justify-center items-center p-10 bg-[#FAEFE9] select-none">
        <div className="absolute text-[8rem] font-semibold text-[#FF8F76] z-0 top-15 sm:[top-0]">
          {/* {currentIndex + 1}/{questions.length} */}
        </div>

        {/* Question */}
        <div
          className="bg-[#FCFCFC] w-full sm:w-4/5 md:w-3/5 max-w-[800px] rounded-3xl h-auto md:h-[70%] 
        p-5 sm:p-8 md:p-10 mt-10 sm:mt-16 md:mt-24 
        shadow-[0px_7px_29px_0px_#FF8F76] flex flex-col items-center z-[1]"
        >
          <div className="flex w-full justify-between">
            <div className="self-center text-[32px] top-0 font-bold text-[#FF8F76] ">
              {timeLeft}
            </div>
          </div>

          <h2 className="mb-5">{currentQuestion.question}</h2>

          <div className="flex flex-col gap-3 w-full items-center">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option;

              return (
                <button
                  key={option}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full sm:w-4/5 md:w-3/5 h-[50px] flex items-center justify-center 
                rounded-lg border-2 font-medium text-[16px] transition-colors
                ${
                  isSelected
                    ? "bg-[#FF704D] text-white border-[#FF704D]"
                    : "bg-[#FCFCFC] text-[#333333] border-[#FF704D] hover:bg-[#FFE0D6]"
                }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Next or Submit */}
          <div className="flex justify-center mt-4">
            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 rounded-lg bg-[#FF704D] text-white font-semibold 
            hover:bg-[#FF5722] transition-colors cursor-pointer"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-lg bg-[#FF704D] text-white font-semibold 
            hover:bg-[#FF5722] transition-colors cursor-pointer"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

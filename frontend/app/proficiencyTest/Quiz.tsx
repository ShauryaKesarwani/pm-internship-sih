"use client";
import React, { useState, useEffect } from "react";
import Menu from "../components/menu";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";
import { div } from "framer-motion/client";
import { log } from "console";

interface Question {
  question: string;
  options: string[];
  difficulty: string;
  weight: number;
  timer: number;
}

interface Props{
  internshipId: string;
}

const Quiz: React.FC<Props> = ({internshipId}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question|null>(null);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [submitted, setSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ---------------- MOCK DATA ----------------
  /*
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
  */
  // ------------------------------------------

  // Fetch questions from backend
  useEffect(() => {
    const fetchFirst = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/quiz/start-quiz/68cea5c2663cb8f365924065`);
        console.log(res);
        const data = await res.json();
        setCurrentQuestion(data);
        setTimeLeft(data.timer);
        console.log(data);
      } catch (error) {
        console.log(1);
        console.error("Failed to fetch questions:", error);
      }
    };
    fetchFirst();
  }, [internshipId]);

  // Timer effect
  useEffect(() => {
    if (!currentQuestion || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext();
          return currentQuestion.timer;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, submitted, currentIndex]);

  const handleNext = async () => {
    if(!currentQuestion) return;

    const res = await fetch("http://127.0.0.1:8000/quiz/submit-answer",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        question: currentQuestion.question,
        answer: selectedOption,
        correct: currentQuestion.options[0],
        difficulty:0.5,
        score,
      })
    })
    console.log(res);
    const result = await res.json();
    setScore(result.score);

    const next = await fetch("http://127.0.0.1:8000/quiz/next-question",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        question: currentQuestion.question,
        answer: selectedOption,
        correct: currentQuestion.options[0],
        difficulty: result.new_difficulty,
        score: result.score,
      }),
    })
    console.log(next);

    const nextData = await next.json();
    setCurrentQuestion(nextData);
    setTimeLeft(nextData.timer);
    setSelectedOption(null);
    setCurrentIndex((prev)=>prev+1);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    console.log("Quiz submitted!");
    await fetch(`http://127.0.0.1:8000/quiz/end-quiz/${internshipId}`,{
      method:"POST",
    })
  };

  if (!currentQuestion) {
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
            {currentIndex === 9 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 rounded-lg bg-[#FF704D] text-white font-semibold 
            hover:bg-[#FF5722] transition-colors cursor-pointer"
              >
                Submit Quiz
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

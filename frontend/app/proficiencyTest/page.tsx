"use client";

import React, { useState, useEffect } from "react";

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
    if (questions.length === 0) return;

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
  }, [currentIndex, questions]);

  const handleNext = () => {
    setSelectedOption(null);
    setTimeLeft(30);
    setCurrentIndex((prev) =>
      prev + 1 < questions.length ? prev + 1 : 0
    );
  };

  if (loading) {
    return <div>Loading quiz...</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div>
      {/* Timer */}
      <div>Time Left: {timeLeft}s</div>

      {/* Question */}
      <div>
        <h2>{currentQuestion.question}</h2>

        <div>
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedOption(option)}
              style={{
                backgroundColor: selectedOption === option ? "#4CAF50" : "#f0f0f0",
                margin: "5px",
                padding: "8px 12px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              {option}
            </button>
          ))}
        </div>

        <button onClick={handleNext} style={{ marginTop: "10px" }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Quiz;

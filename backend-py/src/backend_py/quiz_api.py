from fastapi import FastAPI
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import List, Dict, Any
from backend_py.quiz import AdaptiveQuiz  # absolute import
import httpx

quiz: AdaptiveQuiz | None = None  # global handle
quiz_history: List[Dict[str, Any]] = []

samples = [
    {"question": "Which HTML tag is used to create a hyperlink?", "answer": "<a>", "difficulty": "easy"},
    {"question": "Which CSS property is used to change text color?", "answer": "color", "difficulty": "easy"},
    {"question": "Which HTTP method is typically idempotent?", "answer": "GET", "difficulty": "medium"},
    {"question": "In JavaScript, what does the 'this' keyword refer to inside a regular function?", "answer": "Depends on how the function is called", "difficulty": "medium"},
    {"question": "In React, which hook is used for managing state in a functional component?", "answer": "useState", "difficulty": "medium"},
    {"question": "What is the purpose of a Content Delivery Network (CDN)?", "answer": "Reduce latency by caching static assets closer to users", "difficulty": "medium"},
    {"question": "Which of the following best describes REST architecture?", "answer": "Stateless communication using HTTP methods", "difficulty": "hard"},
    {"question": "What is the main advantage of server-side rendering (SSR) in web apps?", "answer": "Better SEO and faster initial page load", "difficulty": "hard"},
    {"question": "In Docker, what does the 'COPY' instruction in a Dockerfile do?", "answer": "Copies files from host to container", "difficulty": "medium"},
    {"question": "Which database query language is commonly used for relational databases?", "answer": "SQL", "difficulty": "easy"}
]


def map_numeric_to_level(value: float) -> str:
    if value < 0.34:
        return "easy"
    elif value < 0.67:
        return "medium"
    else:
        return "hard"


@asynccontextmanager
async def lifespan(app: FastAPI):
    global quiz
    quiz = AdaptiveQuiz()
    quiz.assignWeight(samples)
    print("✅ AdaptiveQuiz initialized")
    yield
    quiz = None
    print("🛑 AdaptiveQuiz cleaned up")


app = FastAPI(lifespan=lifespan)


class AnswerRequest(BaseModel):
    question: str
    answer: str
    difficulty: float
    score: float


@app.get("/start-quiz")
def start_quiz(difficulty: float = 0.5):
    """Start quiz and return the first question"""
    level = map_numeric_to_level(difficulty)
    q = quiz.generateQuestion(level)

    if not q:
        return {"error": "Failed to generate first question"}

    timers = {"easy": 10, "medium": 15, "hard": 20}
    timer = timers.get(level, 15)

    quiz_history.clear()
    quiz_history.append({
        "question": q["question"],
        "options": q["options"],
        "correct_answer": q["answer"],
        "difficulty": level,
        "weight": q["weight"],
        "user_answer": None,
        "answered": False,
        "numeric_difficulty": difficulty,
    })

    return {
        "question": q["question"],
        "options": q["options"],
        "difficulty": level,
        "weight": q["weight"],
        "timer": timer,
        "numeric_difficulty": difficulty,
    }


@app.post("/next-question")
def get_question(data: AnswerRequest):
    difficulty = data.difficulty
    level = map_numeric_to_level(difficulty)

    q = quiz.generateQuestion(level)
    if not q:
        return {"error": "Failed to generate question"}

    timers = {"easy": 10, "medium": 15, "hard": 20}
    timer = timers.get(level, 15)

    quiz_history.append({
        "question": q["question"],
        "options": q["options"],
        "correct_answer": q["answer"],
        "difficulty": level,
        "weight": q["weight"],
        "user_answer": None,
        "answered": False,
        "numeric_difficulty": difficulty,
    })

    return {
        "question": q["question"],
        "options": q["options"],
        "difficulty": level,
        "weight": q["weight"],
        "timer": timer,
        "numeric_difficulty": difficulty,
    }


@app.post("/submit-answer")
def submit_answer(data: AnswerRequest):
    """Submit an answer for the last question"""
    if not quiz_history:
        return {"error": "No question has been asked yet"}

    last_q = quiz_history[-1]
    correct = data.answer == last_q["correct_answer"]

    new_score = data.score + last_q.get("weight", 1) if correct else data.score

    old_difficulty = last_q.get("numeric_difficulty", 0.5)
    if correct:
        new_difficulty = old_difficulty + (1 - old_difficulty) / 5
    else:
        new_difficulty = old_difficulty - (old_difficulty - 0) / 5

    last_q.update({
        "user_answer": data.answer,
        "was_correct": correct,
        "score_after": new_score,
        "answered": True,
        "numeric_difficulty": new_difficulty,
    })

    return {
        "correct": correct,
        "new_difficulty": new_difficulty,
        "next_level": map_numeric_to_level(new_difficulty),
        "score": new_score
    }


@app.get("/quiz-history")
def get_history():
    return {"history": quiz_history}


@app.post("/end-quiz/{application_id}")
async def end_quiz(application_id: str):
    formatted_quiz = []
    for q in quiz_history:
        formatted_quiz.append({
            "question": q["question"],
            "answer": q["user_answer"],
            "status": "Correct" if q.get("was_correct") else "Incorrect"
        })
    final_data = {"quiz": formatted_quiz}
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"http://localhost:7470/applications/{application_id}/quiz",
            json=final_data
        )
    return {"message": "Quiz ended", "data": response.json()}

@app.get("/")
def root():
    return {"msg": "FastAPI is running 🚀"}
# import json
# from fastapi import FastAPI, Query
# from pydantic import BaseModel
# from src.backend_py.quiz import AdaptiveQuiz

# app = FastAPI()

# sample_questions = [
#     {"question": "Which HTML tag is used to create a hyperlink?", "answer": "<a>", "difficulty": "easy"},
#     {"question": "Which CSS property is used to change text color?", "answer": "color", "difficulty": "easy"},
#     {"question": "Which HTTP method is typically idempotent?", "answer": "GET", "difficulty": "medium"},
#     {"question": "In JavaScript, what does the 'this' keyword refer to inside a regular function?", "answer": "Depends on how the function is called", "difficulty": "medium"},
#     {"question": "In React, which hook is used for managing state in a functional component?", "answer": "useState", "difficulty": "medium"},
#     {"question": "What is the purpose of a CDN?", "answer": "Reduce latency by caching static assets closer to users", "difficulty": "medium"},
#     {"question": "Which best describes REST architecture?", "answer": "Stateless communication using HTTP methods", "difficulty": "hard"},
#     {"question": "What is the main advantage of SSR in web apps?", "answer": "Better SEO and faster initial page load", "difficulty": "hard"},
#     {"question": "In Docker, what does 'COPY' do in Dockerfile?", "answer": "Copies files from host to container", "difficulty": "medium"},
#     {"question": "Which database query language is used for relational databases?", "answer": "SQL", "difficulty": "easy"},
# ]

# @app.on_event("startup")
# async def startup_event():
#     """Assign weights when API starts"""
#     quiz = AdaptiveQuiz()

#     quiz.assignWeight(sample_questions)

# class AnswerRequest(BaseModel):
#     user_answer: str
#     correct_answer: str
#     difficulty: float

# @app.get("/")
# def root():
#     return {"message": "Adaptive Quiz API is running!"}

# @app.get("/question")
# def get_question(difficulty: float = Query(0.5, description="Difficulty between 0.1 and 1.0")):
#     """Get a new question at given difficulty"""
#     return quiz.generateQuestion(difficulty)

# @app.post("/answer")
# def submit_answer(req: AnswerRequest):
#     """Check user answer & suggest next difficulty"""
#     if req.user_answer.upper() == req.correct_answer.upper():
#         next_difficulty = req.difficulty + (1 - req.difficulty) / 2
#         result = "Correct"
#     else:
#         next_difficulty = req.difficulty - (req.difficulty - 0) / 2
#         result = "Wrong"
#     return {"result": result, "next_difficulty": next_difficulty}
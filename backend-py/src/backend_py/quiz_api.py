import json
from fastapi import FastAPI, Query
from pydantic import BaseModel
from src.backend_py.quiz import AdaptiveQuiz

app = FastAPI()

quiz = AdaptiveQuiz()

sample_questions = [
    {"question": "Which HTML tag is used to create a hyperlink?", "answer": "<a>", "difficulty": "easy"},
    {"question": "Which CSS property is used to change text color?", "answer": "color", "difficulty": "easy"},
    {"question": "Which HTTP method is typically idempotent?", "answer": "GET", "difficulty": "medium"},
    {"question": "In JavaScript, what does the 'this' keyword refer to inside a regular function?", "answer": "Depends on how the function is called", "difficulty": "medium"},
    {"question": "In React, which hook is used for managing state in a functional component?", "answer": "useState", "difficulty": "medium"},
    {"question": "What is the purpose of a CDN?", "answer": "Reduce latency by caching static assets closer to users", "difficulty": "medium"},
    {"question": "Which best describes REST architecture?", "answer": "Stateless communication using HTTP methods", "difficulty": "hard"},
    {"question": "What is the main advantage of SSR in web apps?", "answer": "Better SEO and faster initial page load", "difficulty": "hard"},
    {"question": "In Docker, what does 'COPY' do in Dockerfile?", "answer": "Copies files from host to container", "difficulty": "medium"},
    {"question": "Which database query language is used for relational databases?", "answer": "SQL", "difficulty": "easy"},
]

@app.on_event("startup")
async def startup_event():
    """Assign weights when API starts"""
    quiz.assignWeight(sample_questions)

class AnswerRequest(BaseModel):
    user_answer: str
    correct_answer: str
    difficulty: float

@app.get("/")
def root():
    return {"message": "Adaptive Quiz API is running!"}

@app.get("/question")
def get_question(difficulty: float = Query(0.5, description="Difficulty between 0.1 and 1.0")):
    """Get a new question at given difficulty"""
    return quiz.generateQuestion(difficulty)

@app.post("/answer")
def submit_answer(req: AnswerRequest):
    """Check user answer & suggest next difficulty"""
    if req.user_answer.upper() == req.correct_answer.upper():
        next_difficulty = req.difficulty + (0.9 - req.difficulty) / 2
        result = "Correct"
    else:
        next_difficulty = req.difficulty - (req.difficulty - 0.1) / 2
        result = "Wrong"
    return {"result": result, "next_difficulty": next_difficulty}
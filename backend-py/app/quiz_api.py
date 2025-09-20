from fastapi import APIRouter
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import List, Dict, Any
from .quiz import AdaptiveQuiz  # absolute import
import httpx

quiz: AdaptiveQuiz | None = None  # global handle
quiz_history: List[Dict[str, Any]] = []


router = APIRouter(prefix="/quiz", tags=["quiz"])

# -------------------------------
# Lifespan (startup + shutdown)
# -------------------------------
@asynccontextmanager
async def lifespan(app):
    global quiz
    quiz = AdaptiveQuiz()
    print("✅ AdaptiveQuiz initialized with API key")
    yield
    quiz = None
    print("🛑 AdaptiveQuiz cleaned up")

# Attach lifespan to router
router.lifespan_context = lifespan

class SampleQuestion(BaseModel):
    question:str
    answer: str
    difficulty: str
    weight: float

class RecruiterSamplesRequest(BaseModel):
    samples:List[SampleQuestion]

class AnswerRequest(BaseModel):
    question: str
    answer: str
    correct: str
    difficulty: float
    score: float

@router.post("/prepare-quiz/{internship_id}")
async def prepare_quiz(internship_id: str):
    if not quiz:
        return {"error": "Quiz engine not initialized"}

    try:
        async with httpx.AsyncClient() as client:
            print("a")
            res = await client.get(f"http://localhost:7470/user/internship/{internship_id}/samples")
            print(res)
            res.raise_for_status()
            samples = res.json()
            print(samples)
    except Exception as e:
        return {"error": f"Failed to fetch recruiter samples: {str(e)}"}

    if not samples:
        return {"error": "No recruiter samples found for this internship"}

    # Assign weights
    weighted = quiz.assignWeight(samples)
    quiz.samples = weighted

    return {
        "message": f"Quiz prepared for internship {internship_id}",
        "weighted": weighted
    }


@router.post("/recruiter-samples")
def set_recruiter_samples(application_id:str, data: RecruiterSamplesRequest):
    if not quiz:
        return {"error":"Quiz engine not initialized"}
    
    sample_dicts = [s.dict() for s in data.samples]
    weighted = quiz.assignWeight(sample_dicts)
    quiz.samples = weighted
    return {"message":"Recruiter samples processed", "weighted":weighted}

@router.post("/next-question")
def get_question(data: AnswerRequest):
    if not quiz or not quiz.samples:
        return {"error":"No recruiter samples set yet. "}
    difficulty = data.difficulty
    q = quiz.generateQuestion(difficulty)
    if not q:
        return {"error": "Failed to generate question"}
    
    # set timer by difficulty
    timers = {"easy": 10, "medium": 15, "hard": 20}
    timer = timers.get(q["difficulty"].lower(), 15)

    quiz_history.append({
        "question": q["question"],
        "options": q["options"],
        "correct_answer": q["answer"],   # ✅ store correct answer
        "difficulty": q["difficulty"],
        "weight": q["weight"],
        "user_answer": None,
        "answered": False
    })

    return {
        "question": q["question"],
        "options": q["options"],
        "difficulty": q["difficulty"],
        "weight": q["weight"],
        "timer": timer,
    }


@router.get("/start-quiz/{internship_id}")
async def start_quiz(internship_id:str, difficulty: float = 0.5):
    """Start quiz and return the first question"""
    if not quiz:
        return {"error":"No recruiter samples set yet. "}
    print(1)
    print(quiz)
    if not getattr(quiz, "samples", None):
        prep = await prepare_quiz(internship_id)
        if "error" in prep:
            return prep
        
    print(2)

    q = quiz.generateQuestion(difficulty)
    print(3)
    if not q:
        return {"error": "Failed to generate first question"}
    print(4)

    # set timer by difficulty
    timers = {"easy": 10, "medium": 15, "hard": 20}
    timer = timers.get(q["difficulty"].lower(), 15)

    quiz_history.clear()  # reset old history
    quiz_history.append({
        "question": q["question"],
        "options": q["options"],
        "correct_answer": q["answer"],   # ✅ store correct answer
        "difficulty": q["difficulty"],
        "weight": q["weight"],
        "user_answer": None,
        "answered": False
    })
    print(q)

    return {
        "question": q["question"],
        "options": q["options"],
        "difficulty": q["difficulty"],
        "weight": q["weight"],
        "timer": timer,
    }

@router.post("/submit-answer")
def submit_answer(data: AnswerRequest):
    """Submit an answer for the last question"""
    if not quiz_history:
        return {"error": "No question has been asked yet"}

    last_q = quiz_history[-1]
    correct = data.answer == last_q["correct_answer"]

    # update score
    new_score = data.score + last_q.get("weight", 1) if correct else data.score

    # update difficulty adaptively
    old_difficulty = float(last_q.get("weight", 0.5))
    if correct:
        new_difficulty = old_difficulty + (1 - old_difficulty) / 5
    else:
        new_difficulty = old_difficulty - (old_difficulty - 0) / 5

    # update the last question in history
    last_q.update({
        "user_answer": data.answer,
        "was_correct": correct,
        "score_after": new_score,
        "answered": True,
        "difficulty": new_difficulty,
    })

    return {
        "correct": correct,
        "new_difficulty": new_difficulty,
        "score": new_score
    }

@router.get("/quiz-history")
def get_history():
    """View all answered questions so far"""
    return {"history": quiz_history}


@router.post("/end-quiz/{application_id}")
async def end_quiz(application_id:str):
    formatted_quiz=[]
    for q in quiz_history:
        formatted_quiz.append({
            "question": q["question"],  # if you store _id from DB, put that here instead
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
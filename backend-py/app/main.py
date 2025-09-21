from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .internship_recommender_api import router as recommend_router
from .resume_parser_api import router as resume_router
from .quiz_api import router as quiz_router
from .distance_calc import router as distance_router

app = FastAPI(title="Internship Platform API")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:7470",
    "http://127.0.0.1:7470",
    "http://127.0.0.1:8000",
    "http://localhost:8000",


]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend_router)
app.include_router(resume_router)
app.include_router(quiz_router)
app.include_router(distance_router)


# @app.post("/yoink")
# async def always_true_endpoint(request: Request):
#     data = await request.json()
#     return {"result": True}
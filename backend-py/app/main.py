from fastapi import FastAPI
import os
# Change working directory to the script's own folder
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

from internship_recommender_api import router as recommend_router
from resume_parser_api import router as resume_router
from quiz_api import router as quiz_router
from distance_route import router as distance_router

app = FastAPI(title="Internship Platform API")

app.include_router(recommend_router)
app.include_router(resume_router)
app.include_router(quiz_router)
app.include_router(distance_router)


# @app.post("/yoink")
# async def always_true_endpoint(request: Request):
#     data = await request.json()
#     return {"result": True}
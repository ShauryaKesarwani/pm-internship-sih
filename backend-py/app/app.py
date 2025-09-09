import os
# Change working directory to the script's own folder
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

from fastapi import FastAPI
from models import CandidateRequest, RecommendationResponse, JobResponse
from recommender import Recommender
from user_service import get_user_candidate

app = FastAPI(title="Internship Recommender API")

recommender = Recommender()

@app.post("/recommend/{user_id}", response_model=RecommendationResponse)
def recommend(user_id: str, prompt: str = ""):
    # 1. Load candidate data from Mongo
    candidate = get_user_candidate(user_id, prompt)

    # 2. Run recommender
    recs = recommender.recommend(candidate)

    # 3. Return schema
    return {
        "candidate_id": candidate.id,
        "recommendations": [JobResponse(**r) for r in recs]
    }
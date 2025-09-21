import os
from fastapi import APIRouter, Body
from .models import RecommendationResponse, JobResponse
from .recommender import Recommender
from .user_service import get_user_candidate
# Change working directory to the script's own folder
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

# app = FastAPI(title="Internship Recommender API")
router = APIRouter(prefix="/recommend", tags=["recommendations"])

recommender = Recommender()

# @app.post("/recommend/{user_id}", response_model=RecommendationResponse)
@router.post("/{user_id}", response_model=RecommendationResponse)
def recommend(user_id: str, prompt: str = "", filters: dict = Body(None)):
    # 1. Load candidate data from Mongo
    candidate = get_user_candidate(user_id, prompt)

    # 2. Run recommender with filters
    recs = recommender.recommend(candidate, filters=filters)

    # 3. Return schema
    return {
        "candidate_id": candidate.id,
        "recommendations": [JobResponse(**r) for r in recs]
    }
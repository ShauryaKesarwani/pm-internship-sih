from typing import List, Dict, Optional
from pydantic import BaseModel

class Project(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None

class CandidateRequest(BaseModel):
    id: str
    name: Optional[str] = None
    skills: List[str] = []
    projects: List[Project] = []
    education: Optional[str] = None
    bio: Optional[str] = None
    interests: List[str] = []

class JobResponse(BaseModel):
    job_id: str
    title: str
    company: Optional[str]
    combined_score: float
    sim_score: float
    meta_score: float
    requirements: List[str]
    tags: List[str]

class RecommendationResponse(BaseModel):
    candidate_id: str
    recommendations: List[JobResponse]

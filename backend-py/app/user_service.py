from .db import users_collection
from .models import CandidateRequest
from bson import ObjectId

def get_user_candidate(user_id: str, prompt: str) -> CandidateRequest:
    """
    Fetch user resume data from MongoDB and convert it to CandidateRequest schema.
    """
    try:
        user_doc = users_collection.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise ValueError(f"Invalid user_id: {user_id}")

    if not user_doc:
        raise ValueError(f"User {user_id} not found")

    # Build CandidateRequest from user_doc
    interests = user_doc.get("resume", {}).get("skills", [])  # start with skills
    if prompt:
        interests.append(prompt.lower())

    return CandidateRequest(
        id=str(user_doc["_id"]),   # convert ObjectId → string for API
        name=user_doc.get("name"),
        skills=user_doc.get("resume", {}).get("skills", []),
        projects=user_doc.get("resume", {}).get("projects", []),
        education=None,   # optional: fill from user_doc if you add later
        bio=None,
        interests=interests
    )
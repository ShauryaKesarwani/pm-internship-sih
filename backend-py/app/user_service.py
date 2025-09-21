from .db import users_collection, projects_collection
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
    # interests = user_doc.get("resume", {}).get("skills", [])  # start with skills
    interests = []
    if prompt:
        interests += prompt.lower().split()

    # add projects
    projects_list = []
    for pid in user_doc.get("resume", {}).get("projects", []):
        # pid might be an ObjectId
        if isinstance(pid, ObjectId):
            proj_doc = projects_collection.find_one({"_id": pid})
            if proj_doc:
                projects_list.append(proj_doc)  # now a dict, valid for Pydantic
        elif isinstance(pid, dict):
            projects_list.append(pid)  # already a dict

    return CandidateRequest(
        id=str(user_doc["_id"]),   # convert ObjectId → string for API
        name=user_doc.get("name"),
        skills=user_doc.get("resume", {}).get("skills", []),
        projects=projects_list,
        education=None,   # optional: fill from user_doc if you add later
        bio=None,
        interests=interests
    )
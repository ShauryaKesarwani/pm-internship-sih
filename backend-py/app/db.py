from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()
# Example using environment variable for connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
print(MONGO_URI)
client = MongoClient(MONGO_URI)
# db = client["don-tByteMe"]   # database local
db = client["test"]   # database online
users_collection = db["users"] # collection
projects_collection = db["projects"]
internships_collection = db["internships"]

def load_jobs_from_db():
    """Fetch internships and convert into recommender-friendly format"""
    jobs = []
    for doc in internships_collection.find():  # keep filter, status is in your schema
        details = doc.get("internshipDetails", {})

        job = {
            "id": str(doc["_id"]),
            "title": details.get("title", ""),
            "company": str(doc.get("company", "")),  # currently ObjectId, can resolve later if needed
            "requirements": details.get("skillsRequired", []),
            "description": " ".join(details.get("responsibilities", [])),
            "tags": [details.get("department", "")] if details.get("department") else [],
            "location": details.get("location", {}).get("city")
        }

        jobs.append(job)
        
    print(f"📄 Loaded {len(jobs)} jobs from MongoDB")
    return jobs
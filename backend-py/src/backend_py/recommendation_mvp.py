# recommendation_mvp.py
import os
import json
from typing import List, Dict, Any
import numpy as np
import pandas as pd

# Embedding libraries
from sentence_transformers import SentenceTransformer
# FAISS
import faiss

# Web API
from fastapi import FastAPI
from pydantic import BaseModel

# ---------------------------------------------------------
# CONFIG
# ---------------------------------------------------------
MODEL_NAME = os.getenv("EMBEDDING_MODEL", "google/embeddinggemma-300m")
EMBED_DIM = None  # will be set after loading model

# FAISS index file paths
INDEX_FILE = "jobs_index.faiss"
JOB_META_FILE = "job_meta.json"
CAND_EMB_FILE = "candidate_embs.npy"

# Change working directory to the script's own folder
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)
# ---------------------------------------------------------
# Utilities: build textual representation for candidate/job
# ---------------------------------------------------------
def candidate_to_text(candidate: Dict[str, Any]) -> str:
    """
    Compose a candidate profile text from structured fields.
    candidate: {
        "id": str,
        "name": str,
        "skills": [str],
        "projects": [{"title": str, "summary": str}],
        "education": str,
        "bio": str
    }
    """
    parts = []
    if candidate.get("skills"):
        parts.append("Skills: " + ", ".join(candidate["skills"]))
    if candidate.get("projects"):
        proj_texts = []
        for p in candidate["projects"]:
            title = p.get("title", "")
            summary = p.get("summary", "")
            if title and summary:
                proj_texts.append(f"{title}: {summary}")
            elif title:
                proj_texts.append(title)
            elif summary:
                proj_texts.append(summary)
        if proj_texts:
            parts.append("Projects: " + " | ".join(proj_texts))
    if candidate.get("education"):
        parts.append("Education: " + candidate["education"])
    if candidate.get("bio"):
        parts.append(candidate["bio"])

    return " . ".join(parts)


def job_to_text(job: Dict[str, Any]) -> str:
    """
    Compose a job/internship description text.
    job: {
        "id": str,
        "title": str,
        "company": str,
        "requirements": [str],
        "description": str,
        "tags": [str]
    }
    """
    parts = []
    header = job.get("title", "")
    company = job.get("company")
    if company:
        header += f" at {company}"
    if header:
        parts.append(header)
    if job.get("requirements"):
        parts.append("Requirements: " + ", ".join(job["requirements"]))
    if job.get("description"):
        parts.append(job["description"])
    if job.get("tags"):
        parts.append("Tags: " + ", ".join(job["tags"]))
    return " . ".join(parts)


# ---------------------------------------------------------
# Embedding model wrapper
# ---------------------------------------------------------
class Embedder:
    def __init__(self, model_name: str = MODEL_NAME):
        print("Loading embedding model:", model_name)
        self.model = SentenceTransformer(model_name)
        global EMBED_DIM
        EMBED_DIM = self.model.get_sentence_embedding_dimension()
        print("Embedding dimension:", EMBED_DIM)

    def embed_texts(self, texts: List[str]) -> np.ndarray:
        # returns numpy array (n, dim)
        embs = self.model.encode(texts, show_progress_bar=False, convert_to_numpy=True, normalize_embeddings=True)
        return embs


# ---------------------------------------------------------
# FAISS Index utilities
# ---------------------------------------------------------
def build_faiss_index(embeddings: np.ndarray) -> faiss.Index:
    """
    Build a FAISS index (Inner Product on normalized vectors ~ cosine).
    """
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)  # cosine if embeddings normalized
    index.add(embeddings)
    return index


def save_faiss(index: faiss.Index, path: str):
    faiss.write_index(index, path)


def load_faiss(path: str) -> faiss.Index:
    return faiss.read_index(path)


# ---------------------------------------------------------
# Example scoring / reranking
# ---------------------------------------------------------
def metadata_score(candidate: Dict[str, Any], job: Dict[str, Any]) -> float:
    """
    Compute simple metadata-based score to rerank vector matches.
    - skill overlap: fraction of job requirements present in candidate's skills
    - location match or experience bonuses can be added
    """
    score = 0.0
    c_skills = set([s.lower() for s in candidate.get("skills", [])])
    j_reqs = set([s.lower() for s in job.get("requirements", [])])

    if j_reqs:
        overlap = len(c_skills & j_reqs) / len(j_reqs)
        score += 0.6 * overlap  # weight for skill overlap
    # preference example (if both have tags)
    c_tags = set([t.lower() for t in candidate.get("interests", [])]) if candidate.get("interests") else set()
    j_tags = set([t.lower() for t in job.get("tags", [])]) if job.get("tags") else set()
    if j_tags and c_tags:
        tag_overlap = len(c_tags & j_tags) / max(1, len(j_tags))
        score += 0.2 * tag_overlap

    # small boost for presence of relevant project keywords
    project_text = " ".join([p.get("title", "") + " " + p.get("summary", "") for p in candidate.get("projects", [])])
    job_text = " ".join(job.get("requirements", []) + job.get("tags", []) + [job.get("title", "")])
    # naive keyword boost:
    keywords = [kw for kw in job.get("requirements", []) if len(kw.split()) == 1]  # single-word keywords
    if keywords and project_text:
        hits = sum(1 for kw in keywords if kw.lower() in project_text.lower())
        score += 0.2 * (hits / max(1, len(keywords)))

    return score

from pymongo import MongoClient

# ---------------------------------------------------------
# MongoDB loader
# ---------------------------------------------------------
from bson import ObjectId

def load_jobs_from_mongo(
    uri: str = "mongodb://localhost:27017",
    db_name: str = "don-tByteMe",
    collection_name: str = "internships"
) -> list[dict]:
    """
    Load all internships from local MongoDB and normalize to job dict format.
    """
    client = MongoClient(uri)
    db = client[db_name]
    collection = db[collection_name]

    jobs = []
    for doc in collection.find():
        # Convert ObjectId to string
        doc_id = str(doc.get("_id"))
        job = {
            "id": doc_id,
            "title": doc.get("title", ""),
            "company": doc.get("company", ""),
            "requirements": doc.get("requirements", []),
            "description": doc.get("description", ""),
            "tags": doc.get("tags", []),
            "location": doc.get("location", "remote"),
            "min_experience_months": doc.get("min_experience_months", 0)
        }
        jobs.append(job)
    return jobs

# ---------------------------------------------------------
# Example dataset loader (toy dataset)
# ---------------------------------------------------------
def load_example_jobs() -> List[Dict[str, Any]]:
    jobs = [
        {
            "id": "job1",
            "title": "Frontend Intern",
            "company": "Acme UI",
            "requirements": ["React", "JavaScript", "HTML", "CSS"],
            "description": "Work on user interfaces and responsive web apps. Good eye for design.",
            "tags": ["frontend", "web", "react"],
            "location": "remote",
            "min_experience_months": 0
        },
        {
            "id": "job2",
            "title": "ML Research Intern",
            "company": "DeepAlpha",
            "requirements": ["Python", "PyTorch", "Machine Learning", "NLP"],
            "description": "Implement models and run experiments on text data.",
            "tags": ["ml", "nlp", "research"],
            "location": "onsite",
            "min_experience_months": 3
        },
        {
            "id": "job3",
            "title": "Embedded Systems Intern",
            "company": "IoTWorks",
            "requirements": ["C", "Embedded", "RTOS"],
            "description": "Work with microcontrollers, sensors, and low-level firmware.",
            "tags": ["embedded", "firmware"],
            "location": "onsite",
            "min_experience_months": 0
        },
    ]
    return jobs


# ---------------------------------------------------------
# Build index (MVP)
# ---------------------------------------------------------
def build_job_index(jobs: List[Dict[str, Any]], embedder: Embedder):
    job_texts = [job_to_text(j) for j in jobs]
    job_embs = embedder.embed_texts(job_texts)
    index = build_faiss_index(job_embs)
    # save index and metadata
    save_faiss(index, INDEX_FILE)
    with open(JOB_META_FILE, "w", encoding="utf8") as f:
        json.dump(jobs, f, ensure_ascii=False, indent=2)
    return index, job_embs


# ---------------------------------------------------------
# Query pipeline: retrieve + rerank
# ---------------------------------------------------------

def parse_prompt(prompt: str):
    must_have, must_not = [], []
    text = prompt.lower()

    if "not" in text:
        excluded = text.split("not")[-1].strip()
        must_not = excluded.split()
    else:
        must_have = text.split()

    return must_have, must_not

def recommend_for_candidate(
    candidate: Dict[str, Any], embedder: Embedder, top_k=5, rerank_k=20,
    prompt_weight=2.0, penalty=-0.5
):
    # Parse prompt
    prompt = " ".join(candidate.get("interests", [])) if candidate.get("interests") else ""
    must_have, must_not = parse_prompt(prompt)

    # Candidate base embedding
    candidate_text = candidate_to_text(candidate)
    c_emb = embedder.embed_texts([candidate_text])[0].astype("float32")

    # If positive prompt, add weighted
    if must_have:
        prompt_emb = embedder.embed_texts([" ".join(must_have)])[0].astype("float32")
        c_emb = (c_emb + prompt_weight * prompt_emb) / (1 + prompt_weight)

    # Load jobs
    index = load_faiss(INDEX_FILE)
    with open(JOB_META_FILE, "r", encoding="utf8") as f:
        jobs = json.load(f)

    # Search
    D, I = index.search(np.expand_dims(c_emb, axis=0), rerank_k)
    idxs, sims = I[0].tolist(), D[0].tolist()

    # Rerank with penalties
    rerank_candidates = []
    for pos, idx in enumerate(idxs):
        if idx < 0 or idx >= len(jobs):
            continue
        job = jobs[idx]
        sim_score = sims[pos]
        meta_score = metadata_score(candidate, job)

        combined = 0.6 * sim_score + 0.4 * meta_score

        # 🔹 Apply penalty if job matches "must_not"
        if must_not:
            job_text = " ".join(job.get("requirements", []) + job.get("tags", []))
            if any(word in job_text.lower() for word in must_not):
                combined += penalty  # drop score (e.g., -0.5)

        rerank_candidates.append((job, combined, sim_score, meta_score))

    # Sort + return
    rerank_candidates.sort(key=lambda x: x[1], reverse=True)
    results = []
    for job, combined, sim, meta in rerank_candidates[:top_k]:
        results.append({
            "job_id": job["id"],
            "title": job["title"],
            "company": job.get("company"),
            "combined_score": float(combined),
            "sim_score": float(sim),
            "meta_score": float(meta),
            "requirements": job.get("requirements"),
            "tags": job.get("tags"),
        })
    return results


# ---------------------------------------------------------
# Minimal FastAPI wrapper to serve recommendations
# ---------------------------------------------------------
app = FastAPI()

class CandidateRequest(BaseModel):
    id: str
    name: str = None
    skills: List[str] = []
    projects: List[Dict[str, str]] = []
    education: str = None
    bio: str = None
    interests: List[str] = []

# global embedder
EMBEDDER = Embedder()  # loads model on import

@app.post("/recommend")
def recommend(req: CandidateRequest):
    candidate = req.dict()
    recs = recommend_for_candidate(candidate, EMBEDDER, top_k=5, rerank_k=10)
    return {"candidate_id": candidate.get("id"), "recommendations": recs}


# ---------------------------------------------------------
# CLI / demo run
# ---------------------------------------------------------
if __name__ == "__main__":
    # Quick demo: create index if not exists
    jobs = jobs = load_jobs_from_mongo() #load_example_jobs()
    if not os.path.exists(INDEX_FILE) or not os.path.exists(JOB_META_FILE):
        print("Building job index...")
        build_job_index(jobs, EMBEDDER)
        print("Index built.")
    else:
        print("Index exists. Ready.")

    # Demo candidate
    candidate_demo = {
        "id": "c1",
        "name": "Asha",
        "skills": ["Python", "PyTorch", "NLP", "Data Analysis"],
        "projects": [{"title": "Text Classifier", "summary": "Built a news classifier using transformer models."}],
        "education": "B.Tech Computer Science",
        "bio": "Interested in NLP and research.",
        "interests": ["nlp", "ml"]
    }
    recs = recommend_for_candidate(candidate_demo, EMBEDDER)
    print("Recommendations for demo candidate:")
    print(json.dumps(recs, indent=2))
    # Optionally run the FastAPI server:
    # uvicorn.run(app, host="0.0.0.0", port=8000)

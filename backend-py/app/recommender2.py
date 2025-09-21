import os
import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer, util

# Change working directory to the script's own folder
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

# Paths (relative to this file)
BASE_DIR = os.path.dirname(__file__)
INDEX_FILE = os.path.join(BASE_DIR, "jobs_index.faiss")
META_FILE = os.path.join(BASE_DIR, "job_meta.json")

class Recommender:
    def __init__(self, model_name="google/embeddinggemma-300m"):
        self.model = SentenceTransformer(model_name)
        self.dim = self.model.get_sentence_embedding_dimension()
        if os.path.exists(INDEX_FILE) and os.path.exists(META_FILE):
            self.index = faiss.read_index(INDEX_FILE)
            with open(META_FILE, "r") as f:
                self.jobs = json.load(f)
        else:
            self.index, self.jobs = None, []

    def embed(self, texts):
        return self.model.encode(
            texts, show_progress_bar=False, convert_to_numpy=True, normalize_embeddings=True
        )

    def candidate_to_text(self, c):
        parts = []
        if c.skills:
            parts.append("Skills: " + ", ".join(c.skills))
        if c.projects:
            parts.append("Projects: " + " | ".join(
                [f"{p.title}: {p.summary}" for p in c.projects if p.title or p.summary]
            ))
        if c.education:
            parts.append("Education: " + c.education)
        if c.bio:
            parts.append(c.bio)
        return " . ".join(parts)

    
    def metadata_score(self, candidate, job):
        candidate_items = candidate.skills + candidate.interests
        job_items = job.get("requirements", []) + job.get("tags", [])

        if not candidate_items or not job_items:
            return 0.0

        # 1️⃣ Embed each item separately
        c_embs = self.embed(candidate_items)   # shape: (num_c, dim)
        j_embs = self.embed(job_items)         # shape: (num_j, dim)

        # 2️⃣ Compute cosine similarity matrix
        sims = util.cos_sim(c_embs, j_embs).cpu().numpy()  # shape: (num_c, num_j)

        # 3️⃣ For each candidate skill, take the max similarity to any job requirement
        max_per_c = sims.max(axis=1)

        # 4️⃣ Average across candidate skills
        score = float(max_per_c.mean())

        return score
        
        # if j_reqs:
        #     score += 0.6 * (len(c_skills & j_reqs) / len(j_reqs))
        # c_tags = set(t.lower() for t in candidate.interests)
        # j_tags = set(t.lower() for t in job.get("tags", []))
        # if j_tags:
        #     score += 0.2 * (len(c_tags & j_tags) / len(j_tags))
        # return score

    def recommend(self, candidate, top_k=6, rerank_k=20):
        if not self.index:
            raise RuntimeError("FAISS index not built. Run indexing first.")

        # 1️⃣ FAISS coarse similarity on full profile
        text = self.candidate_to_text(candidate)
        c_emb = self.embed([text])[0].astype("float32")
        D, I = self.index.search(np.expand_dims(c_emb, 0), rerank_k)

        results = []
        for pos, idx in enumerate(I[0]):
            if idx < 0 or idx >= len(self.jobs):
                continue
            job = self.jobs[idx]

            sim_score = float(D[0][pos])  # FAISS similarity
            meta_score = self.metadata_score(candidate, job)  # skills + tags semantic

            combined_score = 0.7 * sim_score + 0.3 * meta_score

            results.append({
                "job_id": job["id"],
                "title": job["title"],
                "company": job.get("company"),
                "requirements": job.get("requirements", []),
                "tags": job.get("tags", []),
                "sim_score": sim_score,
                "meta_score": meta_score,
                "combined_score": combined_score
            })

        # Sort by combined_score descending
        return sorted(results, key=lambda x: x["combined_score"], reverse=True)[:top_k]
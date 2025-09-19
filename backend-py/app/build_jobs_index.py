import os
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

from db import load_jobs_from_db

BASE_DIR = os.path.dirname(__file__)
INDEX_FILE = os.path.join(BASE_DIR, "jobs_index.faiss")
META_FILE = os.path.join(BASE_DIR, "job_meta.json")

def build_faiss_index(jobs, model_name="google/embeddinggemma-300m"):
    print(f"🔄 Loading embedding model: {model_name}")
    model = SentenceTransformer(model_name)
    dim = model.get_sentence_embedding_dimension()

    # Convert jobs into texts
    texts = []
    for j in jobs:
        parts = [j["title"], j.get("company", "")]
        if j.get("requirements"):
            parts.append("Requirements: " + ", ".join(j["requirements"]))
        if j.get("description"):
            parts.append(j["description"])
        if j.get("tags"):
            parts.append("Tags: " + ", ".join(j["tags"]))
        texts.append(" . ".join(parts))

    print(f"📄 Embedding {len(texts)} jobs...")
    embs = model.encode(texts, show_progress_bar=True, convert_to_numpy=True, normalize_embeddings=True).astype("float32")

    # Build FAISS index
    index = faiss.IndexFlatIP(dim)
    index.add(embs)

    faiss.write_index(index, INDEX_FILE)
    with open(META_FILE, "w", encoding="utf-8") as f:
        json.dump(jobs, f, indent=2, ensure_ascii=False)

    print(f"✅ Saved index to {INDEX_FILE}, metadata to {META_FILE}")

if __name__ == "__main__":
    jobs = load_jobs_from_db()
    print(jobs)
    if not jobs:
        print("⚠️ No jobs found in DB.")
    else:
        build_faiss_index(jobs)
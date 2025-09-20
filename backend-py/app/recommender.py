import os
import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer, util

class Recommender:
    def __init__(self, model_name="google/embeddinggemma-300m"):
        self.model = SentenceTransformer(model_name)
        self.dim = self.model.get_sentence_embedding_dimension()
        
        # Load index and jobs
        script_dir = os.path.dirname(os.path.abspath(__file__))
        INDEX_FILE = os.path.join(script_dir, "jobs_index.faiss")
        META_FILE = os.path.join(script_dir, "job_meta.json")
        
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

    def candidate_to_text(self, candidate):
        """Convert candidate object to text representation"""
        parts = []
        
        # Extract skills
        try:
            skills = getattr(candidate, 'skills', []) or []
            if skills:
                # Filter out nonsensical skills
                valid_skills = [s for s in skills if len(s) > 2 and not s.lower() in ["hik", "hey", "i love you"]]
                if valid_skills:
                    parts.append("Skills: " + ", ".join(valid_skills))
        except:
            pass
        
        # Extract projects if available
        try:
            projects = getattr(candidate, 'projects', []) or []
            if projects:
                proj_text = []
                for project in projects:
                    title = getattr(project, 'title', '') or ''
                    summary = getattr(project, 'summary', '') or ''
                    if title:
                        proj_text.append(f"{title}: {summary}" if summary else title)
                if proj_text:
                    parts.append("Projects: " + " | ".join(proj_text))
        except:
            pass
        
        # Extract education if available
        try:
            education = getattr(candidate, 'education', '') or ''
            if education:
                parts.append(f"Education: {education}")
        except:
            pass
        
        # Extract bio if available
        try:
            bio = getattr(candidate, 'bio', '') or ''
            if bio:
                parts.append(bio)
        except:
            pass
        
        # Extract interests if available
        try:
            interests = getattr(candidate, 'interests', []) or []
            if interests:
                parts.append("Interests: " + ", ".join(interests))
        except:
            pass
            
        return " . ".join(parts)

    def calculate_skill_match_score(self, candidate_skills, job_requirements):
        """Calculate skill matching score using exact and semantic matching"""
        if not candidate_skills or not job_requirements:
            return 0.0
            
        # Clean and normalize skills
        c_skills_clean = [s.lower().strip() for s in candidate_skills 
                         if len(s.strip()) > 2 and s.lower().strip() not in ["hik", "hey", "i love you"]]
        j_reqs_clean = [r.lower().strip() for r in job_requirements]
        
        if not c_skills_clean or not j_reqs_clean:
            return 0.0
        
        # 1. Exact matching (higher weight for exact matches)
        exact_matches = 0
        for req in j_reqs_clean:
            for skill in c_skills_clean:
                if req in skill or skill in req:
                    exact_matches += 1
                    break
        
        exact_score = exact_matches / len(j_reqs_clean)
        
        # 2. Semantic matching (with stricter threshold)
        if len(c_skills_clean) > 0 and len(j_reqs_clean) > 0:
            c_embs = self.embed(c_skills_clean)
            j_embs = self.embed(j_reqs_clean)
            
            similarities = util.cos_sim(c_embs, j_embs).cpu().numpy()
            
            # Only count similarities above threshold (0.6 instead of any positive value)
            threshold = 0.6
            semantic_matches = 0
            for i, req_emb in enumerate(j_embs):
                max_sim = similarities[:, i].max()
                if max_sim >= threshold:
                    semantic_matches += 1
            
            semantic_score = semantic_matches / len(j_reqs_clean)
        else:
            semantic_score = 0.0
        
        # Combine exact and semantic (prefer exact matches)
        combined_score = 0.7 * exact_score + 0.3 * semantic_score
        return combined_score

    def calculate_domain_relevance(self, candidate, job):
        """Calculate how relevant the job is to candidate's domain/experience"""
        job_tags = job.get("tags", [])
        job_title = job.get("title", "").lower()
        job_desc = job.get("description", "").lower()
        
        # Get candidate domain indicators using getattr
        try:
            candidate_skills = getattr(candidate, 'skills', []) or []
            candidate_interests = getattr(candidate, 'interests', []) or []
            candidate_bio = getattr(candidate, 'bio', '') or ''
        except:
            candidate_skills = []
            candidate_interests = []
            candidate_bio = ''
        
        # Check domain alignment
        tech_domains = ["engineering", "analytics", "product engineering", "it security"]
        creative_domains = ["creative studio", "video editing", "design"]
        manual_domains = ["maintenance", "electrical works", "fabrication", "vehicle maintenance", "hvac"]
        
        job_domain = "other"
        for tag in job_tags:
            tag_lower = tag.lower()
            if tag_lower in tech_domains:
                job_domain = "tech"
                break
            elif tag_lower in creative_domains:
                job_domain = "creative"
                break
            elif tag_lower in manual_domains:
                job_domain = "manual"
                break
        
        # Determine candidate's likely domain from skills and interests
        all_candidate_text = " ".join([
            " ".join(candidate_skills),
            " ".join(candidate_interests),
            candidate_bio
        ]).lower()
        
        tech_keywords = ["python", "javascript", "react", "programming", "code", "software", "web", "api", "django", "flask", "sql"]
        creative_keywords = ["design", "photoshop", "video", "editing", "creative", "thumbnail", "obs", "illustrator"]
        
        tech_count = sum(1 for kw in tech_keywords if kw in all_candidate_text)
        creative_count = sum(1 for kw in creative_keywords if kw in all_candidate_text)
        
        if tech_count > creative_count and tech_count > 0:
            candidate_domain = "tech"
        elif creative_count > 0:
            candidate_domain = "creative"
        else:
            candidate_domain = "general"
        
        # Calculate domain match score
        if candidate_domain == "tech" and job_domain == "tech":
            return 1.0
        elif candidate_domain == "creative" and job_domain == "creative":
            return 1.0
        elif candidate_domain in ["tech", "creative"] and job_domain == "manual":
            return 0.1  # Strong penalty for tech/creative candidates with manual jobs
        elif job_domain == "other":
            return 0.5  # Neutral for unclear job domains
        else:
            return 0.3  # Some mismatch but not terrible

    def recommend(self, candidate, top_k=6, rerank_k=20):
        """Main recommendation function with improved scoring"""
        if not self.index:
            raise RuntimeError("FAISS index not built. Run indexing first.")

        # Get semantic similarity from FAISS
        text = self.candidate_to_text(candidate)
        if not text.strip():
            return []
            
        c_emb = self.embed([text])[0].astype("float32")
        D, I = self.index.search(np.expand_dims(c_emb, 0), rerank_k)

        results = []
        
        # Get candidate skills using getattr
        try:
            candidate_skills = getattr(candidate, 'skills', []) or []
        except:
            candidate_skills = []
        
        for pos, idx in enumerate(I[0]):
            if idx < 0 or idx >= len(self.jobs):
                continue
                
            job = self.jobs[idx]
            
            # 1. Semantic similarity (normalize FAISS score to 0-1)
            faiss_score = float(D[0][pos])
            # FAISS returns dot product for normalized vectors (cosine similarity)
            # Convert to 0-1 range where 1 is best match
            semantic_score = max(0, min(1, faiss_score))
            
            # 2. Skill matching score
            skill_score = self.calculate_skill_match_score(
                candidate_skills, 
                job.get("requirements", [])
            )
            
            # 3. Domain relevance score
            domain_score = self.calculate_domain_relevance(candidate, job)
            
            # 4. Combined scoring with adjusted weights
            combined_score = (
                0.3 * semantic_score +    # Reduced weight for general semantic similarity
                0.5 * skill_score +       # Higher weight for specific skill matching
                0.2 * domain_score        # Domain alignment
            )
            
            # Apply additional penalties for obvious mismatches
            job_title_lower = job.get("title", "").lower()
            manual_job_keywords = ["plumber", "electrician", "welder", "mechanic", "hvac"]
            
            if any(keyword in job_title_lower for keyword in manual_job_keywords):
                if skill_score < 0.1:  # No relevant skills
                    combined_score *= 0.3  # Heavy penalty
            
            results.append({
                "job_id": job["id"],
                "title": job["title"],
                "company": job.get("company"),
                "location": job.get("location"),
                "requirements": job.get("requirements", []),
                "tags": job.get("tags", []),
                "description": job.get("description", ""),
                "sim_score": round(semantic_score, 3),  # Changed from semantic_score
                "meta_score": round((skill_score + domain_score) / 2, 3),  # Combined skill + domain
                "combined_score": round(combined_score, 3),
                # Optional: Keep detailed scores as well for debugging
                "semantic_score": round(semantic_score, 3),
                "skill_score": round(skill_score, 3),
                "domain_score": round(domain_score, 3)
            })

        # Sort by combined score and return top k
        results.sort(key=lambda x: x["combined_score"], reverse=True)
        return results[:top_k]

# Example usage:
def test_recommendation():
    # Your sample user data
    user_data = {
        "field": "tech",
        "resume": {
            "skills": [
                "Python", "Matplotlib", "Numpy", "Flask", "Django", "PyQt", "Tkinter",
                "discord.py", "HTML", "CSS", "JS", "PostgreSQL", "React", "Git", "GitHub",
                "RESTful API", "Websockets", "Azure", "Oracle Cloud VPS", "Chrome/Firefox DevTools",
                "MySQL", "Supabase API for Python", "Colour Theory", "Thumbnails UI",
                "Photoshop", "OBS", "GenAI SDKS", "Problem Solving", "Prompting",
                "Hardware/Software Troubleshooting", "Video/Photo Editing", "Blockchain/Web3 basics"
            ],
            "certifications": [
                "Google Code-In (2019)",
                "Smart India Hackathon (2024)",
                "Union Bank IdeaHackathon Hosting (2025)"
            ]
        },
        "experience": {
            "internships": [
                {
                    "title": "Video/Audio Editing",
                    "company": "Freelance",
                    "duration": "2020",
                    "description": "Over 200 videos and 300+ high quality thumbnails created. Managed client projects with strict deadlines."
                },
                {
                    "title": "Idea Hackathon",
                    "company": "Union Bank & CSI",
                    "duration": "2025",
                    "description": "Helped seniors with bug testing, CSS fixes, and solving technical issues for judges and participants."
                }
            ]
        }
    }
    
    # Initialize recommender and get recommendations
    recommender = Recommender()
    try:
        recommendations = recommender.recommend(user_data, top_k=6)
        
        print("Job Recommendations:")
        print("-" * 50)
        for i, rec in enumerate(recommendations, 1):
            print(f"{i}. {rec['title']} at {rec['company']}")
            print(f"   Location: {rec['location']}")
            print(f"   Combined Score: {rec['combined_score']}")
            print(f"   (Semantic: {rec['semantic_score']}, Skills: {rec['skill_score']}, Domain: {rec['domain_score']})")
            print(f"   Requirements: {', '.join(rec['requirements'])}")
            print()
            
    except RuntimeError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_recommendation()
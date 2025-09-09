import requests

payload = {
    "id": "c1",
    "name": "Test Candidate",
    "skills": ["python", "machine learning", "nlp"],
    "projects": [{"title": "chatbot", "summary": "chatbot using transformers"}],
    "education": "B.Tech CSE",
    "bio": "Love working on AI projects",
    "interests": ["ml", "nlp"]
}

resp = requests.post("http://127.0.0.1:8000/recommend", json=payload)
print(resp.json())


a = {
    "candidate_id": "c1",
    "recommendations": [
        {
            "job_id": "job2",
            "title": "ML Research Intern",
            "company": "DeepAlpha",
            "combined_score": 0.7174272179603576,
            "sim_score": 0.7748960256576538,
            "meta_score": 0.5833333333333333,
            "requirements": ["Python", "PyTorch", "Machine Learning", "NLP"],
            "tags": ["ml", "nlp", "research"],
        },
        {
            "job_id": "job1",
            "title": "Frontend Intern",
            "company": "Acme UI",
            "combined_score": 0.38402247428894043,
            "sim_score": 0.5486035346984863,
            "meta_score": 0.0,
            "requirements": ["React", "JavaScript", "HTML", "CSS"],
            "tags": ["frontend", "web", "react"],
        },
        {
            "job_id": "job3",
            "title": "Embedded Systems Intern",
            "company": "IoTWorks",
            "combined_score": 0.37977705121040345,
            "sim_score": 0.5139672160148621,
            "meta_score": 0.06666666666666667,
            "requirements": ["C", "Embedded", "RTOS"],
            "tags": ["embedded", "firmware"],
        },
    ],
}

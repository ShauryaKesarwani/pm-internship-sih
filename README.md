# PM Internship Scheme – AI-based Smart Internship Recommendation Platform

## Overview

This project is an AI-powered platform designed to match students with the most suitable internships under the PM Internship Scheme. Leveraging content-based filtering and Natural Language Processing (NLP), the system extracts skills and experiences from student resumes and matches them with job descriptions provided by top companies. The platform aims to provide a fair, inclusive, and efficient internship matching experience, especially for first-generation and rural learners.

## Key Features

- **AI-based Internship Recommendations:** Personalized suggestions using machine learning and NLP to match students with relevant internships.
- **Resume Parsing:** Automatic extraction of skills, projects, certifications, education, and experience from uploaded resumes.
- **Proficiency Test:** Recruiters can set rapid-fire quizzes to further assess candidates.
- **Multi-lingual & Mobile-first:** Simple, accessible interface with regional language support for inclusivity.
- **Bias Reduction:** AI-driven matching to ensure fair exposure, especially for rural and tribal learners.
- **Role-based Access & Security:** End-to-end encryption, hashed credentials, and compliance with government security standards.
- **Scalable & Efficient:** Designed for low resource usage and easy integration as a plug-in with existing portals.

## User Flows

### For Students
- Register and verify identity.
- Upload resume (auto-fills profile).
- Set location and sector preferences.
- Take recruiter-set proficiency tests.
- Receive top internship recommendations.
- Option to communicate with recruiters.

### For Recruiters
- Register and verify using CIN.
- Create and manage internship listings.
- Set or generate quiz questions for applicants.
- View applicant quiz scores, resumes, and projects.
- Communicate with candidates for next steps.

## Tech Stack

- **Frontend:** Next.js, React.js, Tailwind CSS, JavaScript
- **Backend:** Node.js (Express.js), Python (FastAPI, scikit-learn, numpy, pandas)
- **Database:** MongoDB
- **Other:** Docker (for deployment), AI/ML models for recommendation and parsing

## Setup & Installation

1. **Backend (Python)**
   - Navigate to `backend-py/`
   - Install dependencies:  
     ```
     .venv\Scripts\activate
     uv sync
     ```
   - Start the server:  
     ```
     uvicorn app.main:app --reload --port 8000
     ```

2. **Backend (Node.js)**
   - Navigate to `backend-js/`
   - Install dependencies:  
     ```
     npm install
     ```
   - Start the server:  
     ```
     npm start
     ```

3. **Frontend**
   - Navigate to `frontend/`
   - Install dependencies:  
     ```
     npm install
     ```
   - Start the development server:  
     ```
     npm run dev
     ```

## Notes

- Ensure MongoDB is running and accessible to both backends.

## Resources & References

- [PM Internship Scheme Official Portal](http://pminternship.mca.gov.in/login/)
- [Challenges in the PM Internship Scheme – AngelOne](http://www.angelone.in/news/market-updates/challenges-in-the-pm-internship-scheme-falling-short-of-ambitious-goals)
- [Research Paper: IJSRSET](https://doi.org/10.32628/ijsrset24116170)
- [Government Portal](http://Ux4g.gov.in)

---

Further documentation and resource links will be added soon. For any queries, please contact the maintainers.

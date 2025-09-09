from google import genai
from dotenv import load_dotenv
import os
from google.genai import types
import pathlib

class ResumeParser:
    def __init__(self):
        load_dotenv()
        self.API_KEY = os.getenv("GOOGLE_API_KEY")

        # Configure with API key
        self.client = genai.Client(api_key=self.API_KEY)

    def review_resume(self, pdf_path: str) -> str:
        # Load the PDF
        # file_path = r"C:\Users\shaur\Downloads\Shaurya Kesarwani Resume 2025.docx.pdf"
        file_path = pathlib.Path(pdf_path)

        system_instruction_prompt = """You are a resume parser.
        Extract structured information from resumes into strict JSON format.

        Use this schema:
        {
            "full_name": string,
            "email": string,
            "phone": string,
            "location": string,
            "social_links": [string],
            "skills": [string],
            "education": [ 
                { "degree_or_certification": string, "institution": string, "year": string } 
            ],
            "experience": [ 
                { "role": string, "organization": string, "duration": string, "details": string } 
            ],
            "projects_or_portfolio": [ 
                { "title": string, "description": string } 
            ],
            "certifications": [string],
            "languages": [string],
            "interests": [string]
        }

        - Always return valid JSON only, nothing else.
        - If some fields are missing, use empty string "" or empty list [].
        - Do not assume this is a tech job; adapt to any domain (medicine, law, arts, etc.).
        """

        prompt_part = ("Parse this resume line by line and extract relevant information in given format")
        #print(prompt_part) # debug print

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                prompt_part,
                types.Part.from_bytes(
                    data=file_path.read_bytes(),
                    mime_type="application/pdf",
                ),
            ],
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=0),
                system_instruction=system_instruction_prompt
            ),
        )

        # Output the result
        return response.text


if __name__ == "__main__":
    reviewer = ResumeParser()
    resume_path = r"D:/College/otherwork/SohaResume1.pdf"
    # resume_path = r"C:\Users\Soha\Downloads\Berlin-Simple-Resume-Template.pdf"
    result = reviewer.review_resume(resume_path)
    print(result)



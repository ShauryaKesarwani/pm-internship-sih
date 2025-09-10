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
        """

        prompt_part = ("Parse this resume line by line and extract relevant information in given format")

        generate_content_config = types.GenerateContentConfig(
            system_instruction=system_instruction_prompt,
            thinking_config = types.ThinkingConfig(
                thinking_budget=0,
            ),
            response_mime_type="application/json",
            response_schema = genai.types.Schema(
        type=genai.types.Type.OBJECT,
        properties={
            "phoneNumber": types.Schema(type=types.Type.STRING),
            "experience": genai.types.Schema(
                type=genai.types.Type.OBJECT,
                properties={
                    "internships": genai.types.Schema(
                        type=genai.types.Type.ARRAY,
                        items=genai.types.Schema(
                            type=genai.types.Type.OBJECT,
                            required=["title", "company", "duration", "description"],
                            properties={
                                "title": genai.types.Schema(type=genai.types.Type.STRING),
                                "company": genai.types.Schema(type=genai.types.Type.STRING),
                                "duration": genai.types.Schema(type=genai.types.Type.STRING),
                                "description": genai.types.Schema(type=genai.types.Type.STRING),
                            },
                        ),
                    )
                },
            ),
            "resume": genai.types.Schema(
                type=genai.types.Type.OBJECT,
                properties={
                    "skills": genai.types.Schema(
                            type = genai.types.Type.ARRAY,
                            items = genai.types.Schema(
                                type = genai.types.Type.STRING,
                            ),
                        ),
                    "projects": genai.types.Schema(
                        type=genai.types.Type.ARRAY,
                        items=genai.types.Schema(type=genai.types.Type.STRING),  # store project ObjectId as string
                    ),
                    "certifications": genai.types.Schema(
                        type=genai.types.Type.ARRAY,
                        items=genai.types.Schema(type=genai.types.Type.STRING),
                    ),
                    "socialLinks": genai.types.Schema(
                        type=genai.types.Type.ARRAY,
                        items=genai.types.Schema(type=genai.types.Type.STRING),
                    ),
                },
            ),
        },
    )
    )

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                prompt_part,
                types.Part.from_bytes(
                    data=file_path.read_bytes(),
                    mime_type="application/pdf",
                ),
            ],
            config=generate_content_config,
        )

        # Output the result
        return response.text


if __name__ == "__main__":
    reviewer = ResumeParser()
    resume_path = r"D:/College/otherwork/SohaResume1.pdf"
    # resume_path = r"C:\Users\Soha\Downloads\Berlin-Simple-Resume-Template.pdf"
    result = reviewer.review_resume(resume_path)
    print(result)



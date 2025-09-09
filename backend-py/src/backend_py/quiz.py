from google import genai
from dotenv import load_dotenv
import os, json
from google.genai import types

class AdaptiveQuiz:
    def __init__(self):
        load_dotenv()
        self.API_KEY = os.getenv("GOOGLE_API_KEY")
        self.client = genai.Client(api_key=self.API_KEY)
        self.samples=[]
        self.score=0.0

    def assignWeight(self, samples:list[dict])->list[dict]:
        prompt=f""" 
        You are a quiz evaluator.
        Determine what content and domain the sample questions are testing
        and accordingly use this informating in determining difficulty
        Given the following questions with their difficulty (easy/medium/hard),
        assign each a weight between 0.1 and 0.9:
        -easy 0.1-0.3
        -medium 0.4-0.7
        -hard 0.8-1.0
        Respond strictly in JSON array format:
        Questions:
        {json.dumps(samples, indent=2)}
        """

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(
                    type=types.Type.OBJECT,
                    required=["question", "answer", "difficulty", "weight"],
                    properties={
                        "question": types.Schema(type=types.Type.STRING),
                        "answer": types.Schema(type=types.Type.STRING),
                        "difficulty": types.Schema(type=types.Type.STRING),
                        "weight": types.Schema(type=types.Type.NUMBER),
                    },
                ),
            ),
            thinking_config=types.ThinkingConfig(thinking_budget=0)
        )

        response = self.client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=[prompt],
            config=config,
        )

        weighted = json.loads(response.text)
        self.samples = weighted
        return weighted

    def generateQuestion(self, difficulty:float)->dict:
        prompt=f""" 
        Based on the recruiter sample questions below determine what topics the sample quiz is testing on, generate ONE new multiple-choice question
        based on these topics 
        Difficulty must be: {difficulty}.
        Rules:
        -Provide exactly 4 options
        -One correct answer
        -Include the difficulty again
        -Assign a weight between:
         easy 0.1-0.3
         medium 0.4-0.7
         hard 0.8-1.0   

        Respond ONLY in JSON format:
        """

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=types.Schema(
                type=types.Type.OBJECT,
                required=["question", "options", "answer", "difficulty", "weight"],
                properties={
                    "question": types.Schema(type=types.Type.STRING),
                    "options": types.Schema(
                        type=types.Type.ARRAY,
                        items=types.Schema(type=types.Type.STRING),
                    ),
                    "answer": types.Schema(type=types.Type.STRING),
                    "difficulty": types.Schema(type=types.Type.STRING),
                    "weight": types.Schema(type=types.Type.NUMBER),
                },
            ),
            thinking_config=types.ThinkingConfig(thinking_budget=0)
        )

        response = self.client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=[prompt, json.dumps(self.samples[:5], indent=2)],
            config=config,
        )

        text = response.text.strip()
        if not text:
            print("Warning: API returned empty response")
            return None

        try:
            parsed = json.loads(text)
            # if API returns a list with 1 item, extract it
            if isinstance(parsed, list) and len(parsed) == 1:
                return parsed[0]
            return parsed
        except json.JSONDecodeError as e:
            print(f"Parsing error: {e}\nRaw: {text}")
            return None
        
    def runQuiz(self, num_questions:int):
        current_difficulty = 0.5

        for i in range(num_questions):
            q = self.generateQuestion(current_difficulty)
            if not q:
                print("Failed to fetch question...")
                continue
        for i in range(num_questions):
            q = self.generateQuestion(current_difficulty)
            if not q:
                print("Failed to fetch question...")
                continue
        
            print(f"\nQ{i+1}: {q['question']}")
            for opt in q["options"]:
                print(opt)
            print(q["answer"])

            user_ans = int(input("Your answer (1-4): "))
            if q["answer"] == q["options"][user_ans-1]:
                print("Correct! Difficulty ", current_difficulty)
                self.score += q["weight"]

                current_difficulty = current_difficulty + (1 - current_difficulty)/5
            else:
                print("Wrong! Difficulty ", current_difficulty)
                current_difficulty= current_difficulty - (current_difficulty-0)/5
        print(f"\nFinal Score : {self.score:.2f}/{num_questions}")
        print(f"\nEstimated Difficulty : {current_difficulty}")


if __name__ == "__main__":
    quiz = AdaptiveQuiz()
    samples = [
    {
        "question": "Which HTML tag is used to create a hyperlink?",
        "answer": "<a>",
        "difficulty": "easy"
    },
    {
        "question": "Which CSS property is used to change text color?",
        "answer": "color",
        "difficulty": "easy"
    },
    {
        "question": "Which HTTP method is typically idempotent?",
        "answer": "GET",
        "difficulty": "medium"
    },
    {
        "question": "In JavaScript, what does the 'this' keyword refer to inside a regular function?",
        "answer": "Depends on how the function is called",
        "difficulty": "medium"
    },
    {
        "question": "In React, which hook is used for managing state in a functional component?",
        "answer": "useState",
        "difficulty": "medium"
    },
    {
        "question": "What is the purpose of a Content Delivery Network (CDN)?",
        "answer": "Reduce latency by caching static assets closer to users",
        "difficulty": "medium"
    },
    {
        "question": "Which of the following best describes REST architecture?",
        "answer": "Stateless communication using HTTP methods",
        "difficulty": "hard"
    },
    {
        "question": "What is the main advantage of server-side rendering (SSR) in web apps?",
        "answer": "Better SEO and faster initial page load",
        "difficulty": "hard"
    },
    {
        "question": "In Docker, what does the 'COPY' instruction in a Dockerfile do?",
        "answer": "Copies files from host to container",
        "difficulty": "medium"
    },
    {
        "question": "Which database query language is commonly used for relational databases?",
        "answer": "SQL",
        "difficulty": "easy"
    }
]
    weighted_samples = quiz.assignWeight(samples)
    print("Weighted recruiter samples loaded")
    quiz.runQuiz(num_questions=10)





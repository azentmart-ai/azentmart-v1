import os
from dotenv import load_dotenv
from google import genai

load_dotenv()


class GeminiService:

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")

        if not self.api_key:
            raise ValueError(
                "GEMINI_API_KEY is not configured in the .env file"
            )

        self.client = genai.Client(
            api_key=self.api_key
        )

        self.model = "gemini-3.1-flash-live-preview"

    def get_client(self):
        return self.client

    def get_model(self):
        return self.model


gemini_service = GeminiService()
import os

from dotenv import load_dotenv

load_dotenv()


class Settings:

    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

    GROQ_MODEL = os.getenv(
        "GROQ_MODEL",
        "llama-3.3-70b-versatile"
    )

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://marketing:marketing@localhost:5432/marketing_ai"
    )

    EMBEDDING_MODEL = os.getenv(
        "EMBEDDING_MODEL",
        "sentence-transformers/all-MiniLM-L6-v2"
    )

    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        ""
    )


settings = Settings()
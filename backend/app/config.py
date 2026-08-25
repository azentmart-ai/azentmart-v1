from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str

    OPENAI_API_KEY: str | None = None
    GEMINI_API_KEY: str | None = None
    ANTHROPIC_API_KEY: str | None = None

    CORS_ORIGINS: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()
from functools import lru_cache
from pathlib import Path

from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)


class Settings(BaseSettings):

    # =========================================================
    # APPLICATION
    # =========================================================

    app_name: str = "AzentMart AI Voice Agent API"

    host: str = "0.0.0.0"

    port: int = 8000

    frontend_origins: str = (
        "http://localhost:3000,"
        "http://127.0.0.1:3000"
    )

    # =========================================================
    # DATABASE
    # =========================================================

    database_url: str = (
        "postgresql+psycopg://"
        "postgres:postgres"
        "@localhost:5433/"
        "azentmart_db"
    )

    # =========================================================
    # JWT
    # =========================================================

    jwt_secret_key: str = "CHANGE_ME_IN_ENV"

    jwt_algorithm: str = "HS256"

    access_token_expire_minutes: int = 1440

    # =========================================================
    # GEMINI
    # =========================================================

    gemini_api_key: str = ""

    gemini_live_model: str = (
        "gemini-3.1-flash-live-preview"
    )

    # =========================================================
    # SARVAM AI
    # =========================================================

    sarvam_api_key: str = ""

    sarvam_chat_model: str = "sarvam-105b"

    sarvam_stt_model: str = "saaras:v3"

    sarvam_tts_model: str = "bulbul:v3"

    sarvam_tts_speaker: str = "shubh"

    # =========================================================
    # BOLNA AI
    # =========================================================

    bolna_api_key: str = ""

    bolna_base_url: str = (
        "https://api.bolna.ai"
    )

      # Razorpay
    razorpay_key_id: str = ""
    razorpay_key_secret: str = ""

    # =========================================================
    # ENVIRONMENT CONFIGURATION
    # =========================================================

    model_config = SettingsConfigDict(

        env_file=(
            Path(__file__).resolve().parents[1]
            / ".env"
        ),

        env_file_encoding="utf-8",

        extra="ignore",
    )

    # =========================================================
    # CORS
    # =========================================================

    @property
    def cors_origins(self) -> list[str]:

        return [
            origin.strip()
            for origin in self.frontend_origins.split(",")
            if origin.strip()
        ]


# =========================================================
# SETTINGS INSTANCE
# =========================================================

@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
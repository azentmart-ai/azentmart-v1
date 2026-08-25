import base64
import httpx
from fastapi import HTTPException
from ..config import settings

BASE = "https://api.sarvam.ai"

LANGUAGE_CODES = {
    "English": "en-IN",
    "Tamil": "ta-IN",
    "Hindi": "hi-IN",
    "Telugu": "te-IN",
    "Malayalam": "ml-IN",
    "Kannada": "kn-IN",
    "Marathi": "mr-IN",
    "Bengali": "bn-IN",
    "Gujarati": "gu-IN",
    "Punjabi": "pa-IN",
    "Odia": "od-IN",
}

def _headers():
    if not settings.sarvam_api_key:
        raise HTTPException(status_code=503, detail="SARVAM_API_KEY is not configured in .env")
    return {"api-subscription-key": settings.sarvam_api_key}

async def chat(messages):
    headers = {**_headers(), "Content-Type": "application/json"}
    payload = {
        "model": settings.sarvam_chat_model,
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": 700,
        "reasoning_effort": None,
    }
    async with httpx.AsyncClient(timeout=45) as client:
        r = await client.post(f"{BASE}/v1/chat/completions", headers=headers, json=payload)
    if r.status_code >= 400:
        raise HTTPException(status_code=502, detail=f"Sarvam chat error: {r.text[:500]}")
    data = r.json()
    try:
        return data["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, TypeError):
        raise HTTPException(status_code=502, detail="Unexpected Sarvam chat response")

async def speech_to_text(audio_bytes: bytes, filename: str, content_type: str):
    headers = _headers()
    files = {"file": (filename or "audio.webm", audio_bytes, content_type or "audio/webm")}
    data = {"model": settings.sarvam_stt_model, "mode": "transcribe"}
    async with httpx.AsyncClient(timeout=40) as client:
        r = await client.post(f"{BASE}/speech-to-text", headers=headers, files=files, data=data)
    if r.status_code >= 400:
        raise HTTPException(status_code=502, detail=f"Sarvam STT error: {r.text[:500]}")
    result = r.json()
    return result.get("transcript", "").strip(), result.get("language_code")

async def text_to_speech(text: str, language: str):
    code = LANGUAGE_CODES.get(language, "en-IN")
    headers = {**_headers(), "Content-Type": "application/json"}
    payload = {
        "text": text[:2500],
        "target_language_code": code,
        "speaker": settings.sarvam_tts_speaker,
        "model": settings.sarvam_tts_model,
        "pace": 1.0,
        "temperature": 0.6,
    }
    async with httpx.AsyncClient(timeout=45) as client:
        r = await client.post(f"{BASE}/text-to-speech", headers=headers, json=payload)
    if r.status_code >= 400:
        raise HTTPException(status_code=502, detail=f"Sarvam TTS error: {r.text[:500]}")
    result = r.json()
    audios = result.get("audios") or []
    if not audios:
        raise HTTPException(status_code=502, detail="Sarvam TTS returned no audio")
    return audios[0], "audio/wav"

async def check():
    # Small chat request is a practical credential/connectivity check.
    return await chat([
        {"role": "system", "content": "Reply with exactly OK."},
        {"role": "user", "content": "Health check."},
    ])

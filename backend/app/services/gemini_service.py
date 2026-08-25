from google import genai

from app.config import settings


async def generate_gemini_answer(
    model: str,
    system_prompt: str,
    user_prompt: str
) -> str:

    if not settings.GEMINI_API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured"
        )

    client = genai.Client(
        api_key=settings.GEMINI_API_KEY
    )

    prompt = f"""
System instructions:

{system_prompt}

User question:

{user_prompt}
"""

    response = await client.aio.models.generate_content(
        model=model,
        contents=prompt
    )

    return response.text or ""
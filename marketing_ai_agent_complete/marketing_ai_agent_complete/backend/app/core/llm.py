from groq import Groq

from app.core.config import settings


_client = (
    Groq(
        api_key=settings.GROQ_API_KEY
    )
    if settings.GROQ_API_KEY
    else None
)


def chat(
    system: str,
    user: str,
    max_tokens: int = 350,
    temperature: float = 0.1,
) -> str:
    """
    Central Groq LLM helper.

    max_tokens:
        Controls maximum response length.

    temperature:
        Controls creativity/randomness.
        Lower values are better for structured business agents.
    """

    if not _client:
        return "GROQ_API_KEY is not configured. Add it to .env."

    response = _client.chat.completions.create(
        model=settings.GROQ_MODEL,
        temperature=temperature,
        max_tokens=max_tokens,
        messages=[
            {
                "role": "system",
                "content": system,
            },
            {
                "role": "user",
                "content": user,
            },
        ],
    )

    content = response.choices[0].message.content

    if not content:
        return ""

    return content.strip()
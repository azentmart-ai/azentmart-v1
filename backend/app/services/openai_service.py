from openai import AsyncOpenAI

from app.config import settings


async def generate_openai_answer(
    model: str,
    system_prompt: str,
    user_prompt: str
) -> str:

    if not settings.OPENAI_API_KEY:
        raise RuntimeError(
            "OPENAI_API_KEY is not configured"
        )

    client = AsyncOpenAI(
        api_key=settings.OPENAI_API_KEY
    )

    response = await client.responses.create(
        model=model,
        instructions=system_prompt,
        input=user_prompt
    )

    return response.output_text
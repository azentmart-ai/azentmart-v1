from anthropic import AsyncAnthropic

from app.config import settings


async def generate_claude_answer(
    model: str,
    system_prompt: str,
    user_prompt: str
) -> str:

    if not settings.ANTHROPIC_API_KEY:
        raise RuntimeError(
            "ANTHROPIC_API_KEY is not configured"
        )

    client = AsyncAnthropic(
        api_key=settings.ANTHROPIC_API_KEY
    )

    response = await client.messages.create(
        model=model,
        max_tokens=1000,
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content": user_prompt
            }
        ]
    )

    if not response.content:
        return ""

    return response.content[0].text
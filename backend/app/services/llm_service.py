from app.services.openai_service import (
    generate_openai_answer
)

from app.services.gemini_service import (
    generate_gemini_answer
)

from app.services.claude_service import (
    generate_claude_answer
)


MODEL_CONFIG = {

    # -------------------------------------------------
    # GEMINI
    # -------------------------------------------------

    "Gemini 3.1 Flash Lite": {
        "provider": "gemini",
        "model": "gemini-3.1-flash-lite"
    },

    "Gemini 3.5 Flash": {
        "provider": "gemini",
        "model": "gemini-3.5-flash"
    },

    # -------------------------------------------------
    # OPENAI
    # -------------------------------------------------

    "GPT-4.1": {
        "provider": "openai",
        "model": "gpt-4.1"
    },

    "GPT-4.1 Mini": {
        "provider": "openai",
        "model": "gpt-4.1-mini"
    },

    "GPT-5.5": {
        "provider": "openai",
        "model": "gpt-5.5"
    },

    "GPT-5.5 Mini": {
        "provider": "openai",
        "model": "gpt-5.5-mini"
    },

    # -------------------------------------------------
    # CLAUDE
    # -------------------------------------------------

    "Claude 4.5 Haiku": {
        "provider": "claude",
        "model": "claude-4.5-haiku"
    }
}


SYSTEM_PROMPT = """
You are Azentmart AI Interview Copilot.

You are helping a candidate during a live interview.

Your job is to:

1. Understand the interviewer's question.
2. Generate a technically correct answer.
3. Keep the answer concise and useful.
4. Use simple professional language.
5. Give examples when useful.
6. For coding questions, provide a clear explanation
   and code when necessary.
7. Do not mention that you are an AI unless necessary.

The answer should be suitable for the candidate
to speak during a real interview.
"""


async def generate_ai_answer(
    selected_model: str,
    question: str,
    company: str | None = None,
    job_description: str | None = None,
    language: str = "English"
) -> str:

    if not question.strip():
        return ""

    config = MODEL_CONFIG.get(selected_model)

    if not config:
        raise ValueError(
            f"Unsupported model: {selected_model}"
        )

    provider = config["provider"]

    actual_model = config["model"]

    context = f"""

Company:
{company or "Not provided"}

Job Description:
{job_description or "Not provided"}

Language:
{language}

Interview Question:
{question}
"""

    if provider == "openai":

        return await generate_openai_answer(
            model=actual_model,
            system_prompt=SYSTEM_PROMPT,
            user_prompt=context
        )

    if provider == "gemini":

        return await generate_gemini_answer(
            model=actual_model,
            system_prompt=SYSTEM_PROMPT,
            user_prompt=context
        )

    if provider == "claude":

        return await generate_claude_answer(
            model=actual_model,
            system_prompt=SYSTEM_PROMPT,
            user_prompt=context
        )

    raise ValueError(
        f"Unsupported provider: {provider}"
    )
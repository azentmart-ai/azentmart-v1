from app.core.llm import chat


class Agent:

    name = "base"

    max_tokens = 700

    system_prompt = """
You are a professional marketing AI agent.

Follow the current task exactly.
Use the provided business context only when relevant.
Do not change the product, target audience, or campaign objective.
"""

    def run(self, task, context=""):
        return chat(
            self.system_prompt,
            f"""
CURRENT MARKETING TASK:
{task}

BUSINESS CONTEXT:
{context}
""",
            max_tokens=self.max_tokens
        )
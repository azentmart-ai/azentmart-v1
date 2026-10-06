from app.core.llm import chat
from app.mcp.client import call_tool


class Agent:
    name = "base"
    max_tokens = 700

    system_prompt = """
You are a professional marketing AI agent.
Follow the current task exactly.
Use the provided business context only when relevant.
Do not change the product, target audience, or campaign objective.
"""

    def _extract_url(self, text):
        import re

        if not text:
            return None

        match = re.search(
            r"https?://[^\s<>\"]+",
            str(text),
            flags=re.IGNORECASE,
        )

        if not match:
            return None

        url = match.group(0).rstrip(".,);]}>")

        return url

    def _get_mcp_context(self, task, context=""):
        agent_name = (self.name or "").lower().strip()
        mcp_context = ""

        # ==========================================================
        # MARKET RESEARCH MCP WEB RESEARCH
        # ==========================================================
        if agent_name in ["market research", "market_research"]:

            # IMPORTANT:
            # Use the user's actual research task directly.
            # Do not prepend generic "marketing market research"
            # wording because it can cause irrelevant search results.
            research_query = task

            result = call_tool(
                "web_research",
                {
                    "query": research_query,
                    "max_results": 5,
                },
            )

            if result.get("success"):
                mcp_context += (
                    "\n\nMCP WEB RESEARCH RESULTS:\n"
                    + str(result)
                )
            else:
                mcp_context += (
                    "\n\nMCP WEB RESEARCH STATUS:\n"
                    "Web research was unavailable for this request.\n"
                    + str(result)
                )

        # ==========================================================
        # SEO WEBSITE FETCH
        # ==========================================================
        elif agent_name == "seo":

            url = self._extract_url(task)

            if not url:
                url = self._extract_url(context)

            if url:

                result = call_tool(
                    "fetch_website",
                    {
                        "url": url,
                        "max_chars": 7000,
                    },
                )

                if result.get("success"):
                    mcp_context += (
                        "\n\nMCP WEBSITE CONTENT:\n"
                        + str(result)
                    )
                else:
                    mcp_context += (
                        "\n\nMCP WEBSITE FETCH STATUS:\n"
                        "Website content could not be fetched.\n"
                        + str(result)
                    )

        return mcp_context

    def run(self, task, context=""):

        mcp_context = self._get_mcp_context(
            task,
            context,
        )

        final_context = context + mcp_context

        return chat(
            self.system_prompt,
            f"""
CURRENT MARKETING TASK:
{task}

BUSINESS CONTEXT:
{final_context}
""",
            max_tokens=self.max_tokens,
        )
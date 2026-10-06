import httpx

from app.core.config import settings


MCP_URL = "http://mcp-server:9000"


def list_tools():
    try:

        response = httpx.get(
            f"{MCP_URL}/tools",
            timeout=5,
        )

        response.raise_for_status()

        return response.json()

    except Exception:
        return []


def call_tool(
    name,
    arguments,
):
    try:

        response = httpx.post(
            f"{MCP_URL}/tools/{name}",
            json=arguments,
            timeout=15,
        )

        response.raise_for_status()

        return response.json()

    except Exception as exc:

        return {
            "tool": name,
            "success": False,
            "error": str(exc),
        }
import httpx
from app.core.config import settings
MCP_URL="http://mcp-server:9000"

def list_tools():
    try:
        return httpx.get(f"{MCP_URL}/tools", timeout=5).json()
    except Exception:
        return []

def call_tool(name, arguments):
    return httpx.post(f"{MCP_URL}/tools/{name}", json=arguments, timeout=10).json()

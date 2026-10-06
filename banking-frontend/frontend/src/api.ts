const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "/banking-api";

export async function sendToAgent(
  message: string,
  email: string,
  password: string
) {
  const response = await fetch(`${API_BASE}/ai-agent/intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Agent request failed");
  }

  return data;
}
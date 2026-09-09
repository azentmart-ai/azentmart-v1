import { INSTAGRAM_SYSTEM_PROMPT } from "@/lib/system-prompt";

export async function getAIResponse(
  messages: { role: "user" | "assistant"; content: string }[]
) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined in .env.local");
    }

    console.log("⚡ Generating AI response with Groq (openai/gpt-oss-120b)...");

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: INSTAGRAM_SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Groq API error (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    const responseText = data?.choices?.[0]?.message?.content?.trim();

    console.log("✅ Groq AI Output:", responseText);
    return responseText || "Hey! How can I help you today?";
  } catch (err: any) {
    console.error("❌ Groq AI Error:", err?.message || err);
    return "Hey! How can I help you today?";
  }
}
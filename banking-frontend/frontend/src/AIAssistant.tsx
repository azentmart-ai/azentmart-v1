import { useState } from "react";
import { sendToAgent } from "./api";

export default function AIAssistant() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const result = await sendToAgent(
        message,
        "admin@example.com",
        "123456"
      );

      setResponse(result);
    } catch (error) {
      setResponse({
        success: false,
        message: "Unable to connect to Banking AI Agent",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>🤖 Banking AI Assistant</h2>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask your banking assistant..."
      />

      <button onClick={handleSend} disabled={loading}>
        {loading ? "Processing..." : "Send"}
      </button>

      {response && (
        <pre>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
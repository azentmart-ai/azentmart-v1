import React from "react";

export default function IntegratedExternalAgentApp({ agent, title }) {
  const src = `/agent-apps/${agent}/index.html`;

  return (
    <div
      className="external-agent-shell"
      style={{ width: "100%", minHeight: "100vh", background: "#fff" }}
    >
      <iframe
        title={title}
        src={src}
        style={{
          display: "block",
          width: "100%",
          minHeight: "100vh",
          height: "100vh",
          border: 0,
        }}
        allow="clipboard-read; clipboard-write; microphone; camera"
      />
    </div>
  );
}

import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

function LegalAgentResearch() {
  const [question, setQuestion] = useState("");

  const suggestions = [
    "Anticipatory Bail",
    "Cheque Bounce (NI Act)",
    "Property Dispute",
    "Rent Control",
    "FIR Quashing",
    "Divorce Procedure",
    "POCSO Act",
    "Consumer Forum"
  ];

  return (
    <div className="legalResearch">

      <div className="legalResearchHeader">
        <h1>Welcome to Our Legal Agent</h1>
        <p>What would you like to research?</p>
      </div>

      <div className="legalPromptBox">

        <textarea
          placeholder="Write a message..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <div className="legalPromptFooter">

          <span className="legalCredits">
            AI may make mistakes. Verify legal advice.
          </span>

          <button className="sendBtn">
            <FaPaperPlane />
          </button>

        </div>

      </div>

      <div className="legalSuggestionContainer">

        {suggestions.map((item) => (
          <button
            key={item}
            className="legalSuggestionChip"
          >
            {item}
          </button>
        ))}

      </div>

    </div>
  );
}

export default LegalAgentResearch;
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaRobot,
  FaGlobe,
  FaMicrophone,
  FaComments,
  FaShieldAlt,
  FaBook,
  FaPaperPlane,
  FaPhoneAlt,
  FaPlay,
  FaCheckCircle,
} from "react-icons/fa";

import { ASSISTANTS } from "./Assistant";

import "./AssistantConfiguration.css";

function AssistantConfiguration() {
  const navigate = useNavigate();
  const { assistantId } = useParams();

  const isNew = assistantId === "new";

  const selectedAssistant =
    ASSISTANTS.find((assistant) => assistant.id === assistantId) ||
    ASSISTANTS[0];

  const [activeSection, setActiveSection] = useState("overview");

  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const [message, setMessage] = useState("");

  const [conversation, setConversation] = useState([
    {
      sender: "assistant",
      text: selectedAssistant.greeting,
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setConversation((prev) => [
      ...prev,
      {
        sender: "user",
        text: message,
      },
      {
        sender: "assistant",
        text: getAssistantReply(selectedAssistant, message, selectedLanguage),
      },
    ]);

    setMessage("");
  };

  const changeAssistant = (id) => {
    navigate(`/dashboard/assistant-configuration/${id}`);
  };

  const handleBack = () => {
    navigate("/dashboard/ai-assistant");
  };

  return (
    <div className="configuration-page">
      {/* TOP HEADER */}
      <div className="configuration-header">
        <div className="configuration-title-area">
          <button className="back-btn" onClick={handleBack}>
            <FaArrowLeft />
            Back
          </button>

          <div className="configuration-main-icon">
            <FaRobot />
          </div>

          <div>
            <span className="configuration-eyebrow">AI ASSISTANT</span>

            <h1>{isNew ? "Create AI Assistant" : selectedAssistant.name}</h1>

            {!isNew && (
              <p>
                {selectedAssistant.category} · {selectedAssistant.type}
              </p>
            )}
          </div>
        </div>

        <div className="voice-ready">
          <span></span>
          Voice AI Ready
        </div>
      </div>

      {/* BODY */}
      <div className="configuration-layout">
        {/* LEFT NAVIGATION */}
        <aside className="configuration-sidebar">
          <div className="setup-title">SETUP</div>

          <p className="setup-subtitle">Configure your AI assistant</p>

          <button
            className={
              activeSection === "overview" ? "config-nav active" : "config-nav"
            }
            onClick={() => setActiveSection("overview")}
          >
            <FaRobot />
            Overview
          </button>

          <button
            className={
              activeSection === "knowledge" ? "config-nav active" : "config-nav"
            }
            onClick={() => setActiveSection("knowledge")}
          >
            <FaBook />
            Knowledge
          </button>

          <button
            className={
              activeSection === "languages" ? "config-nav active" : "config-nav"
            }
            onClick={() => setActiveSection("languages")}
          >
            <FaGlobe />
            Languages
          </button>

          <button
            className={
              activeSection === "voice" ? "config-nav active" : "config-nav"
            }
            onClick={() => setActiveSection("voice")}
          >
            <FaMicrophone />
            Voice
          </button>

          <button
            className={
              activeSection === "behavior" ? "config-nav active" : "config-nav"
            }
            onClick={() => setActiveSection("behavior")}
          >
            <FaComments />
            Behavior
          </button>

          <button
            className={
              activeSection === "safety" ? "config-nav active" : "config-nav"
            }
            onClick={() => setActiveSection("safety")}
          >
            <FaShieldAlt />
            Safety
          </button>

          {/* CURRENT ASSISTANT */}
          <div className="current-assistant-box">
            <div className="current-assistant-icon">
              <FaRobot />
            </div>

            <h3>{selectedAssistant.name}</h3>

            <p>{selectedAssistant.description}</p>

            <div className="current-status">
              <FaCheckCircle />
              Voice enabled
            </div>
          </div>
        </aside>

        {/* CENTER CONTENT */}
        <main className="configuration-content">
          {activeSection === "overview" && (
            <Overview assistant={selectedAssistant} />
          )}

          {activeSection === "knowledge" && (
            <Knowledge assistant={selectedAssistant} />
          )}

          {activeSection === "languages" && (
            <Languages
              assistant={selectedAssistant}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
            />
          )}

          {activeSection === "voice" && (
            <VoiceSettings assistant={selectedAssistant} />
          )}

          {activeSection === "behavior" && (
            <Behavior assistant={selectedAssistant} />
          )}

          {activeSection === "safety" && <Safety />}
        </main>

        {/* RIGHT VOICE PANEL */}
        <aside className="voice-panel">
          <div className="voice-panel-header">
            <div>
              <strong>LIVE VOICE AI</strong>
              <small>Real-time assistant</small>
            </div>

            <span className="online-status">ONLINE</span>
          </div>

          <div className="voice-agent">
            <div className="voice-agent-icon">
              <FaRobot />
            </div>

            <h3>{selectedAssistant.name}</h3>

            <p>{selectedAssistant.category}</p>
          </div>

          {/* CHAT */}
          <div className="conversation-box">
            {conversation.map((item, index) => (
              <div
                key={index}
                className={
                  item.sender === "user"
                    ? "chat-message user"
                    : "chat-message assistant"
                }
              >
                {item.text}
              </div>
            ))}
          </div>

          {/* MIC */}
          <button className="voice-button">
            <FaMicrophone />
          </button>

          <div className="tap-text">Tap to speak</div>

          {/* INPUT */}
          <div className="chat-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask your assistant..."
            />

            <button onClick={sendMessage}>
              <FaPaperPlane />
            </button>
          </div>

          <button className="greeting-btn">
            <FaPlay />
            Play Greeting
          </button>

          <button className="call-test-btn">
            <FaPhoneAlt />
            Test Voice Call
          </button>
        </aside>
      </div>

      {/* FOOTER */}
      <div className="configuration-footer">
        <span>
          <FaCheckCircle />
          Configuration ready
        </span>

        <div>
          <button className="cancel-btn" onClick={handleBack}>
            Cancel
          </button>

          <button className="save-btn">
            <FaCheckCircle />
            Save & Activate
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   OVERVIEW
========================================================= */

function Overview({ assistant }) {
  return (
    <div>
      <div className="content-heading">
        <span>01</span>
        <h2>Assistant Overview</h2>
        <p>Configure the basic identity of your AI assistant.</p>
      </div>

      <div className="assistant-overview-card">
        <div className="overview-icon">
          <FaRobot />
        </div>

        <div>
          <label>ASSISTANT NAME</label>

          <h2>{assistant.name}</h2>

          <p>{assistant.description}</p>

          <div className="overview-tags">
            <span>{assistant.category}</span>

            <span>{assistant.type}</span>

            <span>Voice Enabled</span>
          </div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="info-card">
          <h3>Primary Purpose</h3>

          <p>{assistant.description}</p>
        </div>

        <div className="info-card">
          <h3>Conversation Mode</h3>

          <p>Voice + Text</p>
        </div>
      </div>

      <div className="topic-card">
        <h3>Assistant Capabilities</h3>

        <div className="capability-grid">
          {assistant.topics.map((topic) => (
            <div className="capability-item" key={topic}>
              <FaCheckCircle />
              {topic}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   KNOWLEDGE
========================================================= */

function Knowledge({ assistant }) {
  return (
    <div>
      <div className="content-heading">
        <span>02</span>
        <h2>Knowledge Base</h2>
        <p>Define the information this assistant should understand.</p>
      </div>

      <div className="knowledge-card">
        <h3>{assistant.name} Knowledge</h3>

        <p>This assistant can answer questions related to:</p>

        <div className="knowledge-list">
          {assistant.topics.map((topic) => (
            <div key={topic} className="knowledge-item">
              <FaCheckCircle />
              {topic}
            </div>
          ))}
        </div>

        <textarea placeholder="Add additional knowledge, FAQs or instructions..." />
      </div>
    </div>
  );
}

/* =========================================================
   LANGUAGES
========================================================= */

function Languages({ assistant, selectedLanguage, setSelectedLanguage }) {
  return (
    <div>
      <div className="content-heading">
        <span>03</span>
        <h2>Languages</h2>
        <p>Your assistant can communicate in multiple languages.</p>
      </div>

      <div className="language-config-card">
        <div className="language-config-header">
          <div>
            <h3>Supported Languages</h3>
            <p>Select the preferred language for testing.</p>
          </div>

          <FaGlobe />
        </div>

        <div className="configuration-language-grid">
          {assistant.languages.map((language) => (
            <button
              key={language}
              className={
                selectedLanguage === language
                  ? "language-select active"
                  : "language-select"
              }
              onClick={() => setSelectedLanguage(language)}
            >
              <FaGlobe />
              {language}

              {selectedLanguage === language && <FaCheckCircle />}
            </button>
          ))}
        </div>

        <div className="selected-language">
          Current test language:
          <strong>{selectedLanguage}</strong>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   VOICE
========================================================= */

function VoiceSettings({ assistant }) {
  return (
    <div>
      <div className="content-heading">
        <span>04</span>
        <h2>Voice Settings</h2>
        <p>Configure how {assistant.name} sounds.</p>
      </div>

      <div className="settings-grid">
        <div className="setting-card">
          <FaMicrophone />

          <h3>Voice Enabled</h3>

          <p>Allow users to communicate using voice.</p>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span></span>
          </label>
        </div>

        <div className="setting-card">
          <FaGlobe />

          <h3>Multi-language Voice</h3>

          <p>Automatically respond using the selected language.</p>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span></span>
          </label>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   BEHAVIOR
========================================================= */

function Behavior({ assistant }) {
  return (
    <div>
      <div className="content-heading">
        <span>05</span>
        <h2>Assistant Behavior</h2>
        <p>Define how the assistant should handle conversations.</p>
      </div>

      <div className="behavior-card">
        <label>Assistant Instructions</label>

        <textarea
          defaultValue={`You are ${assistant.name}, an AI voice assistant for AzentMart.

Your primary responsibility is to help users with ${assistant.description}

Always:
• Be polite and professional.
• Give clear answers.
• Ask questions when information is missing.
• Support multiple languages.
• Keep responses concise during voice conversations.
• Escalate complex issues when required.`}
        />
      </div>
    </div>
  );
}

/* =========================================================
   SAFETY
========================================================= */

function Safety() {
  return (
    <div>
      <div className="content-heading">
        <span>06</span>
        <h2>Safety</h2>
        <p>Configure safe conversation behavior.</p>
      </div>

      <div className="settings-grid">
        <div className="setting-card">
          <FaShieldAlt />

          <h3>Safe Responses</h3>

          <p>Prevent inappropriate or unsafe responses.</p>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span></span>
          </label>
        </div>

        <div className="setting-card">
          <FaComments />

          <h3>Human Escalation</h3>

          <p>Allow the assistant to transfer complex conversations.</p>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span></span>
          </label>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DEMO RESPONSE
========================================================= */

function getAssistantReply(assistant, message, language) {
  const lower = message.toLowerCase();

  if (assistant.id === "course-enquiry") {
    if (lower.includes("fee") || lower.includes("fees")) {
      return language === "Tamil"
        ? "கட்டணம் தொடர்பான தகவல்களை உங்களுக்கு வழங்க முடியும். எந்த பாடநெறியைப் பற்றி தெரிந்துகொள்ள விரும்புகிறீர்கள்?"
        : "I can help you with course fee details. Which course would you like to know about?";
    }

    return `I can help you with ${assistant.name.toLowerCase()} including courses, fees, eligibility and admission details.`;
  }

  if (assistant.id === "lead-qualification") {
    return "I can help understand your requirements, budget and purchase timeline so we can identify the right solution.";
  }

  if (assistant.id === "customer-support") {
    return "I can help with customer questions, complaints and service requests. Please tell me what issue you are facing.";
  }

  if (assistant.id === "billing-support") {
    return "I can help you with invoices, payments, refunds and billing-related questions.";
  }

  if (assistant.id === "technical-support") {
    return "I can help troubleshoot your technical issue. Please explain what problem you are experiencing.";
  }

  if (assistant.id === "admission-support") {
    return "I can help with admission procedures, eligibility, documents and important dates.";
  }

  return `I am ${assistant.name}. How can I help you today?`;
}

export default AssistantConfiguration;

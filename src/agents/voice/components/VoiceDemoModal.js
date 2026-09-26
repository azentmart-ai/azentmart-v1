import React, { useEffect, useRef, useState } from "react";
import "./VoiceDemoModal.css";

function VoiceDemoModal({ onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! Welcome to AzentMart AI. How can I help you today?",
    },
  ]);

  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      setTranscript(finalText || interimText);

      if (finalText.trim()) {
        handleUserMessage(finalText.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Your browser does not support voice recognition. Please use Chrome.",
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    setTranscript("");

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserMessage = async (text) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text,
      },
    ]);

    setTranscript("");
    setIsProcessing(true);

    try {
      /*
       * BACKEND CONNECTION
       *
       * Change this URL to your FastAPI endpoint.
       */

      const response = await fetch(
        "http://127.0.0.1:8000/api/voice-demo/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            language: "en",
            assistant: "course-enquiry",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      const aiReply =
        data.response ||
        data.message ||
        "Sorry, I couldn't process that request.";

      addAssistantMessage(aiReply);
    } catch (error) {
      console.error(error);

      /*
       * Temporary response while backend is being connected.
       */

      const fallback =
        "I heard you. The voice AI backend is currently being connected.";

      addAssistantMessage(fallback);
    } finally {
      setIsProcessing(false);
    }
  };

  const addAssistantMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text,
      },
    ]);

    speakText(text);
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);

      /*
       * Automatically listen again after AI finishes speaking.
       */

      setTimeout(() => {
        if (!isProcessing) {
          startListening();
        }
      }, 500);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const clearConversation = () => {
    window.speechSynthesis.cancel();

    setMessages([
      {
        role: "assistant",
        text: "Hello! Welcome to AzentMart AI. How can I help you today?",
      },
    ]);

    setTranscript("");
    setIsListening(false);
    setIsSpeaking(false);
  };

  return (
    <div className="voice-demo-overlay">
      <div className="voice-demo-modal">
        {/* HEADER */}

        <div className="voice-demo-header">
          <div className="voice-demo-brand">
            <div className="voice-demo-logo">A</div>

            <div>
              <div className="voice-demo-brand-name">AzentMart AI</div>

              <div className="voice-demo-status">
                <span className="status-dot"></span>
                Voice AI Online
              </div>
            </div>
          </div>

          <button className="voice-demo-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* TITLE */}

        <div className="voice-demo-title">
          <span>LIVE VOICE CONVERSATION</span>

          <h2>
            Talk with your
            <strong> AI Assistant</strong>
          </h2>

          <p>Speak naturally and let AzentMart AI handle the conversation.</p>
        </div>

        {/* CONVERSATION */}

        <div className="conversation-container">
          <div className="conversation-header">
            <div>
              <strong>AI Voice Assistant</strong>
              <span>Course Enquiry • Multilingual</span>
            </div>

            <button className="clear-btn" onClick={clearConversation}>
              Clear
            </button>
          </div>

          <div className="conversation-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`conversation-message ${
                  message.role === "user" ? "user-message" : "assistant-message"
                }`}
              >
                <div className="message-avatar">
                  {message.role === "user" ? "B" : "A"}
                </div>

                <div className="message-content">
                  <span className="message-name">
                    {message.role === "user" ? "You" : "AzentMart AI"}
                  </span>

                  <div className="message-bubble">{message.text}</div>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="conversation-message assistant-message">
                <div className="message-avatar">A</div>

                <div className="message-content">
                  <span className="message-name">AzentMart AI</span>

                  <div className="message-bubble typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* LIVE TRANSCRIPT */}

          {transcript && (
            <div className="live-transcript">
              <span>Listening...</span>
              <p>{transcript}</p>
            </div>
          )}
        </div>

        {/* VOICE CONTROL */}

        <div className="voice-control">
          <div className="voice-state">
            {isListening && (
              <>
                <div className="voice-waves">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>

                <span>Listening to you...</span>
              </>
            )}

            {isSpeaking && !isListening && (
              <>
                <div className="speaking-icon">🔊</div>

                <span>AI is speaking...</span>
              </>
            )}

            {!isListening && !isSpeaking && !isProcessing && (
              <>
                <div className="ready-icon">🎙</div>

                <span>Tap the microphone to speak</span>
              </>
            )}

            {isProcessing && <span>AI is thinking...</span>}
          </div>

          <button
            className={`microphone-button ${isListening ? "listening" : ""}`}
            onClick={startListening}
            disabled={isProcessing || isSpeaking}
          >
            <span>🎙</span>
          </button>

          <div className="voice-hint">
            {isListening
              ? "Speak now..."
              : "Press the microphone and start talking"}
          </div>
        </div>

        {/* FOOTER */}

        <div className="voice-demo-footer">
          <div className="language-info">
            <span>🌐</span>
            <strong>Multilingual AI</strong>
            <small>
              English • Tamil • Hindi • Telugu • Malayalam • Kannada
            </small>
          </div>

          <div className="secure-info">
            <span>●</span>
            Voice session active
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceDemoModal;

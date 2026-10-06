import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  FileText,
  IndianRupee,
  LayoutDashboard,
  MessageCircle,
  Paperclip,
  Send,
  Settings2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import avatar from "../assets/hr-assistant-avatar.svg";

import "./HRChatbot.css";

const PUBLIC_ANSWERS = {
  onboarding:
    "AI onboarding helps HR move new employees through documents, verification, access setup, orientation and training in one connected workflow.",

  payroll:
    "Payroll connects employee records with salary calculations, deductions, payslips, NEFT exports and payroll review.",

  attendance:
    "Attendance tracks check-in, check-out, working hours, overtime, late arrival and regularization.",

  leave:
    "Leave management supports requests, approvals, balances and leave history.",

  documents:
    "Documents gives HR a central place to manage employee documents, verification files and document-related workflows.",

  policies:
    "Policies gives employees and HR access to company policies, effective dates, versions and policy information.",

  benefits:
    "Benefits helps manage employee benefit information and gives HR a central view of available benefits.",

  reports:
    "Reports brings together HR operational information such as workforce, attendance, onboarding and payroll insights.",
};

const PUBLIC_SUGGESTIONS = [
  {
    label: "How does onboarding work?",
    icon: Sparkles,
    key: "onboarding",
  },
  {
    label: "How does payroll work?",
    icon: IndianRupee,
    key: "payroll",
  },
  {
    label: "What does attendance track?",
    icon: CalendarDays,
    key: "attendance",
  },
];

const PRIVATE_SUGGESTIONS = [
  {
    label: "Show pending onboarding",
    icon: Sparkles,
  },
  {
    label: "Give payroll summary",
    icon: IndianRupee,
  },
  {
    label: "Show company policies",
    icon: FileText,
  },
];

const QUICK_ACTIONS = [
  {
    title: "Employees",
    description: "View workforce",
    icon: Users,
    route: "/employees",
  },
  {
    title: "Payroll",
    description: "Review payroll",
    icon: IndianRupee,
    route: "/payroll",
  },
  {
    title: "Onboarding",
    description: "Manage joiners",
    icon: Sparkles,
    route: "/onboarding",
  },
  {
    title: "Documents",
    description: "Employee files",
    icon: FileText,
    route: "/documents",
  },
];

const ROUTE_MAP = {
  employee: "/employees",
  employees: "/employees",

  payroll: "/payroll",

  onboarding: "/onboarding",

  attendance: "/attendance",

  leave: "/leave",

  document: "/documents",
  documents: "/documents",

  policy: "/policies",
  policies: "/policies",

  benefit: "/benefits",
  benefits: "/benefits",

  report: "/reports",
  reports: "/reports",

  ticket: "/hr-support",
  tickets: "/hr-support",

  support: "/hr-support",

  dashboard: "/dashboard",

  settings: "/settings",
};

function findRoute(text) {
  const value = String(text || "").toLowerCase();

  const match = Object.keys(ROUTE_MAP).find((key) =>
    value.includes(key)
  );

  return match ? ROUTE_MAP[match] : null;
}

function formatAssistantText(text) {
  if (!text) return "No grounded answer was returned.";

  return String(text)
    .replace(/\s+/g, " ")
    .trim();
}

function getInitialMessage(publicMode) {
  if (publicMode) {
    return {
      role: "assistant",
      type: "welcome",
      content:
        "Hi! I'm your AzentMart AI HR Assistant. I can explain how our People Operations platform helps with onboarding, payroll, attendance, leave and more.",
    };
  }

  return {
    role: "assistant",
    type: "welcome",
    content:
      "Good morning 👋 I'm your AI HR Copilot. I can help you work with authorized HR information and navigate your People Operations workspace.",
  };
}

export default function HRChatbot({ publicMode = false }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const [messages, setMessages] = useState([
    getInitialMessage(publicMode),
  ]);

  const suggestions = useMemo(
    () =>
      publicMode
        ? PUBLIC_SUGGESTIONS
        : PRIVATE_SUGGESTIONS,
    [publicMode]
  );

  const addMessage = (newMessage) => {
    setMessages((current) => [...current, newMessage]);
  };

  const navigateFromResponse = (data, fallbackText = "") => {
    const navigation =
      data?.navigation ||
      data?.action?.navigation ||
      data?.action?.route ||
      null;

    if (typeof navigation === "string" && navigation.startsWith("/")) {
      navigate(navigation);
      return;
    }

    const detectedRoute = findRoute(fallbackText);

    if (detectedRoute) {
      navigate(detectedRoute);
    }
  };

  const send = async (text = message) => {
    const value = String(text || "").trim();

    if (!value || loading) return;

    setMessage("");
    setShowQuickActions(false);

    addMessage({
      role: "user",
      content: value,
    });

    setLoading(true);

    try {
      if (publicMode) {
        const lower = value.toLowerCase();

        const key = Object.keys(PUBLIC_ANSWERS).find((item) =>
          lower.includes(item)
        );

        const answer =
          PUBLIC_ANSWERS[key] ||
          "AzentMart People Operations brings employees, onboarding, attendance, leave, documents, policies, benefits, payroll, reports and AI HR support into one connected workspace. Sign in to access authorized company data.";

        addMessage({
          role: "assistant",
          content: answer,
          public: true,
        });
      } else {
        const response = await api.post("/ai-agent/chat", {
          message: value,
        });

        const data = response?.data || {};

        const answer =
          data?.answer ||
          data?.message ||
          "No grounded answer was returned.";

        addMessage({
          role: "assistant",
          content: formatAssistantText(answer),
          sources: data?.sources || [],
          navigation: data?.navigation || null,
          action: data?.action || null,
        });
      }
    } catch (error) {
      addMessage({
        role: "assistant",
        content:
          error?.response?.data?.detail ||
          "The AI assistant is temporarily unavailable. Please try again.",
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (item) => {
    send(item.label);
  };

  const handleQuickAction = (route) => {
    setOpen(false);
    navigate(route);
  };

  const handleResponseAction = (messageItem) => {
    if (
      messageItem?.navigation &&
      typeof messageItem.navigation === "string"
    ) {
      if (messageItem.navigation.startsWith("/")) {
        navigate(messageItem.navigation);
        return;
      }
    }

    const route = findRoute(messageItem?.content);

    if (route) {
      navigate(route);
    }
  };

  const clearChat = () => {
    setMessages([getInitialMessage(publicMode)]);
    setShowQuickActions(true);
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          className="hr-copilot-fab"
          onClick={() => setOpen(true)}
          aria-label="Open AzentMart AI HR Copilot"
        >
          <span className="hr-copilot-fab-glow" />

          <span className="hr-copilot-avatar">
            <img src={avatar} alt="AzentMart AI HR Assistant" />
          </span>

          <span className="hr-copilot-online" />

          <span className="hr-copilot-fab-label">
            <strong>Ask AI</strong>
            <small>HR Copilot</small>
          </span>
        </button>
      )}

      {open && (
        <section
          className="hr-copilot-window"
          aria-label="AzentMart AI HR Copilot"
        >
          {/* HEADER */}
          <header className="hr-copilot-header">
            <div className="hr-copilot-brand">
              <div className="hr-copilot-header-avatar">
                <img
                  src={avatar}
                  alt="AzentMart AI HR Assistant"
                />
                <span />
              </div>

              <div className="hr-copilot-brand-info">
                <div className="hr-copilot-title">
                  <Sparkles size={13} />
                  <strong>AzentMart AI</strong>
                </div>

                <div className="hr-copilot-status">
                  <span />
                  {publicMode
                    ? "Product assistant"
                    : "Connected to HR workspace"}
                </div>
              </div>
            </div>

            <div className="hr-copilot-header-actions">
              <button
                type="button"
                title="Clear conversation"
                onClick={clearChat}
              >
                <Settings2 size={15} />
              </button>

              <button
                type="button"
                title="Close"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {/* BODY */}
          <div className="hr-copilot-body">
            {/* Welcome area */}
            {messages.length === 1 &&
              messages[0]?.type === "welcome" && (
                <div className="hr-copilot-welcome">
                  <div className="hr-copilot-welcome-avatar">
                    <img
                      src={avatar}
                      alt="AI HR Assistant"
                    />
                  </div>

                  <div className="hr-copilot-welcome-content">
                    <span className="hr-copilot-eyebrow">
                      AI HR COPILOT
                    </span>

                    <h3>
                      {publicMode
                        ? "How can I help?"
                        : "Good morning 👋"}
                    </h3>

                    <p>
                      {publicMode
                        ? "Ask me anything about the AzentMart HR platform."
                        : "What would you like to take care of today?"}
                    </p>
                  </div>
                </div>
              )}

            {/* Quick actions */}
            {showQuickActions && !publicMode && (
              <div className="hr-copilot-quick-section">
                <div className="hr-copilot-section-heading">
                  <span>Quick access</span>
                  <small>HR workspace</small>
                </div>

                <div className="hr-copilot-quick-grid">
                  {QUICK_ACTIONS.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        type="button"
                        key={item.title}
                        className="hr-copilot-quick-card"
                        onClick={() =>
                          handleQuickAction(item.route)
                        }
                      >
                        <span className="hr-copilot-quick-icon">
                          <Icon size={16} />
                        </span>

                        <span className="hr-copilot-quick-text">
                          <strong>{item.title}</strong>
                          <small>{item.description}</small>
                        </span>

                        <ChevronRight size={14} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="hr-copilot-messages">
              {messages.map((item, index) => {
                const isAssistant = item.role === "assistant";

                return (
                  <div
                    key={`${index}-${item.role}`}
                    className={`hr-copilot-message-row ${
                      item.role
                    }`}
                  >
                    {isAssistant && (
                      <div className="hr-copilot-message-avatar">
                        <img
                          src={avatar}
                          alt="AI"
                        />
                      </div>
                    )}

                    <div
                      className={`hr-copilot-message ${
                        item.role
                      } ${
                        item.error ? "error" : ""
                      }`}
                    >
                      {isAssistant && (
                        <div className="hr-copilot-message-label">
                          <Sparkles size={11} />
                          AzentMart AI
                        </div>
                      )}

                      <div className="hr-copilot-message-text">
                        {item.content}
                      </div>

                      {item.sources?.length > 0 && (
                        <div className="hr-copilot-grounded">
                          <span className="hr-copilot-grounded-dot" />
                          Grounded in{" "}
                          {item.sources.length} authorized source
                          {item.sources.length === 1
                            ? ""
                            : "s"}
                        </div>
                      )}

                      {isAssistant &&
                        !item.error &&
                        !item.type &&
                        index > 0 && (
                          <button
                            type="button"
                            className="hr-copilot-response-action"
                            onClick={() =>
                              handleResponseAction(item)
                            }
                          >
                            <span>Open related HR area</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="hr-copilot-message-row assistant">
                  <div className="hr-copilot-message-avatar">
                    <img
                      src={avatar}
                      alt="AI"
                    />
                  </div>

                  <div className="hr-copilot-message assistant typing-message">
                    <div className="hr-copilot-message-label">
                      <Sparkles size={11} />
                      AzentMart AI
                    </div>

                    <div className="hr-copilot-typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SUGGESTIONS */}
          <div className="hr-copilot-suggestions">
            <div className="hr-copilot-section-heading compact">
              <span>
                <Sparkles size={11} />
                Suggested
              </span>
            </div>

            <div className="hr-copilot-suggestion-list">
              {suggestions.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => handleSuggestion(item)}
                    disabled={loading}
                  >
                    <Icon size={12} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PUBLIC SIGN IN */}
          {publicMode && (
            <div className="hr-copilot-signin">
              <div>
                <strong>Unlock your HR workspace</strong>
                <span>
                  Sign in to access authorized company data.
                </span>
              </div>

              <Link to="/login">
                Sign in
                <ArrowRight size={12} />
              </Link>
            </div>
          )}

          {/* INPUT */}
          <form
            className="hr-copilot-input-area"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <div className="hr-copilot-input">
              <button
                type="button"
                className="hr-copilot-attach"
                title="Attachments"
                disabled
              >
                <Paperclip size={16} />
              </button>

              <input
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder={
                  publicMode
                    ? "Ask about AzentMart HR..."
                    : "Ask your HR Copilot..."
                }
                disabled={loading}
              />

              <button
                type="submit"
                className="hr-copilot-send"
                disabled={loading || !message.trim()}
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>

            <div className="hr-copilot-input-footer">
              <span>
                <CircleHelp size={10} />
                AI responses use authorized information
              </span>

              <span className="hr-copilot-powered">
                Powered by AzentMart AI
              </span>
            </div>
          </form>
        </section>
      )}
    </>
  );
}
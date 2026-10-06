const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/components/HRChatbot.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useMemo, useState } from "react";
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

import api from "../services/api.js";
const avatar = "/agent-apps/hr/assets/hr-assistant-avatar.svg";
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
      _optionalChain([data, 'optionalAccess', _ => _.navigation]) ||
      _optionalChain([data, 'optionalAccess', _2 => _2.action, 'optionalAccess', _3 => _3.navigation]) ||
      _optionalChain([data, 'optionalAccess', _4 => _4.action, 'optionalAccess', _5 => _5.route]) ||
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

        const data = _optionalChain([response, 'optionalAccess', _6 => _6.data]) || {};

        const answer =
          _optionalChain([data, 'optionalAccess', _7 => _7.answer]) ||
          _optionalChain([data, 'optionalAccess', _8 => _8.message]) ||
          "No grounded answer was returned.";

        addMessage({
          role: "assistant",
          content: formatAssistantText(answer),
          sources: _optionalChain([data, 'optionalAccess', _9 => _9.sources]) || [],
          navigation: _optionalChain([data, 'optionalAccess', _10 => _10.navigation]) || null,
          action: _optionalChain([data, 'optionalAccess', _11 => _11.action]) || null,
        });
      }
    } catch (error) {
      addMessage({
        role: "assistant",
        content:
          _optionalChain([error, 'optionalAccess', _12 => _12.response, 'optionalAccess', _13 => _13.data, 'optionalAccess', _14 => _14.detail]) ||
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
      _optionalChain([messageItem, 'optionalAccess', _15 => _15.navigation]) &&
      typeof messageItem.navigation === "string"
    ) {
      if (messageItem.navigation.startsWith("/")) {
        navigate(messageItem.navigation);
        return;
      }
    }

    const route = findRoute(_optionalChain([messageItem, 'optionalAccess', _16 => _16.content]));

    if (route) {
      navigate(route);
    }
  };

  const clearChat = () => {
    setMessages([getInitialMessage(publicMode)]);
    setShowQuickActions(true);
  };

  return (
    React.createElement(React.Fragment, null
      , !open && (
        React.createElement('button', {
          type: "button",
          className: "hr-copilot-fab",
          onClick: () => setOpen(true),
          'aria-label': "Open AzentMart AI HR Copilot"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 323}}

          , React.createElement('span', { className: "hr-copilot-fab-glow", __self: this, __source: {fileName: _jsxFileName, lineNumber: 329}} )

          , React.createElement('span', { className: "hr-copilot-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 331}}
            , React.createElement('img', { src: avatar, alt: "AzentMart AI HR Assistant"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 332}} )
          )

          , React.createElement('span', { className: "hr-copilot-online", __self: this, __source: {fileName: _jsxFileName, lineNumber: 335}} )

          , React.createElement('span', { className: "hr-copilot-fab-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}}
            , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 338}}, "Ask AI" )
            , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 339}}, "HR Copilot" )
          )
        )
      )

      , open && (
        React.createElement('section', {
          className: "hr-copilot-window",
          'aria-label': "AzentMart AI HR Copilot"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 345}}

          /* HEADER */
          , React.createElement('header', { className: "hr-copilot-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 350}}
            , React.createElement('div', { className: "hr-copilot-brand", __self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}
              , React.createElement('div', { className: "hr-copilot-header-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}
                , React.createElement('img', {
                  src: avatar,
                  alt: "AzentMart AI HR Assistant"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}
                )
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 357}} )
              )

              , React.createElement('div', { className: "hr-copilot-brand-info", __self: this, __source: {fileName: _jsxFileName, lineNumber: 360}}
                , React.createElement('div', { className: "hr-copilot-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 361}}
                  , React.createElement(Sparkles, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 362}} )
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 363}}, "AzentMart AI" )
                )

                , React.createElement('div', { className: "hr-copilot-status", __self: this, __source: {fileName: _jsxFileName, lineNumber: 366}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 367}} )
                  , publicMode
                    ? "Product assistant"
                    : "Connected to HR workspace"
                )
              )
            )

            , React.createElement('div', { className: "hr-copilot-header-actions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 375}}
              , React.createElement('button', {
                type: "button",
                title: "Clear conversation" ,
                onClick: clearChat, __self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}

                , React.createElement(Settings2, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 381}} )
              )

              , React.createElement('button', {
                type: "button",
                title: "Close",
                onClick: () => setOpen(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 384}}

                , React.createElement(X, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 389}} )
              )
            )
          )

          /* BODY */
          , React.createElement('div', { className: "hr-copilot-body", __self: this, __source: {fileName: _jsxFileName, lineNumber: 395}}
            /* Welcome area */
            , messages.length === 1 &&
              _optionalChain([messages, 'access', _17 => _17[0], 'optionalAccess', _18 => _18.type]) === "welcome" && (
                React.createElement('div', { className: "hr-copilot-welcome", __self: this, __source: {fileName: _jsxFileName, lineNumber: 399}}
                  , React.createElement('div', { className: "hr-copilot-welcome-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}}
                    , React.createElement('img', {
                      src: avatar,
                      alt: "AI HR Assistant"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 401}}
                    )
                  )

                  , React.createElement('div', { className: "hr-copilot-welcome-content", __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}}
                    , React.createElement('span', { className: "hr-copilot-eyebrow", __self: this, __source: {fileName: _jsxFileName, lineNumber: 408}}, "AI HR COPILOT"

                    )

                    , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 412}}
                      , publicMode
                        ? "How can I help?"
                        : "Good morning 👋"
                    )

                    , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}
                      , publicMode
                        ? "Ask me anything about the AzentMart HR platform."
                        : "What would you like to take care of today?"
                    )
                  )
                )
              )

            /* Quick actions */
            , showQuickActions && !publicMode && (
              React.createElement('div', { className: "hr-copilot-quick-section", __self: this, __source: {fileName: _jsxFileName, lineNumber: 429}}
                , React.createElement('div', { className: "hr-copilot-section-heading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 430}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 431}}, "Quick access" )
                  , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 432}}, "HR workspace" )
                )

                , React.createElement('div', { className: "hr-copilot-quick-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 435}}
                  , QUICK_ACTIONS.map((item) => {
                    const Icon = item.icon;

                    return (
                      React.createElement('button', {
                        type: "button",
                        key: item.title,
                        className: "hr-copilot-quick-card",
                        onClick: () =>
                          handleQuickAction(item.route)
                        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 440}}

                        , React.createElement('span', { className: "hr-copilot-quick-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 448}}
                          , React.createElement(Icon, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 449}} )
                        )

                        , React.createElement('span', { className: "hr-copilot-quick-text", __self: this, __source: {fileName: _jsxFileName, lineNumber: 452}}
                          , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 453}}, item.title)
                          , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 454}}, item.description)
                        )

                        , React.createElement(ChevronRight, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 457}} )
                      )
                    );
                  })
                )
              )
            )

            /* Messages */
            , React.createElement('div', { className: "hr-copilot-messages", __self: this, __source: {fileName: _jsxFileName, lineNumber: 466}}
              , messages.map((item, index) => {
                const isAssistant = item.role === "assistant";

                return (
                  React.createElement('div', {
                    key: `${index}-${item.role}`,
                    className: `hr-copilot-message-row ${
                      item.role
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 471}}

                    , isAssistant && (
                      React.createElement('div', { className: "hr-copilot-message-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 478}}
                        , React.createElement('img', {
                          src: avatar,
                          alt: "AI", __self: this, __source: {fileName: _jsxFileName, lineNumber: 479}}
                        )
                      )
                    )

                    , React.createElement('div', {
                      className: `hr-copilot-message ${
                        item.role
                      } ${
                        item.error ? "error" : ""
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 486}}

                      , isAssistant && (
                        React.createElement('div', { className: "hr-copilot-message-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 494}}
                          , React.createElement(Sparkles, { size: 11, __self: this, __source: {fileName: _jsxFileName, lineNumber: 495}} ), "AzentMart AI"

                        )
                      )

                      , React.createElement('div', { className: "hr-copilot-message-text", __self: this, __source: {fileName: _jsxFileName, lineNumber: 500}}
                        , item.content
                      )

                      , _optionalChain([item, 'access', _19 => _19.sources, 'optionalAccess', _20 => _20.length]) > 0 && (
                        React.createElement('div', { className: "hr-copilot-grounded", __self: this, __source: {fileName: _jsxFileName, lineNumber: 505}}
                          , React.createElement('span', { className: "hr-copilot-grounded-dot", __self: this, __source: {fileName: _jsxFileName, lineNumber: 506}} ), "Grounded in"
                           , " "
                          , item.sources.length, " authorized source"
                          , item.sources.length === 1
                            ? ""
                            : "s"
                        )
                      )

                      , isAssistant &&
                        !item.error &&
                        !item.type &&
                        index > 0 && (
                          React.createElement('button', {
                            type: "button",
                            className: "hr-copilot-response-action",
                            onClick: () =>
                              handleResponseAction(item)
                            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 519}}

                            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 526}}, "Open related HR area"   )
                            , React.createElement(ArrowRight, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 527}} )
                          )
                        )
                    )
                  )
                );
              })

              , loading && (
                React.createElement('div', { className: "hr-copilot-message-row assistant" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 536}}
                  , React.createElement('div', { className: "hr-copilot-message-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 537}}
                    , React.createElement('img', {
                      src: avatar,
                      alt: "AI", __self: this, __source: {fileName: _jsxFileName, lineNumber: 538}}
                    )
                  )

                  , React.createElement('div', { className: "hr-copilot-message assistant typing-message"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 544}}
                    , React.createElement('div', { className: "hr-copilot-message-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 545}}
                      , React.createElement(Sparkles, { size: 11, __self: this, __source: {fileName: _jsxFileName, lineNumber: 546}} ), "AzentMart AI"

                    )

                    , React.createElement('div', { className: "hr-copilot-typing", __self: this, __source: {fileName: _jsxFileName, lineNumber: 550}}
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 551}} )
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 552}} )
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 553}} )
                    )
                  )
                )
              )
            )
          )

          /* SUGGESTIONS */
          , React.createElement('div', { className: "hr-copilot-suggestions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 562}}
            , React.createElement('div', { className: "hr-copilot-section-heading compact" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 563}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 564}}
                , React.createElement(Sparkles, { size: 11, __self: this, __source: {fileName: _jsxFileName, lineNumber: 565}} ), "Suggested"

              )
            )

            , React.createElement('div', { className: "hr-copilot-suggestion-list", __self: this, __source: {fileName: _jsxFileName, lineNumber: 570}}
              , suggestions.map((item) => {
                const Icon = item.icon;

                return (
                  React.createElement('button', {
                    type: "button",
                    key: item.label,
                    onClick: () => handleSuggestion(item),
                    disabled: loading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 575}}

                    , React.createElement(Icon, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 581}} )
                    , item.label
                  )
                );
              })
            )
          )

          /* PUBLIC SIGN IN */
          , publicMode && (
            React.createElement('div', { className: "hr-copilot-signin", __self: this, __source: {fileName: _jsxFileName, lineNumber: 591}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 592}}
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 593}}, "Unlock your HR workspace"   )
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 594}}, "Sign in to access authorized company data."

                )
              )

              , React.createElement(Link, { to: "/login", __self: this, __source: {fileName: _jsxFileName, lineNumber: 599}}, "Sign in"

                , React.createElement(ArrowRight, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 601}} )
              )
            )
          )

          /* INPUT */
          , React.createElement('form', {
            className: "hr-copilot-input-area",
            onSubmit: (event) => {
              event.preventDefault();
              send();
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 607}}

            , React.createElement('div', { className: "hr-copilot-input", __self: this, __source: {fileName: _jsxFileName, lineNumber: 614}}
              , React.createElement('button', {
                type: "button",
                className: "hr-copilot-attach",
                title: "Attachments",
                disabled: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 615}}

                , React.createElement(Paperclip, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 621}} )
              )

              , React.createElement('input', {
                value: message,
                onChange: (event) =>
                  setMessage(event.target.value)
                ,
                placeholder: 
                  publicMode
                    ? "Ask about AzentMart HR..."
                    : "Ask your HR Copilot..."
                ,
                disabled: loading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 624}}
              )

              , React.createElement('button', {
                type: "submit",
                className: "hr-copilot-send",
                disabled: loading || !message.trim(),
                'aria-label': "Send message" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 637}}

                , React.createElement(Send, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 643}} )
              )
            )

            , React.createElement('div', { className: "hr-copilot-input-footer", __self: this, __source: {fileName: _jsxFileName, lineNumber: 647}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 648}}
                , React.createElement(CircleHelp, { size: 10, __self: this, __source: {fileName: _jsxFileName, lineNumber: 649}} ), "AI responses use authorized information"

              )

              , React.createElement('span', { className: "hr-copilot-powered", __self: this, __source: {fileName: _jsxFileName, lineNumber: 653}}, "Powered by AzentMart AI"

              )
            )
          )
        )
      )
    )
  );
}
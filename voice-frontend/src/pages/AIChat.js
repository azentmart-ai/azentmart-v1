import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FaPlus,
  FaSearch,
  FaPhoneAlt,
  FaBullhorn,
  FaUsers,
  FaBook,
  FaChartBar,
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaBars,
  FaTrash,
} from "react-icons/fa";

import "./AIChat.css";


/* =========================================================
   MARKDOWN HELPERS
   ========================================================= */

const normalizeMarkdown = (text) => {
  if (!text) return "";

  let value = String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  /*
   * Some AI responses arrive like:
   *
   * **Core Concepts:** - **Learning:** ...
   *
   * Convert those inline bullets into real lines.
   */
  value = value.replace(
    /\s+-\s+(?=\*\*|`|[A-Za-z])/g,
    "\n- "
  );

  value = value.replace(
    /\s+\*\s+(?=\*\*|`|[A-Za-z])/g,
    "\n* "
  );

  /*
   * Convert numbered items into separate lines.
   */
  value = value.replace(
    /\s+(\d+)\.\s+(?=\*\*|`|[A-Za-z])/g,
    "\n$1. "
  );

  return value;
};


/* =========================================================
   INLINE MARKDOWN
   ========================================================= */

const renderInlineMarkdown = (
  text,
  keyPrefix = "inline"
) => {
  if (!text) return null;

  const parts = [];
  let remaining = String(text);
  let index = 0;

  const patterns = [
    {
      regex: /`([^`]+)`/,
      type: "code",
    },
    {
      regex: /\*\*([^*]+)\*\*/,
      type: "bold",
    },
    {
      regex: /__([^_]+)__/,
      type: "bold",
    },
    {
      regex: /\*([^*]+)\*/,
      type: "italic",
    },
    {
      regex: /_([^_]+)_/,
      type: "italic",
    },
    {
      regex: /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/,
      type: "link",
    },
  ];

  while (remaining.length > 0) {
    let earliest = null;

    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);

      if (!match) continue;

      const position = match.index ?? 0;

      if (
        earliest === null ||
        position < earliest.position
      ) {
        earliest = {
          ...pattern,
          match,
          position,
        };
      }
    }

    if (!earliest) {
      parts.push(
        <React.Fragment key={`${keyPrefix}-${index}`}>
          {remaining}
        </React.Fragment>
      );
      break;
    }

    if (earliest.position > 0) {
      parts.push(
        <React.Fragment key={`${keyPrefix}-${index}`}>
          {remaining.slice(0, earliest.position)}
        </React.Fragment>
      );

      index++;
    }

    const match = earliest.match;

    if (earliest.type === "code") {
      parts.push(
        <code
          key={`${keyPrefix}-code-${index}`}
          className="inline-code"
        >
          {match[1]}
        </code>
      );
    }

    if (earliest.type === "bold") {
      parts.push(
        <strong
          key={`${keyPrefix}-bold-${index}`}
        >
          {match[1]}
        </strong>
      );
    }

    if (earliest.type === "italic") {
      parts.push(
        <em
          key={`${keyPrefix}-italic-${index}`}
        >
          {match[1]}
        </em>
      );
    }

    if (earliest.type === "link") {
      parts.push(
        <a
          key={`${keyPrefix}-link-${index}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[1]}
        </a>
      );
    }

    remaining = remaining.slice(
      earliest.position + match[0].length
    );

    index++;
  }

  return parts;
};


/* =========================================================
   MARKDOWN RENDERER
   ========================================================= */

const renderMarkdown = (text) => {
  if (!text) return null;

  const normalized = normalizeMarkdown(text);

  const lines = normalized.split("\n");

  const elements = [];

  let paragraph = [];
  let listItems = [];
  let listType = null;

  let codeLines = [];
  let insideCode = false;
  let codeLanguage = "";

  const flushParagraph = () => {
    if (!paragraph.length) return;

    const content = paragraph.join("\n");

    elements.push(
      <p key={`p-${elements.length}`}>
        {renderInlineMarkdown(
          content,
          `p-${elements.length}`
        )}
      </p>
    );

    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) return;

    const Tag =
      listType === "ordered"
        ? "ol"
        : "ul";

    elements.push(
      <Tag
        key={`list-${elements.length}`}
      >
        {listItems.map(
          (item, index) => (
            <li
              key={`li-${index}`}
            >
              {renderInlineMarkdown(
                item,
                `li-${elements.length}-${index}`
              )}
            </li>
          )
        )}
      </Tag>
    );

    listItems = [];
    listType = null;
  };

  const flushCode = () => {
    if (!codeLines.length) return;

    elements.push(
      <pre
        key={`code-${elements.length}`}
        className="code-block"
      >
        <code>
          {codeLines.join("\n")}
        </code>
      </pre>
    );

    codeLines = [];
    codeLanguage = "";
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    /* -----------------------------------------
       CODE FENCE
       ----------------------------------------- */

    if (
      trimmed.startsWith("```")
    ) {
      if (insideCode) {
        insideCode = false;
        flushCode();
      } else {
        flushParagraph();
        flushList();

        insideCode = true;
        codeLanguage =
          trimmed
            .replace(/^```/, "")
            .trim();
      }

      return;
    }

    if (insideCode) {
      codeLines.push(line);
      return;
    }


    /* -----------------------------------------
       EMPTY LINE
       ----------------------------------------- */

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }


    /* -----------------------------------------
       HEADINGS
       ----------------------------------------- */

    const headingMatch =
      trimmed.match(
        /^(#{1,6})\s+(.+)$/
      );

    if (headingMatch) {
      flushParagraph();
      flushList();

      const level =
        headingMatch[1].length;

      const Heading =
        `h${Math.min(level, 4)}`;

      elements.push(
        React.createElement(
          Heading,
          {
            key:
              `heading-${elements.length}`,
          },
          renderInlineMarkdown(
            headingMatch[2],
            `heading-${elements.length}`
          )
        )
      );

      return;
    }


    /* -----------------------------------------
       BULLET LIST
       ----------------------------------------- */

    const bulletMatch =
      trimmed.match(
        /^[-*•]\s+(.+)$/
      );

    if (bulletMatch) {
      flushParagraph();

      if (
        listType &&
        listType !== "unordered"
      ) {
        flushList();
      }

      listType = "unordered";

      listItems.push(
        bulletMatch[1]
      );

      return;
    }


    /* -----------------------------------------
       NUMBERED LIST
       ----------------------------------------- */

    const orderedMatch =
      trimmed.match(
        /^\d+[.)]\s+(.+)$/
      );

    if (orderedMatch) {
      flushParagraph();

      if (
        listType &&
        listType !== "ordered"
      ) {
        flushList();
      }

      listType = "ordered";

      listItems.push(
        orderedMatch[1]
      );

      return;
    }


    /* -----------------------------------------
       NORMAL TEXT
       ----------------------------------------- */

    flushList();

    paragraph.push(trimmed);
  });


  if (insideCode) {
    flushCode();
  }

  flushParagraph();
  flushList();

  return elements;
};


/* =========================================================
   MAIN COMPONENT
   ========================================================= */

function AIChat() {

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [chatHistory, setChatHistory] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(false);

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [assistantId, setAssistantId] =
    useState(null);

  const [assistantName, setAssistantName] =
    useState("AzentMart AI Assistant");

  const [assistantLoading, setAssistantLoading] =
    useState(true);

  const [assistantError, setAssistantError] =
    useState("");

  const messagesEndRef =
    useRef(null);

  const inputRef =
    useRef(null);


  /* =========================================================
     API
     ========================================================= */

  const API_BASE_URL =
    "http://127.0.0.1:8000";


  /* =========================================================
     SUGGESTIONS
     ========================================================= */

  const suggestions = [
    {
      icon: <FaPhoneAlt />,
      text:
        "How many calls were made today?",
    },
    {
      icon: <FaBullhorn />,
      text:
        "Show my active campaigns",
    },
    {
      icon: <FaUsers />,
      text:
        "What's the team performance this week?",
    },
    {
      icon: <FaBook />,
      text:
        "List all knowledge bases",
    },
    {
      icon: <FaChartBar />,
      text:
        "Show contact statistics",
    },
    {
      icon: <FaRobot />,
      text:
        "Which assistant has the most calls?",
    },
  ];


  /* =========================================================
     SCROLL
     ========================================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);


  /* =========================================================
     FOCUS
     ========================================================= */

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  /* =========================================================
     AUTH TOKEN
     ========================================================= */

  const getAuthToken = () => {

    const keys = [
      "token",
      "access_token",
      "accessToken",
      "auth_token",
      "jwt",
    ];

    for (const key of keys) {
      const value =
        localStorage.getItem(key);

      if (value) {
        return value;
      }
    }

    return null;
  };


  /* =========================================================
     NORMALIZE ASSISTANTS
     ========================================================= */

  const normalizeAssistantList =
    (data) => {

      if (Array.isArray(data)) {
        return data;
      }

      if (
        Array.isArray(
          data?.assistants
        )
      ) {
        return data.assistants;
      }

      if (
        Array.isArray(data?.data)
      ) {
        return data.data;
      }

      if (
        Array.isArray(data?.items)
      ) {
        return data.items;
      }

      return [];
    };


  /* =========================================================
     GET STORED ASSISTANT
     ========================================================= */

  const getStoredAssistantId = () => {

    const keys = [
      "assistant_id",
      "assistantId",
      "selected_assistant_id",
      "selectedAssistantId",
      "current_assistant_id",
      "currentAssistantId",
    ];

    for (const key of keys) {

      const value =
        localStorage.getItem(key);

      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        return String(value).trim();
      }
    }

    return null;
  };


  /* =========================================================
     SAVE ASSISTANT
     ========================================================= */

  const saveAssistantId = (id) => {

    if (
      id === null ||
      id === undefined ||
      String(id).trim() === ""
    ) {
      return;
    }

    const value =
      String(id);

    localStorage.setItem(
      "assistant_id",
      value
    );

    localStorage.setItem(
      "selected_assistant_id",
      value
    );

    localStorage.setItem(
      "current_assistant_id",
      value
    );

    setAssistantId(value);
  };


  /* =========================================================
     CLEAR ASSISTANT
     ========================================================= */

  const clearStoredAssistant = () => {

    [
      "assistant_id",
      "assistantId",
      "selected_assistant_id",
      "selectedAssistantId",
      "current_assistant_id",
      "currentAssistantId",
      "assistant_name",
    ].forEach((key) => {
      localStorage.removeItem(key);
    });

    setAssistantId(null);
  };


  /* =========================================================
     LOAD ASSISTANT
     ========================================================= */

  const loadAssistant = async () => {

    setAssistantLoading(true);
    setAssistantError("");

    try {

      const token =
        getAuthToken();

      const headers = {};

      if (token) {
        headers.Authorization =
          `Bearer ${token}`;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/assistants/`,
          {
            method: "GET",
            headers,
          }
        );

      const responseText =
        await response.text();

      let data = null;

      try {
        data =
          responseText
            ? JSON.parse(responseText)
            : null;
      } catch {
        throw new Error(
          "Invalid response received while loading assistants."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
          data?.message ||
          "Unable to load assistants."
        );
      }

      const assistants =
        normalizeAssistantList(data);

      const activeAssistant =
        assistants.find(
          (item) =>
            item?.active !== false &&
            item?.is_active !== false
        ) ||
        assistants[0];

      if (!activeAssistant) {

        clearStoredAssistant();

        throw new Error(
          "No AI Assistant is available for this account."
        );
      }

      const realId =
        activeAssistant.id ??
        activeAssistant.assistant_id;

      if (
        realId === null ||
        realId === undefined ||
        String(realId).trim() === ""
      ) {

        clearStoredAssistant();

        throw new Error(
          "Assistant was returned by the backend, but it has no database ID."
        );
      }

      saveAssistantId(realId);

      if (activeAssistant.name) {

        setAssistantName(
          activeAssistant.name
        );

        localStorage.setItem(
          "assistant_name",
          activeAssistant.name
        );
      }

      setAssistantError("");

      return String(realId);

    } catch (error) {

      console.error(
        "[AI CHAT] Assistant loading error:",
        error
      );

      setAssistantError(
        error?.message ||
        "Unable to load AI Assistant."
      );

      return null;

    } finally {

      setAssistantLoading(false);
    }
  };


  /* =========================================================
     INITIAL LOAD
     ========================================================= */

  useEffect(() => {

    loadAssistant();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /* =========================================================
     SESSION
     ========================================================= */

  const getSessionId = () => {

    const currentAssistant =
      assistantId ||
      getStoredAssistantId() ||
      "default";

    const storageKey =
      `ai_chat_session_id_${currentAssistant}`;

    let sessionId =
      sessionStorage.getItem(
        storageKey
      );

    if (!sessionId) {

      sessionId =
        "chat_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .substring(2, 10);

      sessionStorage.setItem(
        storageKey,
        sessionId
      );
    }

    return sessionId;
  };


  /* =========================================================
     LANGUAGE
     ========================================================= */

  const getLanguage = () => {

    return (
      localStorage.getItem(
        "language"
      ) ||
      localStorage.getItem(
        "selectedLanguage"
      ) ||
      "auto"
    );
  };


  /* =========================================================
     NEW CHAT
     ========================================================= */

  const createNewChat = () => {

    const currentAssistant =
      assistantId ||
      getStoredAssistantId() ||
      "default";

    const newSessionId =
      "chat_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .substring(2, 10);

    sessionStorage.setItem(
      `ai_chat_session_id_${currentAssistant}`,
      newSessionId
    );

    setMessages([]);
    setInput("");

    inputRef.current?.focus();
  };


  /* =========================================================
     CALL FASTAPI
     ========================================================= */

  const generateAIResponse =
    async (question) => {

      let currentAssistantId =
        assistantId ||
        getStoredAssistantId();

      if (!currentAssistantId) {
        currentAssistantId =
          await loadAssistant();
      }

      if (!currentAssistantId) {
        throw new Error(
          "No AI Assistant is available."
        );
      }

      const sessionId =
        getSessionId();

      const language =
        getLanguage();

      const token =
        getAuthToken();

      const headers = {
        "Content-Type":
          "application/json",
      };

      if (token) {
        headers.Authorization =
          `Bearer ${token}`;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/chat/message`,
          {
            method: "POST",
            headers,

            body: JSON.stringify({

              assistant_id:
                Number.isNaN(
                  Number(currentAssistantId)
                )
                  ? currentAssistantId
                  : Number(
                      currentAssistantId
                    ),

              session_id:
                sessionId,

              language:
                language,

              message:
                question,
            }),
          }
        );

      const responseText =
        await response.text();

      let data;

      try {
        data =
          JSON.parse(
            responseText
          );
      } catch {
        throw new Error(
          "Backend returned an invalid response."
        );
      }


      /* -----------------------------------------
         INVALID ASSISTANT → RELOAD + RETRY
         ----------------------------------------- */

      if (
        !response.ok &&
        response.status === 404 &&
        String(
          data?.detail || ""
        )
          .toLowerCase()
          .includes("assistant")
      ) {

        clearStoredAssistant();

        const newAssistantId =
          await loadAssistant();

        if (!newAssistantId) {
          throw new Error(
            "No valid AI Assistant is available."
          );
        }

        const retrySessionId =
          getSessionId();

        const retryResponse =
          await fetch(
            `${API_BASE_URL}/api/chat/message`,
            {
              method: "POST",
              headers,

              body: JSON.stringify({

                assistant_id:
                  Number.isNaN(
                    Number(
                      newAssistantId
                    )
                  )
                    ? newAssistantId
                    : Number(
                        newAssistantId
                      ),

                session_id:
                  retrySessionId,

                language:
                  language,

                message:
                  question,
              }),
            }
          );

        const retryText =
          await retryResponse.text();

        let retryData;

        try {
          retryData =
            JSON.parse(
              retryText
            );
        } catch {
          throw new Error(
            "Backend returned an invalid response."
          );
        }

        if (!retryResponse.ok) {
          throw new Error(
            retryData?.detail ||
            retryData?.message ||
            "AI request failed."
          );
        }

        if (
          !retryData?.reply ||
          !String(
            retryData.reply
          ).trim()
        ) {
          throw new Error(
            "AI returned an empty response."
          );
        }

        if (
          retryData.assistant_id
        ) {
          saveAssistantId(
            retryData.assistant_id
          );
        }

        if (
          retryData.assistant
        ) {

          setAssistantName(
            retryData.assistant
          );

          localStorage.setItem(
            "assistant_name",
            retryData.assistant
          );
        }

        return retryData;
      }


      /* -----------------------------------------
         NORMAL ERROR
         ----------------------------------------- */

      if (!response.ok) {

        throw new Error(
          data?.detail ||
          data?.message ||
          "AI request failed."
        );
      }


      /* -----------------------------------------
         EMPTY RESPONSE
         ----------------------------------------- */

      if (
        !data?.reply ||
        !String(
          data.reply
        ).trim()
      ) {
        throw new Error(
          "AI returned an empty response."
        );
      }


      /* -----------------------------------------
         UPDATE ASSISTANT
         ----------------------------------------- */

      if (data.assistant_id) {
        saveAssistantId(
          data.assistant_id
        );
      }

      if (data.assistant) {

        setAssistantName(
          data.assistant
        );

        localStorage.setItem(
          "assistant_name",
          data.assistant
        );
      }

      return data;
    };


  /* =========================================================
     SEND MESSAGE
     ========================================================= */

  const sendMessage =
    async (text = input) => {

      const messageText =
        String(
          text || ""
        ).trim();

      if (
        !messageText ||
        isTyping
      ) {
        return;
      }

      const userMessage = {
        id: Date.now(),
        sender: "user",
        text: messageText,
      };

      setMessages(
        (previous) => [
          ...previous,
          userMessage,
        ]
      );

      setInput("");
      setIsTyping(true);


      /* -----------------------------------------
         HISTORY
         ----------------------------------------- */

      setChatHistory(
        (previous) => {

          const exists =
            previous.some(
              (chat) =>
                chat.title ===
                messageText
            );

          if (exists) {
            return previous;
          }

          return [
            {
              id: Date.now(),
              title: messageText,
            },
            ...previous,
          ];
        }
      );


      /* -----------------------------------------
         AI
         ----------------------------------------- */

      try {

        const data =
          await generateAIResponse(
            messageText
          );

        const aiMessage = {
          id:
            Date.now() + 1,

          sender:
            "ai",

          text:
            String(data.reply),
        };

        setMessages(
          (previous) => [
            ...previous,
            aiMessage,
          ]
        );

      } catch (error) {

        console.error(
          "[AI CHAT] ERROR:",
          error
        );

        const errorMessage = {
          id:
            Date.now() + 1,

          sender:
            "ai",

          text:
            error?.message ||
            "Sorry, I couldn't process your request right now.",
        };

        setMessages(
          (previous) => [
            ...previous,
            errorMessage,
          ]
        );

      } finally {

        setIsTyping(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    };


  /* =========================================================
     FORM
     ========================================================= */

  const handleSubmit = (
    event
  ) => {

    event.preventDefault();

    sendMessage();
  };


  /* =========================================================
     ENTER
     ========================================================= */

  const handleKeyDown = (
    event
  ) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();
    }
  };


  /* =========================================================
     DELETE HISTORY
     ========================================================= */

  const deleteHistory =
    (id) => {

      setChatHistory(
        (previous) =>
          previous.filter(
            (chat) =>
              chat.id !== id
          )
      );
    };


  /* =========================================================
     FILTER HISTORY
     ========================================================= */

  const filteredHistory =
    chatHistory.filter(
      (chat) =>
        chat.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );


  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="ai-chat-page">

      {/* MOBILE HEADER */}

      <div className="ai-mobile-header">

        <button
          className="ai-mobile-menu"
          type="button"
          onClick={() =>
            setSidebarOpen(
              (previous) =>
                !previous
            )
          }
        >
          <FaBars />
        </button>

        <div className="ai-mobile-title">
          <FaRobot />
          <span>
            AI Chat
          </span>
        </div>

      </div>


      {/* SIDEBAR */}

      <aside
        className={`ai-chat-sidebar ${
          sidebarOpen
            ? "open"
            : ""
        }`}
      >

        <div className="ai-chat-sidebar-header">

          <div className="ai-history-title">

            <h3>
              Chat History
            </h3>

            <button
              title="New Chat"
              type="button"
              onClick={
                createNewChat
              }
            >
              <FaPlus />
            </button>

          </div>


          <div className="ai-chat-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

            {search && (
              <button
                className="clear-search"
                type="button"
                onClick={() =>
                  setSearch("")
                }
              >
                <FaTimes />
              </button>
            )}

          </div>

        </div>


        <div className="ai-history-list">

          {filteredHistory.length ===
          0 ? (

            <div className="ai-empty-history">

              <FaRobot />

              <p>
                No conversations yet
              </p>

              <span>
                Start a conversation with AI
              </span>

            </div>

          ) : (

            filteredHistory.map(
              (chat) => (

                <div
                  className="ai-history-item"
                  key={chat.id}
                >

                  <button
                    type="button"
                    onClick={() => {

                      setInput(
                        chat.title
                      );

                      inputRef.current?.focus();
                    }}
                  >
                    {chat.title}
                  </button>

                  <button
                    className="history-delete"
                    type="button"
                    title="Delete"
                    onClick={() =>
                      deleteHistory(
                        chat.id
                      )
                    }
                  >
                    <FaTrash />
                  </button>

                </div>
              )
            )
          )}

        </div>

      </aside>


      {/* MAIN */}

      <section className="ai-chat-main">

        {/* TOP BAR */}

        <div className="ai-chat-topbar">

          <div className="ai-chat-topbar-left">

            <button
              className="ai-close-sidebar"
              type="button"
              onClick={() =>
                setSidebarOpen(
                  (previous) =>
                    !previous
                )
              }
            >
              <FaBars />
            </button>

            <div className="ai-chat-brand-icon">
              <FaRobot />
            </div>

            <div>

              <strong>
                {assistantLoading
                  ? "AI Chat"
                  : assistantName}
              </strong>

              <span>
                Powered by AzentMart AI
              </span>

            </div>

          </div>


          <button
            className="ai-new-chat-btn"
            type="button"
            onClick={
              createNewChat
            }
          >
            <FaPlus />
            <span>
              New Chat
            </span>
          </button>

        </div>


        {/* CHAT CONTENT */}

        <div className="ai-chat-content">

          {assistantError &&
            messages.length === 0 && (

              <div className="ai-assistant-error">
                {assistantError}
              </div>
            )}


          {messages.length ===
          0 ? (

            <div className="ai-welcome">

              <div className="ai-welcome-icon">
                <FaRobot />
              </div>

              <h1>
                {assistantLoading
                  ? "Connecting to AI..."
                  : assistantName}
              </h1>

              <p>
                Ask me anything about your
                business, calls, campaigns,
                contacts, assistants,
                knowledge bases,
                programming, general
                questions and more.
              </p>

              <div className="ai-suggestions">

                {suggestions.map(
                  (suggestion) => (

                    <button
                      key={
                        suggestion.text
                      }
                      type="button"
                      disabled={
                        assistantLoading ||
                        isTyping
                      }
                      onClick={() =>
                        sendMessage(
                          suggestion.text
                        )
                      }
                    >

                      <span className="suggestion-icon">
                        {suggestion.icon}
                      </span>

                      <span>
                        {suggestion.text}
                      </span>

                    </button>
                  )
                )}

              </div>

            </div>

          ) : (

            <div className="ai-message-container">

              {messages.map(
                (message) => (

                  <div
                    key={message.id}
                    className={`ai-message-row ${
                      message.sender === "user"
                        ? "user-message"
                        : "assistant-message"
                    }`}
                  >

                    {message.sender ===
                      "ai" && (

                      <div className="message-avatar">
                        <FaRobot />
                      </div>
                    )}


                    <div className="message-bubble">

                      {renderMarkdown(
                        message.text
                      )}

                    </div>

                  </div>
                )
              )}


              {isTyping && (

                <div className="ai-message-row assistant-message">

                  <div className="message-avatar">
                    <FaRobot />
                  </div>

                  <div className="message-bubble typing-bubble">

                    <span />
                    <span />
                    <span />

                  </div>

                </div>
              )}


              <div
                ref={messagesEndRef}
              />

            </div>
          )}

        </div>


        {/* INPUT */}

        <div className="ai-input-area">

          <form
            className="ai-input-wrapper"
            onSubmit={
              handleSubmit
            }
          >

            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) =>
                setInput(
                  event.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder={
                assistantLoading
                  ? "Connecting to AI..."
                  : "Ask anything..."
              }
              rows="1"
              disabled={
                isTyping ||
                assistantLoading
              }
            />

            <button
              type="submit"
              className="ai-send-btn"
              disabled={
                !input.trim() ||
                isTyping ||
                assistantLoading
              }
            >
              <FaPaperPlane />
            </button>

          </form>

          <div className="ai-input-footer">
            AI-generated responses.
            Verify critical data.
          </div>

        </div>

      </section>

    </div>
  );
}


export default AIChat;
import React, { useEffect, useMemo, useState } from "react";
import WhatsAppSidebar from "../components/WhatsAppSidebar";
import WAAnalytics from "../components/WAAnalytics";
import ContactsPage from "../components/ContactsPage";
import AutomationPage from "../components/AutomationPage";
import CampaignsPage from "../components/CampaignsPage";
import AstraPage from "../components/AstraPage";
import BillingPage from "../components/BillingPage";
import CommercePage from "../components/CommercePage";
import AdsPage from "../components/AdsPage";
import ApiPage from "../components/ApiPage";

const WhatsappDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  // Backend conversation data
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // TEAM INBOX FRONTEND STATE
  // ============================================================

  const [selectedConversation, setSelectedConversation] =
    useState(null);

  // Full chat history for selected conversation
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageError, setMessageError] = useState("");

  const [conversationSearch, setConversationSearch] =
    useState("");

  const [messageText, setMessageText] = useState("");

  // Sending state
  const [sendingMessage, setSendingMessage] = useState(false);

  // ============================================================
  // LOAD CONVERSATIONS FROM BACKEND
  // ============================================================

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      setError("");

      try {
        // Existing backend endpoint
        const response = await fetch(
          "/api/azentmart/conversations"
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        console.log(
          "Conversations received from backend:",
          data
        );

        setConversations(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          "Failed to load conversations:",
          err
        );

        setError(
          "Failed to load conversations from backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  // ============================================================
  // FILTER CONVERSATIONS
  // ============================================================

  const filteredConversations = useMemo(() => {
    const query = conversationSearch
      .trim()
      .toLowerCase();

    if (!query) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const name =
        conversation.contact?.name || "";

      const phone =
        conversation.contact?.phone || "";

      const lastMessage =
        conversation.last_message_text || "";

      const status =
        conversation.status || "";

      return (
        name.toLowerCase().includes(query) ||
        phone.toLowerCase().includes(query) ||
        lastMessage.toLowerCase().includes(query) ||
        status.toLowerCase().includes(query)
      );
    });
  }, [conversations, conversationSearch]);

  // ============================================================
  // SELECT CONVERSATION + LOAD FULL CHAT HISTORY
  // ============================================================

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setMessageText("");
    setMessages([]);
    setMessageError("");

    if (!conversation?.id) {
      return;
    }

    try {
      setLoadingMessages(true);

      console.log(
        "Loading messages for conversation:",
        conversation.id
      );

      /*
       * Existing backend endpoint:
       *
       * GET
       * /api/azentmart/conversations/{id}/messages
       *
       * DO NOT CHANGE BACKEND.
       */

      const response = await fetch(
        `/api/azentmart/conversations/${conversation.id}/messages`
      );

      const data = await response.json();

      console.log(
        "Messages received:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to load chat history."
        );
      }

      /*
       * Support all existing response formats:
       *
       * [...]
       *
       * { messages: [...] }
       *
       * { items: [...] }
       */

      const history = Array.isArray(data)
        ? data
        : Array.isArray(data?.messages)
        ? data.messages
        : Array.isArray(data?.items)
        ? data.items
        : [];

      /*
       * Backend API returns newest first.
       *
       * Chat UI should display:
       *
       * oldest
       *   ↓
       * newer
       *   ↓
       * newest
       */

      setMessages([...history].reverse());
    } catch (err) {
      console.error(
        "Failed to load chat history:",
        err
      );

      setMessageError(
        err.message ||
          "Failed to load chat history."
      );

      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // ============================================================
  // BACK TO CONVERSATION LIST
  // ============================================================

  const handleBackToInbox = () => {
    setSelectedConversation(null);
    setMessageText("");
    setMessages([]);
    setMessageError("");
  };

  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const handleSendMessage = async () => {
    const text = messageText.trim();

    if (!text) {
      return;
    }

    if (!selectedConversation?.id) {
      alert("Please select a conversation first.");
      return;
    }

    if (sendingMessage) {
      return;
    }

    try {
      setSendingMessage(true);
      setMessageError("");

      console.log(
        "Sending WhatsApp message:",
        {
          conversation_id: selectedConversation.id,
          message_type: "text",
          content_text: text,
        }
      );

      /*
       * EXISTING BACKEND SEND ENDPOINT
       *
       * POST /api/whatsapp/send
       *
       * Your backend already supports:
       *
       * conversation_id
       * message_type
       * content_text
       *
       * DO NOT CHANGE BACKEND.
       */

      const response = await fetch(
        "/api/whatsapp/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversation_id:
              selectedConversation.id,
            message_type: "text",
            content_text: text,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Send message response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to send WhatsApp message."
        );
      }

      /*
       * Message successfully sent.
       *
       * Add it immediately to the UI so the user
       * doesn't have to refresh the page.
       */

      const newMessage = {
        id:
          data?.message_id ||
          `temp-${Date.now()}`,
        conversation_id:
          selectedConversation.id,
        content_text: text,
        message_type: "text",
        direction: "outbound",
        sender_type: "agent",
        created_at:
          new Date().toISOString(),
        whatsapp_message_id:
          data?.whatsapp_message_id || null,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        newMessage,
      ]);

      /*
       * Update the conversation preview
       * in Team Inbox.
       */

      setConversations((previousConversations) =>
        previousConversations.map(
          (conversation) =>
            conversation.id ===
            selectedConversation.id
              ? {
                  ...conversation,
                  last_message_text: text,
                  updated_at:
                    newMessage.created_at,
                }
              : conversation
        )
      );

      /*
       * Also update selected conversation so
       * the state stays consistent.
       */

      setSelectedConversation((previous) =>
        previous
          ? {
              ...previous,
              last_message_text: text,
              updated_at:
                newMessage.created_at,
            }
          : previous
      );

      // Clear input after successful send
      setMessageText("");
    } catch (err) {
      console.error(
        "Failed to send WhatsApp message:",
        err
      );

      setMessageError(
        err.message ||
          "Failed to send WhatsApp message."
      );
    } finally {
      setSendingMessage(false);
    }
  };

  // ============================================================
  // MESSAGE KEYBOARD
  // ============================================================

  const handleMessageKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // ============================================================
  // CONVERSATION TIME
  // ============================================================

  const formatConversationDate = (date) => {
    if (!date) {
      return "";
    }

    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "";
    }
  };

  // ============================================================
  // AVATAR LETTER
  // ============================================================

  const getInitial = (conversation) => {
    const name =
      conversation?.contact?.name ||
      "C";

    return name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  // ============================================================
  // MESSAGE TEXT HELPER
  // ============================================================

  const getMessageText = (message) => {
    return (
      message?.content_text ??
      message?.text ??
      message?.content ??
      message?.body ??
      message?.message ??
      message?.message_text ??
      message?.text_body ??
      ""
    );
  };

  // ============================================================
  // MESSAGE DIRECTION HELPER
  // ============================================================

  const isOutgoingMessage = (message) => {
    const direction = String(
      message?.direction ??
        message?.sender_type ??
        message?.role ??
        message?.from ??
        ""
    ).toLowerCase();

    return (
      direction.includes("outbound") ||
      direction.includes("outgoing") ||
      direction.includes("agent") ||
      direction.includes("assistant") ||
      direction.includes("bot") ||
      direction === "business"
    );
  };

  // ============================================================
  // RENDER CONTENT
  // ============================================================

  const renderContent = () => {
    switch (activeTab) {

      // ========================================================
      // ANALYTICS
      // ========================================================

      case "analytics":
        return <WAAnalytics />;

      // ========================================================
      // TEAM INBOX
      // ========================================================

      case "inbox":

        // ======================================================
        // CHAT VIEW
        // ======================================================

        if (selectedConversation) {
          const contact =
            selectedConversation.contact || {};

          return (
            <div
              style={{
                width: "100%",
                height: "calc(100vh - 40px)",
                maxHeight: "calc(100vh - 40px)",
                minHeight: 0,
                background: "#f8f9fc",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >

              {/* ==================================================
                  CHAT HEADER
              ================================================== */}

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px 12px 0 0",
                  padding: "18px 22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "15px",
                  flexShrink: 0,
                }}
              >

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    minWidth: 0,
                  }}
                >

                  {/* BACK BUTTON */}

                  <button
                    onClick={handleBackToInbox}
                    style={{
                      border: "1px solid #e5e7eb",
                      background: "#ffffff",
                      width: "38px",
                      height: "38px",
                      borderRadius: "9px",
                      cursor: "pointer",
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    title="Back to Team Inbox"
                  >
                    ←
                  </button>

                  {/* AVATAR */}

                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #7c3aed, #9333ea)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "17px",
                      flexShrink: 0,
                    }}
                  >
                    {getInitial(
                      selectedConversation
                    )}
                  </div>

                  {/* CUSTOMER */}

                  <div
                    style={{
                      minWidth: 0,
                    }}
                  >
                    <h1
                      style={{
                        margin: 0,
                        fontSize: "19px",
                        fontWeight: "700",
                        color: "#111827",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {contact.name ||
                        "Unknown Contact"}
                    </h1>

                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#6b7280",
                        fontSize: "13px",
                      }}
                    >
                      {contact.phone ||
                        "No phone number"}
                    </p>
                  </div>

                </div>

                {/* STATUS */}

                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background:
                      selectedConversation.status ===
                      "open"
                        ? "#dcfce7"
                        : "#f3f4f6",
                    color:
                      selectedConversation.status ===
                      "open"
                        ? "#166534"
                        : "#555",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedConversation.status ||
                    "Unknown"}
                </span>

              </div>

              {/* ==================================================
                  CHAT BODY
              ================================================== */}

              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  background: "#ffffff",
                  borderLeft: "1px solid #e5e7eb",
                  borderRight: "1px solid #e5e7eb",
                  padding: "24px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >

                {/* LOADING MESSAGES */}

                {loadingMessages && (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7280",
                    }}
                  >
                    Loading chat history...
                  </div>
                )}

                {/* MESSAGE ERROR */}

                {!loadingMessages &&
                  messageError && (
                    <div
                      style={{
                        padding: "15px",
                        background: "#fff1f2",
                        color: "#dc2626",
                        borderRadius: "10px",
                        border:
                          "1px solid #fecdd3",
                      }}
                    >
                      {messageError}
                    </div>
                  )}

                {/* EMPTY CHAT */}

                {!loadingMessages &&
                  !messageError &&
                  messages.length === 0 && (
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        color: "#9ca3af",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "34px",
                        }}
                      >
                        💬
                      </div>

                      <strong
                        style={{
                          color: "#6b7280",
                          fontSize: "15px",
                        }}
                      >
                        No messages yet
                      </strong>

                      <span
                        style={{
                          fontSize: "13px",
                        }}
                      >
                        Start a conversation with this
                        customer.
                      </span>
                    </div>
                  )}

                {/* ==================================================
                    FULL CHAT HISTORY
                ================================================== */}

                {!loadingMessages &&
                  messages.length > 0 &&
                  messages.map(
                    (message, index) => {
                      const outgoing =
                        isOutgoingMessage(
                          message
                        );

                      const text =
                        getMessageText(
                          message
                        );

                      return (
                        <div
                          key={
                            message?.id ||
                            message?.whatsapp_message_id ||
                            `message-${index}`
                          }
                          style={{
                            display: "flex",
                            justifyContent:
                              outgoing
                                ? "flex-end"
                                : "flex-start",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              maxWidth: "70%",
                              background:
                                outgoing
                                  ? "#7c3aed"
                                  : "#f3f4f6",
                              color:
                                outgoing
                                  ? "#ffffff"
                                  : "#1f2937",
                              padding:
                                "12px 15px",
                              borderRadius:
                                outgoing
                                  ? "16px 4px 16px 16px"
                                  : "4px 16px 16px 16px",
                              fontSize: "14px",
                              lineHeight: "1.5",
                              wordBreak:
                                "break-word",
                            }}
                          >

                            {/* SENDER */}

                            <div
                              style={{
                                fontSize: "11px",
                                color: outgoing
                                  ? "rgba(255,255,255,0.75)"
                                  : "#6b7280",
                                marginBottom:
                                  "5px",
                              }}
                            >
                              {outgoing
                                ? "You"
                                : contact.name ||
                                  "Customer"}
                            </div>

                            {/* MESSAGE TEXT */}

                            <div>
                              {text ||
                                "Message"}
                            </div>

                            {/* TIME */}

                            {message?.created_at && (
                              <div
                                style={{
                                  marginTop:
                                    "6px",
                                  fontSize:
                                    "10px",
                                  color:
                                    outgoing
                                      ? "rgba(255,255,255,0.7)"
                                      : "#9ca3af",
                                  textAlign:
                                    "right",
                                }}
                              >
                                {formatConversationDate(
                                  message.created_at
                                )}
                              </div>
                            )}

                          </div>
                        </div>
                      );
                    }
                  )}

              </div>

              {/* ==================================================
                  CHAT COMPOSER
              ================================================== */}

              <div
                style={{
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 5,
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0 0 12px 12px",
                  padding: "15px",
                  boxSizing: "border-box",
                  boxShadow: "0 -4px 14px rgba(0, 0, 0, 0.04)",
                }}
              >

                {/* SEND ERROR */}

                {messageError && !loadingMessages && (
                  <div
                    style={{
                      marginBottom: "10px",
                      padding: "10px 12px",
                      background: "#fff1f2",
                      color: "#dc2626",
                      borderRadius: "8px",
                      fontSize: "13px",
                      border:
                        "1px solid #fecdd3",
                    }}
                  >
                    {messageError}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "10px",
                  }}
                >

                  <textarea
                    value={messageText}
                    onChange={(event) =>
                      setMessageText(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleMessageKeyDown
                    }
                    placeholder="Type a message..."
                    rows={2}
                    disabled={sendingMessage}
                    style={{
                      flex: 1,
                      resize: "none",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "10px",
                      padding: "11px 13px",
                      outline: "none",
                      fontFamily: "inherit",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      opacity:
                        sendingMessage
                          ? 0.7
                          : 1,
                    }}
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={
                      !messageText.trim() ||
                      sendingMessage
                    }
                    style={{
                      border: "none",
                      borderRadius: "10px",
                      background:
                        messageText.trim() &&
                        !sendingMessage
                          ? "#7c3aed"
                          : "#d1d5db",
                      color: "#ffffff",
                      padding: "12px 20px",
                      cursor:
                        messageText.trim() &&
                        !sendingMessage
                          ? "pointer"
                          : "not-allowed",
                      fontWeight: "600",
                      minWidth: "80px",
                    }}
                  >
                    {sendingMessage
                      ? "Sending..."
                      : "Send"}
                  </button>

                </div>

                <div
                  style={{
                    marginTop: "7px",
                    fontSize: "11px",
                    color: "#9ca3af",
                  }}
                >
                  Press Enter to send
                </div>

              </div>

            </div>
          );
        }

        // ======================================================
        // CONVERSATION LIST
        // ======================================================

        return (
          <div
            style={{
              padding: "30px",
              width: "100%",
              minHeight: "100vh",
              background: "#f8f9fc",
              boxSizing: "border-box",
            }}
          >

            {/* HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "20px",
                marginBottom: "25px",
                flexWrap: "wrap",
              }}
            >

              <div>
                <h1
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    margin: "0 0 8px 0",
                  }}
                >
                  Team Inbox
                </h1>

                <p
                  style={{
                    color: "#666",
                    margin: 0,
                  }}
                >
                  WhatsApp conversations from your
                  backend.
                </p>
              </div>

              {/* SEARCH */}

              <input
                type="text"
                placeholder="Search conversations..."
                value={conversationSearch}
                onChange={(event) =>
                  setConversationSearch(
                    event.target.value
                  )
                }
                style={{
                  width: "280px",
                  maxWidth: "100%",
                  border:
                    "1px solid #d1d5db",
                  borderRadius: "9px",
                  padding: "11px 13px",
                  fontSize: "14px",
                  outline: "none",
                  background: "#ffffff",
                  boxSizing: "border-box",
                }}
              />

            </div>

            {/* LOADING */}

            {loading && (
              <div
                style={{
                  padding: "20px",
                  background: "#fff",
                  borderRadius: "10px",
                  border:
                    "1px solid #e5e7eb",
                }}
              >
                Loading conversations...
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div
                style={{
                  padding: "20px",
                  background: "#fff1f2",
                  color: "#dc2626",
                  borderRadius: "10px",
                  border:
                    "1px solid #fecdd3",
                }}
              >
                {error}
              </div>
            )}

            {/* NO CONVERSATIONS */}

            {!loading &&
              !error &&
              conversations.length === 0 && (
                <div
                  style={{
                    padding: "30px",
                    background: "#fff",
                    borderRadius: "10px",
                    border:
                      "1px solid #e5e7eb",
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0,
                    }}
                  >
                    No conversations found
                  </h3>

                  <p
                    style={{
                      color: "#666",
                    }}
                  >
                    There are currently no
                    WhatsApp conversations.
                  </p>
                </div>
              )}

            {/* SEARCH EMPTY */}

            {!loading &&
              !error &&
              conversations.length > 0 &&
              filteredConversations.length === 0 && (
                <div
                  style={{
                    padding: "30px",
                    background: "#fff",
                    borderRadius: "10px",
                    border:
                      "1px solid #e5e7eb",
                    textAlign: "center",
                  }}
                >
                  <h3>
                    No matching conversations
                  </h3>

                  <p
                    style={{
                      color: "#666",
                    }}
                  >
                    Try a different customer name,
                    phone number or message.
                  </p>
                </div>
              )}

            {/* CONVERSATION LIST */}

            {!loading &&
              !error &&
              filteredConversations.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >

                  {filteredConversations.map(
                    (conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() =>
                          handleSelectConversation(
                            conversation
                          )
                        }
                        style={{
                          background: "#fff",
                          border:
                            "1px solid #e5e7eb",
                          borderRadius: "12px",
                          padding: "20px",
                          boxShadow:
                            "0 1px 3px rgba(0,0,0,0.05)",
                          cursor: "pointer",
                          transition:
                            "transform 0.15s ease, box-shadow 0.15s ease",
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.transform =
                            "translateY(-1px)";
                          event.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(0,0,0,0.08)";
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.transform =
                            "translateY(0)";
                          event.currentTarget.style.boxShadow =
                            "0 1px 3px rgba(0,0,0,0.05)";
                        }}
                      >

                        {/* CONTACT + STATUS */}

                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "flex-start",
                            gap: "20px",
                          }}
                        >

                          <div
                            style={{
                              display: "flex",
                              alignItems:
                                "center",
                              gap: "13px",
                            }}
                          >

                            <div
                              style={{
                                width: "44px",
                                height: "44px",
                                borderRadius:
                                  "50%",
                                background:
                                  "linear-gradient(135deg, #7c3aed, #9333ea)",
                                color:
                                  "#ffffff",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                fontWeight:
                                  "700",
                                fontSize:
                                  "16px",
                                flexShrink: 0,
                              }}
                            >
                              {getInitial(
                                conversation
                              )}
                            </div>

                            <div>
                              <h3
                                style={{
                                  margin:
                                    "0 0 6px 0",
                                  fontSize:
                                    "18px",
                                  fontWeight:
                                    "600",
                                }}
                              >
                                {conversation
                                  .contact
                                  ?.name ||
                                  "Unknown Contact"}
                              </h3>

                              <p
                                style={{
                                  margin: 0,
                                  color:
                                    "#666",
                                }}
                              >
                                {conversation
                                  .contact
                                  ?.phone ||
                                  "No phone number"}
                              </p>
                            </div>

                          </div>

                          {/* STATUS */}

                          <span
                            style={{
                              padding:
                                "5px 10px",
                              borderRadius:
                                "20px",
                              fontSize:
                                "12px",
                              fontWeight:
                                "600",
                              background:
                                conversation.status ===
                                "open"
                                  ? "#dcfce7"
                                  : "#f3f4f6",
                              color:
                                conversation.status ===
                                "open"
                                  ? "#166534"
                                  : "#555",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {conversation.status ||
                              "unknown"}
                          </span>

                        </div>

                        {/* LAST MESSAGE */}

                        <div
                          style={{
                            marginTop: "15px",
                            paddingTop: "15px",
                            borderTop:
                              "1px solid #eee",
                          }}
                        >

                          <p
                            style={{
                              margin:
                                "0 0 8px 0",
                              fontWeight:
                                "500",
                            }}
                          >
                            Last message
                          </p>

                          <p
                            style={{
                              margin: 0,
                              color: "#555",
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {conversation
                              .last_message_text ||
                              "No message"}
                          </p>

                        </div>

                        {/* DETAILS */}

                        <div
                          style={{
                            display: "flex",
                            flexWrap:
                              "wrap",
                            gap: "25px",
                            marginTop:
                              "15px",
                            fontSize:
                              "13px",
                            color:
                              "#777",
                          }}
                        >

                          <span>
                            Unread:{" "}
                            {conversation
                              .unread_count ??
                              0}
                          </span>

                          <span>
                            Created:{" "}
                            {conversation.created_at
                              ? new Date(
                                  conversation.created_at
                                ).toLocaleString()
                              : "N/A"}
                          </span>

                          <span
                            style={{
                              marginLeft:
                                "auto",
                              color:
                                "#7c3aed",
                              fontWeight:
                                "600",
                            }}
                          >
                            Open chat →
                          </span>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

          </div>
        );

      // ========================================================
      // CHAT
      // ========================================================

      case "chat":
        return (
          <div
            style={{
              padding: "30px",
            }}
          >
            <h1>AI Chat Page</h1>
          </div>
        );

      // ========================================================
      // CAMPAIGNS
      // ========================================================

      case "campaigns":
        return <CampaignsPage />;

      // ========================================================
      // BROADCAST
      // ========================================================

      case "broadcast":
        return (
          <div
            style={{
              padding: "30px",
            }}
          >
            <h1>Broadcast Page</h1>
          </div>
        );

      // ========================================================
      // CONTACTS
      // ========================================================

      case "contacts":
        return <ContactsPage />;

      // ========================================================
      // ASTRA / AGENTS
      // ========================================================

      case "astra":
        return <AstraPage />;

      case "billing":
        return <BillingPage />;

      // ========================================================
      // AUTOMATIONS
      // ========================================================

      case "automations":
        return <AutomationPage />;

      // ========================================================
      // COMMERCE
      // ========================================================

      case "commerce":
        return <CommercePage />;

      // ========================================================
      // ADS
      // ========================================================

      case "ads":
        return <AdsPage />;

      // ========================================================
      // API
      // ========================================================

      case "api":
        return <ApiPage />;

      // ========================================================
      // INTEGRATIONS
      // ========================================================

      case "integrations":
        return (
          <div
            style={{
              padding: "30px",
            }}
          >
            <h1>Integrations Page</h1>
          </div>
        );

      // ========================================================
      // WEBHOOKS
      // ========================================================

      case "webhooks":
        return (
          <div
            style={{
              padding: "30px",
            }}
          >
            <h1>Webhooks Page</h1>
          </div>
        );

      // ========================================================
      // USER MANAGEMENT
      // ========================================================

      case "user-management":
        return (
          <div
            style={{
              padding: "30px",
            }}
          >
            <h1>User Management</h1>
          </div>
        );

      // ========================================================
      // ACCOUNT
      // ========================================================

      case "account":
        return (
          <div
            style={{
              padding: "30px",
            }}
          >
            <h1>Account Details</h1>
          </div>
        );

      // ========================================================
      // CHANNELS
      // ========================================================

      case "channels":
        return (
          <div
            style={{
              padding: "30px",
            }}
          >
            <h1>Channels</h1>
          </div>
        );

      // ========================================================
      // DEFAULT
      // ========================================================

      default:
        return <WAAnalytics />;
    }
  };

  // ============================================================
  // MAIN DASHBOARD
  // ============================================================

  return (
    <div className="layout-container">

      {/* SIDEBAR */}

      <WhatsAppSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* CONTENT */}

      <div className="layout-content">
        {renderContent()}
      </div>

    </div>
  );
};

export default WhatsappDashboard;
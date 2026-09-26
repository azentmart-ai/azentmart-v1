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
import IntegrationsPage from "../components/IntegrationsPage";

const WhatsappDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  // Backend conversation data
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // TEAM INBOX FRONTEND STATE
  // ============================================================
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Full chat history for selected conversation
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageError, setMessageError] = useState("");

  const [conversationSearch, setConversationSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // ============================================================
  // LOAD CONVERSATIONS FROM BACKEND
  // ============================================================
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/azentmart/conversations");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setConversations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load conversations:", err);
        setError("Failed to load conversations from backend.");
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
    const query = conversationSearch.trim().toLowerCase();
    if (!query) return conversations;

    return conversations.filter((conversation) => {
      const name = conversation.contact?.name || "";
      const phone = conversation.contact?.phone || "";
      const lastMessage = conversation.last_message_text || "";
      const status = conversation.status || "";

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

    if (!conversation?.id) return;

    try {
      setLoadingMessages(true);
      const response = await fetch(
        `/api/azentmart/conversations/${conversation.id}/messages`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load chat history.");
      }

      const history = Array.isArray(data)
        ? data
        : Array.isArray(data?.messages)
        ? data.messages
        : Array.isArray(data?.items)
        ? data.items
        : [];

      setMessages([...history].reverse());
    } catch (err) {
      console.error("Failed to load chat history:", err);
      setMessageError(err.message || "Failed to load chat history.");
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

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
    if (!text || !selectedConversation?.id || sendingMessage) return;

    try {
      setSendingMessage(true);
      setMessageError("");

      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: selectedConversation.id,
          message_type: "text",
          content_text: text,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to send WhatsApp message.");
      }

      const newMessage = {
        id: data?.message_id || `temp-${Date.now()}`,
        conversation_id: selectedConversation.id,
        content_text: text,
        message_type: "text",
        direction: "outbound",
        sender_type: "agent",
        created_at: new Date().toISOString(),
        whatsapp_message_id: data?.whatsapp_message_id || null,
      };

      setMessages((prev) => [...prev, newMessage]);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversation.id
            ? { ...c, last_message_text: text, updated_at: newMessage.created_at }
            : c
        )
      );

      setSelectedConversation((prev) =>
        prev
          ? { ...prev, last_message_text: text, updated_at: newMessage.created_at }
          : prev
      );

      setMessageText("");
    } catch (err) {
      console.error("Failed to send WhatsApp message:", err);
      setMessageError(err.message || "Failed to send WhatsApp message.");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleMessageKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatConversationDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const getInitial = (conversation) => {
    const name = conversation?.contact?.name || "C";
    return name.trim().charAt(0).toUpperCase();
  };

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
      case "analytics":
        return <WAAnalytics />;

      case "inbox":
        if (selectedConversation) {
          const contact = selectedConversation.contact || {};

          return (
            <div
              style={{
                width: "100%",
                height: "calc(100vh - 40px)",
                maxHeight: "calc(100vh - 40px)",
                minHeight: 0,
                background: "#0c1317",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* CHAT HEADER */}
              <div
                style={{
                  background: "#202c33",
                  borderBottom: "1px solid #2a3942",
                  borderRadius: "12px 12px 0 0",
                  padding: "14px 22px",
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
                  <button
                    onClick={handleBackToInbox}
                    style={{
                      border: "1px solid #2a3942",
                      background: "#111b21",
                      color: "#e9edef",
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                    title="Back to Team Inbox"
                  >
                    ←
                  </button>

                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "#00a884",
                      color: "#111b21",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "16px",
                      flexShrink: 0,
                    }}
                  >
                    {getInitial(selectedConversation)}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <h1
                      style={{
                        margin: 0,
                        fontSize: "17px",
                        fontWeight: "600",
                        color: "#e9edef",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {contact.name || "Unknown Contact"}
                    </h1>
                    <p
                      style={{
                        margin: "3px 0 0",
                        color: "#8696a0",
                        fontSize: "12px",
                      }}
                    >
                      {contact.phone || "No phone number"}
                    </p>
                  </div>
                </div>

                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "600",
                    background:
                      selectedConversation.status === "open"
                        ? "#005c4b"
                        : "#202c33",
                    color:
                      selectedConversation.status === "open"
                        ? "#25d366"
                        : "#8696a0",
                    border:
                      selectedConversation.status === "open"
                        ? "none"
                        : "1px solid #2a3942",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedConversation.status || "Unknown"}
                </span>
              </div>

              {/* CHAT BODY */}
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  background: "#0b141a",
                  borderLeft: "1px solid #222e35",
                  borderRight: "1px solid #222e35",
                  padding: "24px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {loadingMessages && (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#8696a0",
                    }}
                  >
                    Loading chat history...
                  </div>
                )}

                {!loadingMessages && messageError && (
                  <div
                    style={{
                      padding: "14px",
                      background: "#32161b",
                      color: "#f87171",
                      borderRadius: "8px",
                      border: "1px solid #451a20",
                    }}
                  >
                    {messageError}
                  </div>
                )}

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
                        color: "#8696a0",
                        gap: "8px",
                      }}
                    >
                      <div style={{ fontSize: "32px" }}>💬</div>
                      <strong style={{ color: "#e9edef", fontSize: "14px" }}>
                        No messages yet
                      </strong>
                      <span style={{ fontSize: "12px" }}>
                        Start a conversation with this customer.
                      </span>
                    </div>
                  )}

                {!loadingMessages &&
                  messages.length > 0 &&
                  messages.map((message, index) => {
                    const outgoing = isOutgoingMessage(message);
                    const text = getMessageText(message);

                    return (
                      <div
                        key={
                          message?.id ||
                          message?.whatsapp_message_id ||
                          `message-${index}`
                        }
                        style={{
                          display: "flex",
                          justifyContent: outgoing ? "flex-end" : "flex-start",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "70%",
                            background: outgoing ? "#005c4b" : "#202c33",
                            color: "#e9edef",
                            padding: "10px 14px",
                            borderRadius: outgoing
                              ? "8px 8px 0px 8px"
                              : "8px 8px 8px 0px",
                            fontSize: "14px",
                            lineHeight: "1.5",
                            wordBreak: "break-word",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              color: outgoing ? "#8696a0" : "#00a884",
                              fontWeight: "600",
                              marginBottom: "4px",
                            }}
                          >
                            {outgoing ? "You" : contact.name || "Customer"}
                          </div>

                          <div>{text || "Message"}</div>

                          {message?.created_at && (
                            <div
                              style={{
                                marginTop: "5px",
                                fontSize: "10px",
                                color: "#8696a0",
                                textAlign: "right",
                              }}
                            >
                              {formatConversationDate(message.created_at)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* CHAT COMPOSER */}
              <div
                style={{
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 5,
                  background: "#202c33",
                  border: "1px solid #2a3942",
                  borderRadius: "0 0 12px 12px",
                  padding: "14px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "10px",
                  }}
                >
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleMessageKeyDown}
                    placeholder="Type a message..."
                    rows={2}
                    disabled={sendingMessage}
                    style={{
                      flex: 1,
                      resize: "none",
                      border: "1px solid #2a3942",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      outline: "none",
                      fontFamily: "inherit",
                      fontSize: "14px",
                      background: "#111b21",
                      color: "#e9edef",
                      boxSizing: "border-box",
                    }}
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendingMessage}
                    style={{
                      border: "none",
                      borderRadius: "8px",
                      background:
                        messageText.trim() && !sendingMessage
                          ? "#00a884"
                          : "#2a3942",
                      color:
                        messageText.trim() && !sendingMessage
                          ? "#111b21"
                          : "#8696a0",
                      padding: "12px 20px",
                      cursor:
                        messageText.trim() && !sendingMessage
                          ? "pointer"
                          : "not-allowed",
                      fontWeight: "700",
                      minWidth: "80px",
                    }}
                  >
                    {sendingMessage ? "..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          );
        }

        // ======================================================
        // CONVERSATION LIST (TEAM INBOX)
        // ======================================================
        return (
          <div
            style={{
              padding: "26px 36px",
              width: "100%",
              minHeight: "100vh",
              background: "#0c1317",
              boxSizing: "border-box",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
                marginBottom: "25px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: "26px",
                    fontWeight: "700",
                    color: "#e9edef",
                    margin: "0 0 6px 0",
                  }}
                >
                  Team Inbox
                </h1>
                <p style={{ color: "#8696a0", margin: 0, fontSize: "13px" }}>
                  WhatsApp conversations from your backend.
                </p>
              </div>

              {/* SEARCH */}
              <input
                type="text"
                placeholder="Search conversations..."
                value={conversationSearch}
                onChange={(e) => setConversationSearch(e.target.value)}
                style={{
                  width: "280px",
                  maxWidth: "100%",
                  border: "1px solid #2a3942",
                  borderRadius: "8px",
                  padding: "9px 13px",
                  fontSize: "14px",
                  outline: "none",
                  background: "#202c33",
                  color: "#e9edef",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* LOADING */}
            {loading && (
              <div
                style={{
                  padding: "20px",
                  background: "#111b21",
                  borderRadius: "10px",
                  border: "1px solid #222e35",
                  color: "#8696a0",
                }}
              >
                Loading conversations...
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div
                style={{
                  padding: "16px",
                  background: "#32161b",
                  color: "#f87171",
                  borderRadius: "8px",
                  border: "1px solid #451a20",
                }}
              >
                {error}
              </div>
            )}

            {/* NO CONVERSATIONS */}
            {!loading && !error && conversations.length === 0 && (
              <div
                style={{
                  padding: "30px",
                  background: "#111b21",
                  borderRadius: "10px",
                  border: "1px solid #222e35",
                  textAlign: "center",
                }}
              >
                <h3 style={{ marginTop: 0, color: "#e9edef" }}>
                  No conversations found
                </h3>
                <p style={{ color: "#8696a0" }}>
                  There are currently no WhatsApp conversations.
                </p>
              </div>
            )}

            {/* CONVERSATION CARDS */}
            {!loading && !error && filteredConversations.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    style={{
                      background: "#111b21",
                      border: "1px solid #222e35",
                      borderRadius: "10px",
                      padding: "18px 20px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#202c33";
                      e.currentTarget.style.borderColor = "#00a884";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#111b21";
                      e.currentTarget.style.borderColor = "#222e35";
                    }}
                  >
                    {/* CONTACT + STATUS */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            background: "#202c33",
                            color: "#00a884",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "700",
                            fontSize: "15px",
                            flexShrink: 0,
                          }}
                        >
                          {getInitial(conversation)}
                        </div>

                        <div>
                          <h3
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: "15px",
                              fontWeight: "600",
                              color: "#e9edef",
                            }}
                          >
                            {conversation.contact?.name || "Unknown Contact"}
                          </h3>
                          <p
                            style={{
                              margin: 0,
                              color: "#8696a0",
                              fontSize: "12px",
                            }}
                          >
                            {conversation.contact?.phone || "No phone number"}
                          </p>
                        </div>
                      </div>

                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: "600",
                          background:
                            conversation.status === "open"
                              ? "#005c4b"
                              : "#202c33",
                          color:
                            conversation.status === "open"
                              ? "#25d366"
                              : "#8696a0",
                          border:
                            conversation.status === "open"
                              ? "none"
                              : "1px solid #2a3942",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {conversation.status || "unknown"}
                      </span>
                    </div>

                    {/* LAST MESSAGE */}
                    <div
                      style={{
                        marginTop: "14px",
                        paddingTop: "12px",
                        borderTop: "1px solid #222e35",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 6px 0",
                          fontWeight: "500",
                          fontSize: "12px",
                          color: "#8696a0",
                        }}
                      >
                        Last message
                      </p>
                      <p
                        style={{
                          margin: 0,
                          color: "#d1d7db",
                          fontSize: "13px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {conversation.last_message_text || "No message"}
                      </p>
                    </div>

                    {/* DETAILS */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        marginTop: "12px",
                        fontSize: "12px",
                        color: "#8696a0",
                      }}
                    >
                      <span>Unread: {conversation.unread_count ?? 0}</span>
                      <span>
                        Created:{" "}
                        {conversation.created_at
                          ? new Date(
                              conversation.created_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                      <span
                        style={{
                          marginLeft: "auto",
                          color: "#00a884",
                          fontWeight: "600",
                        }}
                      >
                        Open chat →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "campaigns":
        return <CampaignsPage />;
      case "contacts":
        return <ContactsPage />;
      case "astra":
      case "agents":
        return <AstraPage />;
      case "billing":
        return <BillingPage />;
      case "automations":
        return <AutomationPage />;
      case "commerce":
        return <CommercePage />;
      case "ads":
        return <AdsPage />;
      case "api":
        return <ApiPage />;
      case "integrations":
        return <IntegrationsPage />;

      default:
        return <WAAnalytics />;
    }
  };

  return (
    <div className="agent-dashboard-layout">
      <WhatsAppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="agent-dashboard-main">{renderContent()}</div>
    </div>
  );
};

export default WhatsappDashboard;
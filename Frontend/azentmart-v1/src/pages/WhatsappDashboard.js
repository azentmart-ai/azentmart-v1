import React, { useEffect, useState } from "react";
import WhatsAppSidebar from "../components/WhatsAppSidebar";
import WAAnalytics from "../components/WAAnalytics";

const WhatsappDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  // Backend conversation data
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD CONVERSATIONS FROM BACKEND
  // ============================================================
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      setError("");

      try {
        // React proxy forwards this to:
        // http://localhost:3000/api/azentmart/conversations
        const response = await fetch(
          "/api/azentmart/conversations"
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        console.log("Conversations received from backend:", data);

        // Backend currently returns an array
        setConversations(Array.isArray(data) ? data : []);
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
                margin: "0 0 25px 0",
              }}
            >
              WhatsApp conversations from your backend.
            </p>

            {/* LOADING */}
            {loading && (
              <div
                style={{
                  padding: "20px",
                  background: "#fff",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
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
                  border: "1px solid #fecdd3",
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
                    border: "1px solid #e5e7eb",
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
                    There are currently no WhatsApp
                    conversations.
                  </p>
                </div>
              )}

            {/* CONVERSATION LIST */}
            {!loading &&
              !error &&
              conversations.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "20px",
                        boxShadow:
                          "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      {/* CONTACT + STATUS */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "20px",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              margin: "0 0 6px 0",
                              fontSize: "18px",
                              fontWeight: "600",
                            }}
                          >
                            {conversation.contact?.name ||
                              "Unknown Contact"}
                          </h3>

                          <p
                            style={{
                              margin: 0,
                              color: "#666",
                            }}
                          >
                            {conversation.contact?.phone ||
                              "No phone number"}
                          </p>
                        </div>

                        {/* STATUS */}
                        <span
                          style={{
                            padding: "5px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
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
                            whiteSpace: "nowrap",
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
                          borderTop: "1px solid #eee",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 8px 0",
                            fontWeight: "500",
                          }}
                        >
                          Last message
                        </p>

                        <p
                          style={{
                            margin: 0,
                            color: "#555",
                          }}
                        >
                          {conversation.last_message_text ||
                            "No message"}
                        </p>
                      </div>

                      {/* DETAILS */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "25px",
                          marginTop: "15px",
                          fontSize: "13px",
                          color: "#777",
                        }}
                      >
                        <span>
                          Unread:{" "}
                          {conversation.unread_count ?? 0}
                        </span>

                        <span>
                          Created:{" "}
                          {conversation.created_at
                            ? new Date(
                                conversation.created_at
                              ).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        );

      // ========================================================
      // CHAT
      // ========================================================
      case "chat":
        return (
          <div style={{ padding: "30px" }}>
            <h1>AI Chat Page</h1>
          </div>
        );

      // ========================================================
      // CAMPAIGNS
      // ========================================================
      case "campaigns":
        return (
          <div style={{ padding: "30px" }}>
            <h1>Campaigns Page</h1>
          </div>
        );

      // ========================================================
      // BROADCAST
      // ========================================================
      case "broadcast":
        return (
          <div style={{ padding: "30px" }}>
            <h1>Broadcast Page</h1>
          </div>
        );

      // ========================================================
      // CONTACTS
      // ========================================================
      case "contacts":
        return (
          <div style={{ padding: "30px" }}>
            <h1>Contacts Page</h1>
          </div>
        );

      // ========================================================
      // ASTRA
      // ========================================================
      case "astra":
        return (
          <div style={{ padding: "30px" }}>
            <h1>Astra Page</h1>
          </div>
        );

      // ========================================================
      // AUTOMATIONS
      // ========================================================
      case "automations":
        return (
          <div style={{ padding: "30px" }}>
            <h1>Automations Page</h1>
          </div>
        );

      // ========================================================
      // COMMERCE
      // ========================================================
      case "commerce":
        return (
          <div style={{ padding: "30px" }}>
            <h1>Commerce Page</h1>
          </div>
        );

      // ========================================================
      // ADS
      // ========================================================
      case "ads":
        return (
          <div style={{ padding: "30px" }}>
            <h1>Ads Page</h1>
          </div>
        );

      // ========================================================
      // API
      // ========================================================
      case "api":
        return (
          <div style={{ padding: "30px" }}>
            <h1>API Page</h1>
          </div>
        );

      // ========================================================
      // INTEGRATIONS
      // ========================================================
      case "integrations":
        return (
          <div style={{ padding: "30px" }}>
            <h1>Integrations Page</h1>
          </div>
        );

      // ========================================================
      // WEBHOOKS
      // ========================================================
      case "webhooks":
        return (
          <div style={{ padding: "30px" }}>
            <h1>Webhooks Page</h1>
          </div>
        );

      // ========================================================
      // USER MANAGEMENT
      // ========================================================
      case "user-management":
        return (
          <div style={{ padding: "30px" }}>
            <h1>User Management</h1>
          </div>
        );

      // ========================================================
      // ACCOUNT
      // ========================================================
      case "account":
        return (
          <div style={{ padding: "30px" }}>
            <h1>Account Details</h1>
          </div>
        );

      // ========================================================
      // CHANNELS
      // ========================================================
      case "channels":
        return (
          <div style={{ padding: "30px" }}>
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
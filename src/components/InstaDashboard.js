import React, { useEffect, useState } from "react";
import logo from "../assets/logo.jpeg";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const API_BASE_URL = "http://localhost:3000";

export default function InstaDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Real conversations from backend
  const [conversations, setConversations] = useState([]);

  // Currently selected conversation
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Messages of selected conversation
  const [messages, setMessages] = useState([]);

  // Loading states
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Error message
  const [error, setError] = useState("");

  // Message input
  const [newMessage, setNewMessage] = useState("");

  // Sending state
  const [sendingMessage, setSendingMessage] = useState(false);

  // Leads states
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Temporary dashboard data
  const messageData = [
    { day: "Mon", messages: 120 },
    { day: "Tue", messages: 200 },
    { day: "Wed", messages: 150 },
    { day: "Thu", messages: 300 },
    { day: "Fri", messages: 250 },
    { day: "Sat", messages: 400 },
    { day: "Sun", messages: 350 },
  ];

  // =========================================================
  // 1. FETCH CONVERSATIONS FROM BACKEND
  // =========================================================

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/conversations`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();

      setConversations(Array.isArray(data) ? data : []);

      // Automatically select first conversation
      if (Array.isArray(data) && data.length > 0) {
        setSelectedConversation((current) => {
          if (current) return current;
          return data[0];
        });
      }
    } catch (err) {
      console.error("Conversation fetch error:", err);
      setError("Unable to load Instagram conversations.");
    } finally {
      setLoadingConversations(false);
    }
  };

  // Fetch conversations when dashboard opens
  useEffect(() => {
    fetchConversations();
  }, []);

  // =========================================================
  // 2. FETCH MESSAGES FOR SELECTED CONVERSATION
  // =========================================================

  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;

    try {
      setLoadingMessages(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/conversations/${conversationId}/messages`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();

      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Messages fetch error:", err);
      setError("Unable to load conversation messages.");
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Fetch messages whenever selected conversation changes
  useEffect(() => {
    if (selectedConversation?.id) {
      fetchMessages(selectedConversation.id);
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  // =========================================================
  // 3. FETCH LEADS FROM BACKEND
  // =========================================================

  const fetchLeads = async () => {
    try {
      setLoadingLeads(true);

      const res = await fetch("http://localhost:3000/api/leads");

      if (!res.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data = await res.json();

      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLeads([]);
    } finally {
      setLoadingLeads(false);
    }
  };

  // =========================================================
  // 4. SELECT CONVERSATION
  // =========================================================

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  // =========================================================
  // 5. SEND MANUAL MESSAGE
  // =========================================================

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!selectedConversation?.id) {
      alert("Please select a conversation first.");
      return;
    }

    try {
      setSendingMessage(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/conversations/${selectedConversation.id}/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: newMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to send message");
      }

      // Add returned message immediately
      setMessages((currentMessages) => [
        ...currentMessages,
        data,
      ]);

      setNewMessage("");

      // Refresh conversations so updated_at changes
      fetchConversations();
    } catch (err) {
      console.error("Send message error:", err);
      setError(
        err.message || "Unable to send Instagram message."
      );
    } finally {
      setSendingMessage(false);
    }
  };

  // =========================================================
  // 6. ENTER KEY TO SEND
  // =========================================================

  const handleMessageKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // =========================================================
  // 7. CALCULATE TOTAL MESSAGES
  // =========================================================

  const totalMessages = conversations.reduce(
    (total, conversation) => {
      return total + Number(conversation.message_count || 0);
    },
    0
  );

  return (
    <div className="pd-wrapper">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <div className="pd-sidebar">

        <img
          src={logo}
          alt="logo"
          className="pd-logo"
        />

        <ul>

          <li
            className={
              activeTab === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("dashboard")
            }
          >
            Dashboard
          </li>

          <li
            className={
              activeTab === "conversations"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("conversations")
            }
          >
            Conversations
          </li>

          <li
            className={
              activeTab === "leads"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("leads")
            }
          >
            Leads
          </li>

          <li
            className={
              activeTab === "settings"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("settings")
            }
          >
            Settings
          </li>

        </ul>
      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="pd-main">

        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            style={{
              padding: "10px",
              marginBottom: "15px",
              background: "#3b1f1f",
              color: "#ff8a8a",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}

        {/* =================================================
            DASHBOARD
        ================================================== */}

        {activeTab === "dashboard" && (
          <>
            <div className="pd-top">

              <h3>Instagram Dashboard</h3>

              <button className="upgrade-btn">
                Upgrade
              </button>

            </div>

            <div className="pd-stats">

              <div className="pd-card">
                💬 {totalMessages || 0} Messages
              </div>

              <div className="pd-card">
                📩 {conversations.length} Conversations
              </div>

              <div className="pd-card">
                📈 18% Conversion
              </div>

              <div className="pd-card">
                ⚡ 1.2s Response
              </div>

            </div>

            <div className="pd-analytics">

              <div className="pd-chart-card">

                <h4>Messages</h4>

                <ResponsiveContainer
                  width="100%"
                  height={250}
                >
                  <LineChart data={messageData}>

                    <XAxis
                      dataKey="day"
                      stroke="#ccc"
                    />

                    <YAxis stroke="#ccc" />

                    <Tooltip />

                    <Line
                      dataKey="messages"
                      stroke="#ff4d6d"
                    />

                  </LineChart>
                </ResponsiveContainer>

              </div>

              <div className="pd-chart-card">

                <h4>Leads</h4>

                <ResponsiveContainer
                  width="100%"
                  height={250}
                >
                  <BarChart data={messageData}>

                    <XAxis
                      dataKey="day"
                      stroke="#ccc"
                    />

                    <YAxis stroke="#ccc" />

                    <Tooltip />

                    <Bar
                      dataKey="messages"
                      fill="#7b3ff2"
                    />

                  </BarChart>
                </ResponsiveContainer>

              </div>

            </div>
          </>
        )}

        {/* =================================================
            CONVERSATIONS
        ================================================== */}

        {activeTab === "conversations" && (
          <div className="pd-grid">

            {/* CHAT LIST */}

            <div className="pd-chat-list">

              <h3 style={{ padding: "10px" }}>
                Instagram Conversations
              </h3>

              {loadingConversations ? (
                <div style={{ padding: "15px" }}>
                  Loading conversations...
                </div>
              ) : conversations.length === 0 ? (
                <div style={{ padding: "15px" }}>
                  No Instagram conversations yet.
                </div>
              ) : (
                conversations.map((conversation) => (

                  <div
                    key={conversation.id}
                    className={`pd-chat-item ${
                      selectedConversation?.id ===
                      conversation.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectConversation(
                        conversation
                      )
                    }
                  >

                    <div className="avatar"></div>

                    <span>
                      {conversation.name ||
                        conversation.username ||
                        `User ${conversation.igsid}`}
                    </span>

                  </div>

                ))
              )}

            </div>

            {/* CHAT WINDOW */}

            <div className="pd-chat-window">

              {selectedConversation ? (
                <>

                  <div className="pd-chat-header">

                    {selectedConversation.name ||
                      selectedConversation.username ||
                      "Instagram User"}

                  </div>

                  <div className="pd-messages">

                    {loadingMessages ? (

                      <div>
                        Loading messages...
                      </div>

                    ) : messages.length === 0 ? (

                      <div>
                        No messages yet.
                      </div>

                    ) : (

                      messages.map((message) => (

                        <div
                          key={message.id}
                          className={
                            message.role === "user"
                              ? "msg left"
                              : "msg right"
                          }
                        >
                          {message.content}
                        </div>

                      ))

                    )}

                  </div>

                  {/* MESSAGE INPUT */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      padding: "10px",
                    }}
                  >

                    <input
                      type="text"
                      value={newMessage}
                      onChange={(event) =>
                        setNewMessage(
                          event.target.value
                        )
                      }
                      onKeyDown={
                        handleMessageKeyDown
                      }
                      placeholder="Type a message..."
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #444",
                      }}
                    />

                    <button
                      className="save-btn"
                      onClick={handleSendMessage}
                      disabled={sendingMessage}
                    >
                      {sendingMessage
                        ? "Sending..."
                        : "Send"}
                    </button>

                  </div>

                </>
              ) : (

                <div style={{ padding: "30px" }}>
                  Select a conversation
                </div>

              )}

            </div>

          </div>
        )}

        {/* =================================================
            LEADS
        ================================================== */}

        {activeTab === "leads" && (
          <div className="pd-leads">

            <h3>Captured Leads</h3>

            <button
              className="save-btn"
              onClick={fetchLeads}
              disabled={loadingLeads}
              style={{ marginBottom: "20px" }}
            >
              {loadingLeads ? "Loading..." : "Refresh Leads"}
            </button>

            {leads.length === 0 && !loadingLeads ? (
              <p>No leads found.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "15px",
                }}
              >
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    style={{
                      background: "#27366f",
                      padding: "18px",
                      borderRadius: "12px",
                      color: "white",
                    }}
                  >
                    <h4>
                      {lead.name ||
                        lead.username ||
                        `Instagram User ${lead.igsid}`}
                    </h4>

                    <p>
                      <strong>Instagram ID:</strong>{" "}
                      {lead.igsid}
                    </p>

                    <p>
                      <strong>Username:</strong>{" "}
                      {lead.username || "Not available"}
                    </p>

                    <p>
                      <strong>Followers:</strong>{" "}
                      {lead.follower_count ?? "Not available"}
                    </p>

                    <p>
                      <strong>Created:</strong>{" "}
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleString()
                        : "Not available"}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* =================================================
            SETTINGS
        ================================================== */}

        {activeTab === "settings" && (
          <div className="pd-settings">

            <h3>Agent Settings</h3>

            <label>
              Welcome Message
            </label>

            <input
              placeholder="Hey 👋 How can I help you?"
            />

            <label>
              <input type="checkbox" />
              Auto Reply
            </label>

            <label>
              <input type="checkbox" />
              Capture Leads
            </label>

            <button className="save-btn">
              Save Settings
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
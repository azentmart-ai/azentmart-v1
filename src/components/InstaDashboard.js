import React, { useState } from "react";
import logo from "../assets/logo.jpeg";



import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

export default function InstaDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedChat, setSelectedChat] = useState("Rahul");

  const chats = ["Rahul", "Priya", "Amit", "Sneha"];

  const messageData = [
    { day: "Mon", messages: 120 },
    { day: "Tue", messages: 200 },
    { day: "Wed", messages: 150 },
    { day: "Thu", messages: 300 },
    { day: "Fri", messages: 250 },
    { day: "Sat", messages: 400 },
    { day: "Sun", messages: 350 },
  ];

  const leads = [
    { name: "Rahul", email: "rahul@gmail.com", time: "2 mins ago" },
    { name: "Priya", email: "priya@gmail.com", time: "10 mins ago" },
  ];

  return (
    <div className="pd-wrapper">

      {/* SIDEBAR */}
      <div className="pd-sidebar">
        <img src={logo} alt="logo" className="pd-logo" />

        <ul>
          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </li>

          <li
            className={activeTab === "conversations" ? "active" : ""}
            onClick={() => setActiveTab("conversations")}
          >
            Conversations
          </li>

          <li
            className={activeTab === "leads" ? "active" : ""}
            onClick={() => setActiveTab("leads")}
          >
            Leads
          </li>

          <li
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="pd-main">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <div className="pd-top">
              <h3>Dashboard</h3>
              <button className="upgrade-btn">Upgrade</button>
            </div>

            <div className="pd-stats">
              <div className="pd-card">💬 1,245 Messages</div>
              <div className="pd-card">📩 320 Leads</div>
              <div className="pd-card">📈 18% Conversion</div>
              <div className="pd-card">⚡ 1.2s Response</div>
            </div>

            <div className="pd-analytics">
              <div className="pd-chart-card">
                <h4>Messages</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={messageData}>
                    <XAxis dataKey="day" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Line dataKey="messages" stroke="#ff4d6d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="pd-chart-card">
                <h4>Leads</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={messageData}>
                    <XAxis dataKey="day" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Bar dataKey="messages" fill="#7b3ff2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* CONVERSATIONS */}
        {activeTab === "conversations" && (
          <div className="pd-grid">

            <div className="pd-chat-list">
              {chats.map((c, i) => (
                <div
                  key={i}
                  className={`pd-chat-item ${selectedChat === c ? "active" : ""}`}
                  onClick={() => setSelectedChat(c)}
                >
                  <div className="avatar"></div>
                  <span>{c}</span>
                </div>
              ))}
            </div>

            <div className="pd-chat-window">
              <div className="pd-chat-header">{selectedChat}</div>

              <div className="pd-messages">
                <div className="msg left">Hi 👋</div>
                <div className="msg right">Hey! How can I help?</div>
                <div className="msg right gradient">Check this offer 🎉</div>
              </div>
            </div>

          </div>
        )}

        {/* LEADS */}
        {activeTab === "leads" && (
          <div className="pd-leads">
            <h3>Captured Leads</h3>

            {leads.map((lead, i) => (
              <div key={i} className="lead-row">
                <span>{lead.name}</span>
                <span>{lead.email}</span>
                <span>{lead.time}</span>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="pd-settings">
            <h3>Agent Settings</h3>

            <label>Welcome Message</label>
            <input placeholder="Hey 👋 How can I help you?" />

            <label>
              <input type="checkbox" /> Auto Reply
            </label>

            <label>
              <input type="checkbox" /> Capture Leads
            </label>

            <button className="save-btn">Save Settings</button>
          </div>
        )}

      </div>
    </div>
  );
}
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

export default function FacebookDashboard() {
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
    <div className="fbd-wrapper">

      {/* SIDEBAR */}
      <div className="fbd-sidebar">
        <img src={logo} alt="logo" className="fbd-logo" />

        <ul>
          <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>Dashboard</li>
          <li className={activeTab === "conversations" ? "active" : ""} onClick={() => setActiveTab("conversations")}>Conversations</li>
          <li className={activeTab === "leads" ? "active" : ""} onClick={() => setActiveTab("leads")}>Leads</li>
          <li className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>Settings</li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="fbd-main">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <div className="fbd-top">
              <h3>Performance Analytics</h3>
              <button className="fbd-upgrade-btn">Upgrade</button>
            </div>

            <div className="fbd-stats">
              <div className="fbd-card">💬 1,245 Messages</div>
              <div className="fbd-card">📩 320 Leads</div>
              <div className="fbd-card">📈 18% Conversion</div>
              <div className="fbd-card">⚡ 1.2s Response</div>
            </div>

            <div className="fbd-analytics">
              <div className="fbd-chart-card">
                <h4>Messages</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={messageData}>
                    <XAxis dataKey="day" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Line dataKey="messages" stroke="#1877f2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="fbd-chart-card">
                <h4>Leads</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={messageData}>
                    <XAxis dataKey="day" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Bar dataKey="messages" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* CONVERSATIONS */}
        {activeTab === "conversations" && (
          <div className="fbd-grid">

            <div className="fbd-chat-list">
              {chats.map((c, i) => (
                <div
                  key={i}
                  className={`fbd-chat-item ${selectedChat === c ? "active" : ""}`}
                  onClick={() => setSelectedChat(c)}
                >
                  <div className="fbd-avatar"></div>
                  <span>{c}</span>
                </div>
              ))}
            </div>

            <div className="fbd-chat-window">
              <div className="fbd-chat-header">{selectedChat}</div>

              <div className="fbd-messages">
                <div className="fbd-msg fbd-left">Hi 👋</div>
                <div className="fbd-msg fbd-right">Hey! How can I help?</div>
                <div className="fbd-msg fbd-right fbd-gradient">Special offer 🎉</div>
              </div>
            </div>

          </div>
        )}

        {/* LEADS */}
        {activeTab === "leads" && (
          <div className="fbd-leads">
            <h3>Captured Leads</h3>

            {leads.map((lead, i) => (
              <div key={i} className="fbd-lead-row">
                <span>{lead.name}</span>
                <span>{lead.email}</span>
                <span>{lead.time}</span>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="fbd-settings">
            <h3>Agent Settings</h3>

            <label>Welcome Message</label>
            <input placeholder="Hey 👋 How can I help you?" />

            <label><input type="checkbox" /> Auto Reply</label>
            <label><input type="checkbox" /> Capture Leads</label>

            <button className="fbd-save-btn">Save Settings</button>
          </div>
        )}

      </div>
    </div>
  );
}
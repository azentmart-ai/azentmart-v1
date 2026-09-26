import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

/* COLORS */
const STATUS_COLORS = {
  Opened: "#A5D6A7",
  Pending: "#FFE082",
  Solved: "#90CAF9",
  "Solved by operator": "#80CBC4",
  "Solved by bot": "#CE93D8",
  Expired: "#FFAB91",
  "Missed chats": "#B0BEC5",
};

const COLORS = ["#4caf50", "#ff9800", "#2196f3", "#CE93D8"];

const WAAnalytics = () => {
  const [preview, setPreview] = useState(true);

  /* ---------------- MAIN DATA ---------------- */
  const sampleLineData = [
    { date: "15 May", open: 3, pending: 1, solved: 2, bot: 1 },
    { date: "01 Jun", open: 2, pending: 1, solved: 0, bot: 0 },
    { date: "15 Jun", open: 9, pending: 2, solved: 6, bot: 4 },
    { date: "01 Jul", open: 5, pending: 1, solved: 3, bot: 2 },
    { date: "15 Jul", open: 7, pending: 2, solved: 4, bot: 3 },
    { date: "01 Aug", open: 4, pending: 1, solved: 2, bot: 1 },
  ];

  const sampleBarData = [
    { name: "Opened", value: 2 },
    { name: "Pending", value: 0 },
    { name: "Solved", value: 99 },
    { name: "Solved by operator", value: 68 },
    { name: "Solved by bot", value: 31 },
    { name: "Expired", value: 140 },
    { name: "Missed chats", value: 127 },
  ];

  /* ---------------- MESSAGE DATA ---------------- */
  const messageLine = [
    { date: "15 May", sent: 40, received: 35 },
    { date: "01 Jun", sent: 30, received: 25 },
    { date: "15 Jun", sent: 120, received: 60 },
    { date: "01 Jul", sent: 60, received: 50 },
    { date: "15 Jul", sent: 90, received: 70 },
    { date: "01 Aug", sent: 30, received: 20 },
  ];

  const messageType = [
    { date: "15 May", session: 80, campaign: 5, sms: 2 },
    { date: "01 Jun", session: 60, campaign: 10, sms: 3 },
    { date: "15 Jun", session: 170, campaign: 30, sms: 5 },
    { date: "01 Jul", session: 90, campaign: 8, sms: 2 },
    { date: "15 Jul", session: 150, campaign: 20, sms: 4 },
  ];

  /* ---------------- TABLE ---------------- */
  const users = [
    {
      name: "Samson",
      email: "samson@productsupport.com",
      open: 10,
      pending: 6,
      assigned: 30,
      solved: 11,
      expired: 2,
      missed: 5,
    },
    {
      name: "Rahul Verma",
      email: "rahul.verma@productsupport.com",
      open: 6,
      pending: 4,
      assigned: 20,
      solved: 15,
      expired: 1,
      missed: 1,
    },
  ];

  /* ---------------- PIE + BAR ---------------- */
  const pieData = [
    { name: "Sent", value: 400 },
    { name: "Delivered", value: 300 },
    { name: "Failed", value: 100 },
    { name: "Unread", value: 50 },
  ];

  const barType = [
    { name: "Service", value: 100 },
    { name: "Marketing", value: 340 },
    { name: "Utility", value: 250 },
    { name: "Auth", value: 220 },
  ];

  /* ---------------- EMPTY DATA ---------------- */
  const zeroLine = sampleLineData.map(d => ({ ...d, open:0,pending:0,solved:0,bot:0 }));
  const zeroBar = sampleBarData.map(d => ({ ...d, value:0 }));
  const zeroMsgLine = messageLine.map(d => ({ ...d, sent:0, received:0 }));
  const zeroMsgType = messageType.map(d => ({ ...d, session:0,campaign:0,sms:0 }));
  const zeroUsers = users.map(u => ({ ...u, open:0,pending:0,assigned:0,solved:0,expired:0,missed:0 }));
  const zeroPie = pieData.map(p => ({ ...p, value:0 }));
  const zeroBarType = barType.map(b => ({ ...b, value:0 }));

  /* ---------------- FINAL DATA ---------------- */
  const lineData = preview ? sampleLineData : zeroLine;
  const barData = preview ? sampleBarData : zeroBar;
  const finalMsgLine = preview ? messageLine : zeroMsgLine;
  const finalMsgType = preview ? messageType : zeroMsgType;
  const finalUsers = preview ? users : zeroUsers;
  const finalPie = preview ? pieData : zeroPie;
  const finalBarType = preview ? barType : zeroBarType;

  return (
    <div className="wa-container">

      {/* HEADER */}
      <div className="wa-header">
        <div>
          <h2>Team Inbox Analytics</h2>
          <p className="subtitle">
            Get an overview of all your important team, operator and ticket metrics here
          </p>
        </div>

        <div className="wa-toggle-box">
          <span>Preview with sample data</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={preview}
              onChange={() => setPreview(!preview)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* BANNER */}
      {preview && (
        <div className="wa-banner">
          ⚠ Data shown is for representation purpose only
        </div>
      )}

      {/* CARDS */}
      <div className="wa-overview">
        {barData.map((item, i) => (
          <div className="wa-card" key={i}>
            <h3>{item.value}</h3>
            <p>{item.name}</p>
          </div>
        ))}
      </div>

      {/* MAIN CHARTS */}
      <div className="wa-grid">
        <div className="wa-card-box">
          <h3>Ticket status over time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="open" stroke="#64B5F6" />
              <Line dataKey="pending" stroke="#FFB74D" />
              <Line dataKey="solved" stroke="#81C784" />
              <Line dataKey="bot" stroke="#BA68C8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="wa-card-box">
          <h3>Total ticket count by status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <Bar dataKey="value">
                {barData.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Bar>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SENT VS RECEIVED */}
      <div className="wa-card-box">
        <h3>Sent v/s received messages</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={finalMsgLine}>
            <Line dataKey="sent" stroke="#4caf50" />
            <Line dataKey="received" stroke="#ff9800" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SENT TYPE */}
      <div className="wa-card-box">
        <h3>Sent messages by type</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={finalMsgType}>
            <Line dataKey="session" stroke="#4caf50" />
            <Line dataKey="campaign" stroke="#ff9800" />
            <Line dataKey="sms" stroke="#2196f3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TABLE */}
      <div className="wa-card-box">
        <h3>Operator performance</h3>
        <table className="wa-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Open</th>
              <th>Pending</th>
              <th>Assigned</th>
              <th>Solved</th>
              <th>Expired</th>
              <th>Missed</th>
            </tr>
          </thead>
          <tbody>
            {finalUsers.map((u, i) => (
              <tr key={i}>
                <td>
                  <b>{u.name}</b>
                  <div className="email">{u.email}</div>
                </td>
                <td>{u.open}</td>
                <td>{u.pending}</td>
                <td>{u.assigned}</td>
                <td>{u.solved}</td>
                <td>{u.expired}</td>
                <td>{u.missed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PIE + BAR */}
      <div className="wa-grid">
        <div className="wa-card-box">
          <h3>Message delivery status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={finalPie} dataKey="value">
                {finalPie.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="wa-card-box">
          <h3>Total messages by type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={finalBarType}>
              <Bar dataKey="value">
                {finalBarType.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WAAnalytics;
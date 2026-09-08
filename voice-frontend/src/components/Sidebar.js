import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [user, setUser] = useState(null);

  const navClass = ({ isActive }) =>
    `sidebar-nav-item ${isActive ? "active" : ""}`;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/api/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch current user");
          return;
        }

        const data = await response.json();

        setUser(data);

        localStorage.setItem("userName", data.name || "");
        localStorage.setItem("userEmail", data.email || "");
        localStorage.setItem("userRole", data.role || "");
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const fullName =
    user?.name ||
    localStorage.getItem("userName") ||
    "User";

  const email =
    user?.email ||
    localStorage.getItem("userEmail") ||
    "";

  const role =
    user?.role ||
    localStorage.getItem("userRole") ||
    "User";

  const avatarLetter = fullName
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <aside className="az-sidebar">

      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="sidebar-brand">

        <div className="brand-mark">
          A
        </div>

        <div className="brand-text">
          <strong>AzentMart</strong>
          <span>AI VOICE</span>
        </div>

        <button
          className="sidebar-collapse"
          type="button"
          aria-label="Collapse sidebar"
        >
          ☰
        </button>

      </div>


      {/* =====================================================
          USER
      ===================================================== */}

      <div className="sidebar-user">

        <div className="sidebar-user-avatar">
          {avatarLetter}
        </div>

        <div className="sidebar-user-info">
          <strong>{fullName}</strong>
          <span>{role}</span>
        </div>

        <span className="sidebar-user-menu">
          •••
        </span>

      </div>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="sidebar-section">

        <div className="sidebar-section-title">
          MAIN
        </div>


        {/* DASHBOARD */}

        <NavLink
          to="/dashboard"
          end
          className={navClass}
        >
          <span className="sidebar-nav-icon">
            ▦
          </span>

          <span className="sidebar-nav-label">
            Dashboard
          </span>
        </NavLink>


        {/* AI CHAT */}

        <NavLink
          to="/dashboard/ai-chat"
          className={navClass}
        >
          <span className="sidebar-nav-icon">
            ◉
          </span>

          <span className="sidebar-nav-label">
            AI Chat
          </span>

          <span className="sidebar-badge">
            BETA
          </span>
        </NavLink>


        {/* AI ASSISTANT */}

        <NavLink
          to="/dashboard/ai-assistant"
          className={navClass}
        >
          <span className="sidebar-nav-icon">
            ✦
          </span>

          <span className="sidebar-nav-label">
            AI Assistant
          </span>
        </NavLink>

      </div>


      {/* =====================================================
          VOICE AI
      ===================================================== */}

      <div className="sidebar-section">

        <div className="sidebar-section-title">
          VOICE AI
        </div>


        {/* DIALERS */}

        <NavLink
          to="/dashboard/dialers"
          className={navClass}
        >
          <span className="sidebar-nav-icon">
            ☎
          </span>

          <span className="sidebar-nav-label">
            Dialers
          </span>
        </NavLink>


        {/* KNOWLEDGE BASE */}

        <NavLink
          to="/dashboard/knowledge-base"
          className={navClass}
        >
          <span className="sidebar-nav-icon">
            ▣
          </span>

          <span className="sidebar-nav-label">
            Knowledge Base
          </span>
        </NavLink>


        {/* PLAYGROUND */}

        <NavLink
          to="/dashboard/playground"
          className={navClass}
        >
          <span className="sidebar-nav-icon">
            ▷
          </span>

          <span className="sidebar-nav-label">
            Playground
          </span>
        </NavLink>


        {/* AI CAMPAIGNS */}

        <NavLink
          to="/dashboard/campaigns"
          className={navClass}
        >
          <span className="sidebar-nav-icon">
            📢
          </span>

          <span className="sidebar-nav-label">
            AI Campaigns
          </span>
        </NavLink>


        {/* CALL HISTORY */}

        <NavLink
          to="/dashboard/call-history"
          className={navClass}
        >
          <span className="sidebar-nav-icon">
            ◷
          </span>

          <span className="sidebar-nav-label">
            Call History
          </span>
        </NavLink>

      </div>


      {/* =====================================================
          CRM
      ===================================================== */}

      <div className="sidebar-section">

        <div className="sidebar-section-title">
          CRM
        </div>


        {/* CONTACTS */}

        <NavLink
          to="/dashboard/contacts"
          className={navClass}
        >
          <span className="sidebar-nav-icon">
            ♙
          </span>

          <span className="sidebar-nav-label">
            Contacts
          </span>
        </NavLink>


        {/* =================================================
            UPGRADE
            Opens Billing & Credits
        ================================================= */}

        <NavLink
          to="/dashboard/upgrade"
          className={navClass}
        >
          <span className="sidebar-nav-icon">
            ♢
          </span>

          <span className="sidebar-nav-label">
            Billing & Credits
          </span>
        </NavLink>

      </div>


      {/* =====================================================
          BOTTOM
      ===================================================== */}

      <div className="sidebar-bottom">


        {/* TEAMS */}

        <NavLink
          to="/dashboard/teams"
          className={navClass}
        >
          <span className="sidebar-nav-icon">
            ♧
          </span>

          <span className="sidebar-nav-label">
            Teams
          </span>
        </NavLink>


        {/* BOOK A DEMO */}

        <NavLink
          to="/dashboard/demo"
          className={navClass}
        >
          <span className="sidebar-nav-icon">
            ▣
          </span>

          <span className="sidebar-nav-label">
            Book a Demo
          </span>
        </NavLink>


        {/* INTEGRATIONS */}

        <NavLink
          to="/dashboard/integrations"
          className={navClass}
        >
          <span className="sidebar-nav-icon">
            ♧
          </span>

          <span className="sidebar-nav-label">
            Integrations
          </span>
        </NavLink>


        {/* DOCUMENTATION */}

        <NavLink
          to="/dashboard/documentation"
          className={navClass}
        >
          <span className="sidebar-nav-icon">
            ▤
          </span>

          <span className="sidebar-nav-label">
            Documentation
          </span>
        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;
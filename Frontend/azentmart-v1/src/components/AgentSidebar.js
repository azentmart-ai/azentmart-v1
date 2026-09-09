import React from "react";
import logo from "../assets/logo.jpeg";

import {
  FaTachometerAlt,
  FaRobot,
  FaFlask,
  FaPhone,
  FaBullhorn,
  FaAddressBook,
  FaLayerGroup,
  FaPhoneAlt,
  FaBook,
  FaPuzzlePiece,
  FaFileAlt,
  FaBolt,
  FaSignOutAlt
} from "react-icons/fa";

function AgentSidebar({ activeTab, setActiveTab }) {

  return (

    <div className="agent-sidebar">

      {/* TOP SECTION */}

      <div className="sidebar-top">

        {/* LOGO */}

        <div className="sidebar-logo">
          <img
            src={logo}
            alt="AzentMart AI"
            className="sidebar-logo-img"
          />
        </div>

        {/* USER */}

        <div className="sidebar-user">

          <div className="user-avatar">
            U
          </div>

          <div>
            <p className="user-name">User</p>
            <span className="user-role">Admin</span>
          </div>

        </div>

      </div>


      {/* SCROLLABLE MENU */}

      <div className="sidebar-menu-wrapper">

        <ul className="sidebar-menu">

          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaTachometerAlt /> Dashboard
          </li>

          <li
            className={activeTab === "assistants" ? "active" : ""}
            onClick={() => setActiveTab("assistants")}
          >
            <FaRobot /> Assistants
          </li>

          <li
            className={activeTab === "playground" ? "active" : ""}
            onClick={() => setActiveTab("playground")}
          >
            <FaFlask /> Playground
          </li>

          <li
            className={activeTab === "dialers" ? "active" : ""}
            onClick={() => setActiveTab("dialers")}
          >
            <FaPhone /> Dialers
          </li>

          <li
            className={activeTab === "campaigns" ? "active" : ""}
            onClick={() => setActiveTab("campaigns")}
          >
            <FaBullhorn /> Campaigns
          </li>

          <li
            className={activeTab === "contacts" ? "active" : ""}
            onClick={() => setActiveTab("contacts")}
          >
            <FaAddressBook /> Contacts
          </li>

          <li
            className={activeTab === "segments" ? "active" : ""}
            onClick={() => setActiveTab("segments")}
          >
            <FaLayerGroup /> Segments
          </li>

          <li
            className={activeTab === "logs" ? "active" : ""}
            onClick={() => setActiveTab("logs")}
          >
            <FaPhoneAlt /> Call Logs
          </li>

          <li
            className={activeTab === "knowledge" ? "active" : ""}
            onClick={() => setActiveTab("knowledge")}
          >
            <FaBook /> Knowledge Base
          </li>

          <li
            className={activeTab === "integrations" ? "active" : ""}
            onClick={() => setActiveTab("integrations")}
          >
            <FaPuzzlePiece /> Integrations
          </li>

          <li
            className={activeTab === "docs" ? "active" : ""}
            onClick={() => setActiveTab("docs")}
          >
            <FaFileAlt /> Documentation
          </li>

          <li
            className={activeTab === "upgrade" ? "active" : ""}
            onClick={() => setActiveTab("upgrade")}
          >
            <FaBolt /> Upgrade
          </li>

        </ul>

      </div>


      {/* LOGOUT */}

      <div className="sidebar-logout">

        <FaSignOutAlt />

        <span>Logout</span>

      </div>

    </div>

  );

}

export default AgentSidebar;
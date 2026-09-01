import React from "react";

import logo from "../assets/logo.jpeg";

import {
  FaBullhorn,
  FaInbox,
  FaAddressBook,
  FaCube,
  FaProjectDiagram,
  FaShoppingCart,
  FaAd,
  FaChartPie,
  FaPlug,
  FaCog,
  FaCode,
  FaLink,
  FaCreditCard,
} from "react-icons/fa";

function WhatsAppSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="agent-sidebar">

      {/* TOP */}
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img
            src={logo}
            alt="Logo"
            className="sidebar-logo-img"
          />
        </div>
      </div>

      {/* MENU */}
      <div className="sidebar-menu-wrapper">

        <ul className="sidebar-menu">

          {/* CAMPAIGNS */}
          <li
            className={activeTab === "campaigns" ? "active" : ""}
            onClick={() => setActiveTab("campaigns")}
          >
            <FaBullhorn /> Campaigns
          </li>

          {/* TEAM INBOX */}
          <li
            className={activeTab === "inbox" ? "active" : ""}
            onClick={() => setActiveTab("inbox")}
          >
            <FaInbox /> Team Inbox
          </li>

          {/* CONTACTS */}
          <li
            className={activeTab === "contacts" ? "active" : ""}
            onClick={() => setActiveTab("contacts")}
          >
            <FaAddressBook /> Contacts
          </li>

          {/* AGENTS */}
          <li
            className={activeTab === "astra" ? "active" : ""}
            onClick={() => setActiveTab("astra")}
          >
            <FaCube /> Agents
          </li>

          {/* AUTOMATIONS */}
          <li
            className={activeTab === "automations" ? "active" : ""}
            onClick={() => setActiveTab("automations")}
          >
            <FaProjectDiagram /> Automations
          </li>

          {/* COMMERCE */}
          <li
            className={activeTab === "commerce" ? "active" : ""}
            onClick={() => setActiveTab("commerce")}
          >
            <FaShoppingCart /> Commerce
          </li>

          {/* ADS */}
          <li
            className={activeTab === "ads" ? "active" : ""}
            onClick={() => setActiveTab("ads")}
          >
            <FaAd /> Ads
          </li>

          {/* ANALYTICS */}
          <li
            className={
              activeTab === "analytics"
                ? "active analytics-active"
                : ""
            }
            onClick={() => setActiveTab("analytics")}
          >
            <FaChartPie /> Analytics
          </li>

        </ul>

        {/* CONNECTORS */}
        <p className="menu-heading">
          Connectors
        </p>

        <ul className="sidebar-menu">

          {/* API */}
          <li
            className={activeTab === "api" ? "active" : ""}
            onClick={() => setActiveTab("api")}
          >
            <FaCode /> API
          </li>

          {/* INTEGRATIONS */}
          <li
            className={activeTab === "integrations" ? "active" : ""}
            onClick={() => setActiveTab("integrations")}
          >
            <FaPlug /> Integrations
          </li>

          

        </ul>

        {/* SETTINGS */}
        <p className="menu-heading">
          Settings
        </p>

        <ul className="sidebar-menu">

          {/* BILLING */}
          <li
            className={activeTab === "billing" ? "active" : ""}
            onClick={() => setActiveTab("billing")}
          >
            <FaCreditCard /> Billing
          </li>

          {/* USER MANAGEMENT */}
          <li
            className={activeTab === "user-management" ? "active" : ""}
            onClick={() => setActiveTab("user-management")}
          >
            <FaCog /> User Management
          </li>

          {/* ACCOUNT DETAILS */}
          <li
            className={activeTab === "account" ? "active" : ""}
            onClick={() => setActiveTab("account")}
          >
            <FaCog /> Account Details
          </li>

          {/* CHANNELS */}
          <li
            className={activeTab === "channels" ? "active" : ""}
            onClick={() => setActiveTab("channels")}
          >
            <FaCog /> Channels
          </li>

        </ul>

      </div>
    </div>
  );
}

export default WhatsAppSidebar;
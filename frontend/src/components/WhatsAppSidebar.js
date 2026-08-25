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
  FaLink
} from "react-icons/fa";

function WhatsAppSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="agent-sidebar">

      {/* TOP */}
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" className="sidebar-logo-img" />
        </div>
      </div>

      {/* MENU */}
      <div className="sidebar-menu-wrapper">

        <ul className="sidebar-menu">

          <li
            className={activeTab === "campaigns" ? "active" : ""}
            onClick={() => setActiveTab("campaigns")}
          >
            <FaBullhorn /> Campaigns
          </li>

          <li
            className={activeTab === "inbox" ? "active" : ""}
            onClick={() => setActiveTab("inbox")}
          >
            <FaInbox /> Team Inbox
          </li>

          <li
            className={activeTab === "contacts" ? "active" : ""}
            onClick={() => setActiveTab("contacts")}
          >
            <FaAddressBook /> Contacts
          </li>

          <li
            className={activeTab === "astra" ? "active" : ""}
            onClick={() => setActiveTab("astra")}
          >
            <FaCube /> Astra
          </li>

          <li
            className={activeTab === "automations" ? "active" : ""}
            onClick={() => setActiveTab("automations")}
          >
            <FaProjectDiagram /> Automations
          </li>

          <li
            className={activeTab === "commerce" ? "active" : ""}
            onClick={() => setActiveTab("commerce")}
          >
            <FaShoppingCart /> Commerce
          </li>

          <li
            className={activeTab === "ads" ? "active" : ""}
            onClick={() => setActiveTab("ads")}
          >
            <FaAd /> Ads
          </li>

          <li
            className={activeTab === "analytics" ? "active analytics-active" : ""}
            onClick={() => setActiveTab("analytics")}
          >
            <FaChartPie /> Analytics
          </li>

        </ul>

        {/* CONNECTORS */}
        <p className="menu-heading">Connectors</p>
        <ul className="sidebar-menu">
          <li onClick={() => setActiveTab("api")}>
            <FaCode /> API
          </li>
          <li onClick={() => setActiveTab("integrations")}>
            <FaPlug /> Integrations
          </li>
          <li onClick={() => setActiveTab("webhooks")}>
            <FaLink /> Webhooks
          </li>
        </ul>

        {/* SETTINGS */}
        <p className="menu-heading">Settings</p>
        <ul className="sidebar-menu">
          <li onClick={() => setActiveTab("user-management")}>
            <FaCog /> User Management
          </li>
          <li onClick={() => setActiveTab("account")}>
            <FaCog /> Account Details
          </li>
          <li onClick={() => setActiveTab("channels")}>
            <FaCog /> Channels
          </li>
        </ul>

      </div>
    </div>
  );
}

export default WhatsAppSidebar;
import React from "react";
import {
  FaPlus,
  FaSearch,
  FaRegFileAlt,
  FaSignature,
  FaLanguage,
  FaFolderOpen,
  FaBell,
  FaTasks,
  FaUniversity,
  FaBookOpen,
  FaBullhorn,
  FaCog,
  FaChevronLeft
} from "react-icons/fa";

import logo from "../assets/logo.jpeg";

function LegalAgentSidebar({ activeMenu, setActiveMenu }) {
  const menuItems = [
    { name: "Research", icon: <FaSearch /> },
    { name: "Draft", icon: <FaRegFileAlt /> },
    { name: "Signatures", icon: <FaSignature />, beta: true },
    { name: "Translation", icon: <FaLanguage /> },
    { name: "Matters", icon: <FaFolderOpen /> },
    { name: "Notices", icon: <FaBell /> },
    { name: "Tasks", icon: <FaTasks /> },
    { name: "Judgments", icon: <FaUniversity /> },
    { name: "Library", icon: <FaBookOpen /> },
    { name: "Changelog", icon: <FaBullhorn /> }
  ];

  return (
    <aside className="legalSidebar">

      <div className="legalSidebarTop">

        <div className="legalLogo">
          <img src={logo} alt="Legal Agent" />
          <span>Legal Agent</span>
        </div>

        <FaChevronLeft className="collapseIcon" />

      </div>

      <button
        className="newResearchBtn"
        onClick={() => setActiveMenu("Research")}
      >
        <FaPlus />
        <span>New Research</span>
      </button>

      <div className="legalMenu">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`legalMenuItem ${
              activeMenu === item.name ? "active" : ""
            }`}
            onClick={() => setActiveMenu(item.name)}
          >
            {item.icon}

            <span>{item.name}</span>

            {item.beta && <small>BETA</small>}
          </div>
        ))}
      </div>

      <hr />

      <div className="recentTitle">Recents</div>

      <div className="legalProfile">

        <div className="avatar">U</div>

        <div className="profileInfo">
          <h5>User</h5>
          <p>user@gmail.com</p>
        </div>

        <FaCog className="settingsIcon" />

      </div>

    </aside>
  );
}

export default LegalAgentSidebar;
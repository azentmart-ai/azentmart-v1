import React, { useState, useEffect } from "react";
import {
  FiFileText,
  FiFolder,
  FiBookOpen,
  FiMessageCircle,
  FiGift,
  FiLogOut,
  FiMoreVertical,
  FiSidebar,
  FiChevronRight,
} from "react-icons/fi";

import { MdGraphicEq } from "react-icons/md";
import logo from "../../assets/logo.jpeg";
import ProfileSection from "./ProfileSection";

const YourAIDashboardSidebar = ({ activePage, setActivePage }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Read logged-in user from localStorage
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setCurrentUser(storedUser);
      }
    } catch (e) {
      console.error("Error reading user data:", e);
    }
  }, []);

  // Extract First & Last Name Initials (e.g. "Bala Raman" -> "BR")
  const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (!parts.length) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const userName = currentUser?.name || "Bala Raman";
  const userEmail = currentUser?.email || "balaraman051002@gmail.com";

  const confirmLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/agents/interview";
  };

  const workspaceMenu = [
    {
      id: "sessions",
      title: "Interview Sessions",
      icon: <MdGraphicEq />,
    },
    {
      id: "resume",
      title: "CVs & Resumes",
      icon: <FiFileText />,
    },
    {
      id: "documents",
      title: "Documents",
      icon: <FiFolder />,
    },
  ];

  const supportMenu = [
    {
      id: "tutorials",
      title: "Tutorials",
      icon: <FiBookOpen />,
    },
    {
      id: "support",
      title: "Support Chat",
      icon: <FiMessageCircle />,
    },
  ];

  return (
    <>
      <aside className="dashboard-sidebar">
        {/* Logo */}
        <div className="dashboard-logo">
          <div className="dashboard-logo-left">
            <img src={logo} alt="AzentMart AI" />
            <h2>AzentMart AI</h2>
          </div>
          <FiSidebar className="dashboard-collapse-icon" />
        </div>

        {/* Sidebar Body */}
        <div className="dashboard-sidebar-body">
          {/* Workspace */}
          <div className="dashboard-menu">
            <h4 className="dashboard-heading">Workspace</h4>

            {workspaceMenu.map((item) => (
              <div
                key={item.id}
                className={`dashboard-menu-item ${activePage === item.id ? "active" : ""
                  }`}
                onClick={() => setActivePage(item.id)}
              >
                <div className="dashboard-icon">{item.icon}</div>
                <span>{item.title}</span>
              </div>
            ))}
          </div>

          {/* Support */}
          <div className="dashboard-menu support-menu">
            <h4 className="dashboard-heading">Support</h4>

            {supportMenu.map((item) => (
              <div
                key={item.id}
                className={`dashboard-menu-item ${activePage === item.id ? "active" : ""
                  }`}
                onClick={() => setActivePage(item.id)}
              >
                <div className="dashboard-icon">{item.icon}</div>
                <span>{item.title}</span>
              </div>
            ))}
          </div>

          {/* Free Plan */}
          <div className="dashboard-plan-card">
            <div className="dashboard-plan-header">
              <div className="dashboard-plan-title">
                <FiGift />
                <span>Free Plan</span>
              </div>
              <FiMoreVertical />
            </div>

            <p>Start your AI interview preparation with the free plan.</p>

            <button
              className="dashboard-upgrade-btn"
              onClick={() => setActivePage("upgrade")}
            >
              Upgrade
            </button>
          </div>

          {/* Bottom Menu - Log Out Button */}
          <div className="dashboard-bottom-menu">
            <div
              className="dashboard-menu-item"
              onClick={() => setShowLogoutModal(true)}
            >
              <div className="dashboard-icon">
                <FiLogOut />
              </div>
              <span>Log Out</span>
            </div>
          </div>
        </div>

        {/* Profile Button */}
        <button
          type="button"
          className="dashboard-profile-btn"
          onClick={() => setShowProfileModal(true)}
        >
          <div className="dashboard-avatar">{getInitials(userName)}</div>

          <div className="dashboard-profile-info">
            <h4>{userName}</h4>
            <p>{userEmail}</p>
          </div>

          <FiChevronRight className="dashboard-profile-arrow" />
        </button>
      </aside>

      {/* Center Profile Popup Modal */}
      {showProfileModal && (
        <ProfileSection
          onClose={() => setShowProfileModal(false)}
          setActivePage={setActivePage}
        />
      )}

      {/* White Themed Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="logout-modal-backdrop"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="logout-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="logout-modal-icon">
              <FiLogOut />
            </div>

            <h3>Log out?</h3>
            <p>You'll need to sign in again to access your dashboard.</p>

            <div className="logout-modal-actions">
              <button
                type="button"
                className="logout-btn-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="logout-btn-confirm"
                onClick={confirmLogout}
              >
                <FiLogOut />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default YourAIDashboardSidebar;
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  FaCog,
  FaSun,
  FaTimes,
  FaUser,
  FaLock,
  FaHeadset,
  FaSignOutAlt,
} from "react-icons/fa";

import Sidebar from "./Sidebar";
import "./DashboardLayout.css";

function DashboardLayout() {
  const navigate = useNavigate();

  const [showSettings, setShowSettings] = useState(false);

  // =========================================================
  // USER STATE
  // =========================================================

  const [userName, setUserName] = useState(
    localStorage.getItem("userName") ||
      localStorage.getItem("azentmart_user_name") ||
      "User"
  );

  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") ||
      localStorage.getItem("azentmart_signup_email") ||
      ""
  );

  // =========================================================
  // LISTEN FOR PROFILE UPDATES
  // =========================================================

  useEffect(() => {
    const updateUser = () => {
      setUserName(
        localStorage.getItem("userName") ||
          localStorage.getItem("azentmart_user_name") ||
          "User"
      );

      setUserEmail(
        localStorage.getItem("userEmail") ||
          localStorage.getItem("azentmart_signup_email") ||
          ""
      );
    };

    window.addEventListener("profileUpdated", updateUser);

    return () => {
      window.removeEventListener("profileUpdated", updateUser);
    };
  }, []);

  // =========================================================
  // USER INITIAL
  // =========================================================

  const userInitial =
    userName.trim().charAt(0).toUpperCase() || "U";

  // =========================================================
  // SETTINGS
  // Only:
  // Profile Settings
  // Set Password
  // Support
  // =========================================================

  const settingsItems = [
    {
      title: "ACCOUNT",
      items: [
        {
          label: "Profile Settings",
          icon: <FaUser />,
          route: "/agents/voice/dashboard/settings/profile",
        },
        {
          label: "Set Password",
          icon: <FaLock />,
          route: "/agents/voice/dashboard/settings/password",
        },
      ],
    },

    {
      title: "HELP",
      items: [
        {
          label: "Support",
          icon: <FaHeadset />,
          route: "/agents/voice/dashboard/settings/support",
        },
      ],
    },
  ];

  // =========================================================
  // SETTINGS CLICK
  // =========================================================

  const handleSettingClick = (item) => {
    setShowSettings(false);
    navigate(item.route);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("azentmart_user_name");
    localStorage.removeItem("azentmart_signup_email");

    setShowSettings(false);

    navigate("/agents/voice/login", {
      replace: true,
    });
  };

  return (
    <div className="dashboard-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />

      <div className="dashboard-main">

        {/* ===================================================
            TOP HEADER
        =================================================== */}

        <header className="dashboard-topbar">

          <div className="topbar-left">
            <div className="topbar-title">
              AI VOICE CONTROL CENTER
            </div>
          </div>

          <div className="topbar-right">

            {/* CREDITS */}
            <div className="credits-info">
              <span>Credits</span>
              <strong>₹82.67</strong>
              <small>/ 10 Min.</small>
            </div>

            {/* USER */}
            <div className="topbar-user">

              <div className="topbar-avatar">
                {userInitial}
              </div>

              <div className="topbar-user-info">
                <strong>
                  {userName.toUpperCase()}
                </strong>

                <span>
                  {userEmail}
                </span>
              </div>

              {/* SETTINGS BUTTON */}
              <button
                type="button"
                className={`settings-trigger ${
                  showSettings
                    ? "settings-trigger-active"
                    : ""
                }`}
                onClick={() =>
                  setShowSettings((prev) => !prev)
                }
                aria-label="Open settings"
              >
                <FaCog />
              </button>

              {/* =================================================
                  SETTINGS PANEL
              ================================================= */}

              {showSettings && (
                <div className="settings-panel">

                  {/* HEADER */}
                  <div className="settings-panel-header">

                    <span>
                      SETTINGS
                    </span>

                    <div className="settings-panel-actions">

                      {/* THEME ICON */}
                      <button
                        type="button"
                        title="Theme"
                      >
                        <FaSun />
                      </button>

                      {/* CLOSE */}
                      <button
                        type="button"
                        title="Close"
                        onClick={() =>
                          setShowSettings(false)
                        }
                      >
                        <FaTimes />
                      </button>

                    </div>
                  </div>

                  {/* SETTINGS ITEMS */}
                  {settingsItems.map((section) => (
                    <div
                      className="settings-group"
                      key={section.title}
                    >

                      <div className="settings-group-title">
                        {section.title}
                      </div>

                      {section.items.map((item) => (
                        <button
                          type="button"
                          className="settings-item"
                          key={item.label}
                          onClick={() =>
                            handleSettingClick(item)
                          }
                        >

                          <span className="settings-item-icon">
                            {item.icon}
                          </span>

                          <span>
                            {item.label}
                          </span>

                        </button>
                      ))}

                    </div>
                  ))}

                  {/* LOGOUT */}
                  <button
                    type="button"
                    className="settings-logout"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />

                    <span>
                      Log Out
                    </span>
                  </button>

                </div>
              )}

            </div>
          </div>

        </header>

        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}

        <main className="dashboard-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;
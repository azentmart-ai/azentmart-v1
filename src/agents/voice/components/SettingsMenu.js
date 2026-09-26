import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Settings,
  UserRound,
  LockKeyhole,
  UsersRound,
  Ban,
  Handshake,
  CreditCard,
  Headphones,
  LogOut,
  X,
  Sun,
} from "lucide-react";

import "./SettingsMenu.css";

function SettingsMenu() {
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");

    setOpen(false);

    navigate("/agents/voice/login");
  };

  return (
    <div className="settings-menu-wrapper" ref={menuRef}>
      {/* SETTINGS BUTTON */}

      <button
        className={`settings-trigger ${open ? "settings-trigger-active" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Open settings"
      >
        <Settings size={18} />
      </button>

      {/* SETTINGS DROPDOWN */}

      {open && (
        <div className="settings-dropdown">
          {/* HEADER */}

          <div className="settings-dropdown-header">
            <span>SETTINGS</span>

            <div className="settings-header-actions">
              <button
                className="settings-theme-button"
                type="button"
                title="Theme"
              >
                <Sun size={15} />
              </button>

              <button
                className="settings-close-button"
                type="button"
                onClick={() => setOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ACCOUNT */}

          <div className="settings-group">
            <div className="settings-group-title">ACCOUNT</div>

            <button
              className="settings-item"
              onClick={() => goTo("/agents/voice/dashboard/settings/profile")}
            >
              <UserRound size={16} />

              <span>Profile Settings</span>
            </button>

            <button
              className="settings-item"
              onClick={() => goTo("/agents/voice/dashboard/settings/password")}
            >
              <LockKeyhole size={16} />

              <span>Set Password</span>
            </button>

            <button
              className="settings-item"
              onClick={() => goTo("/agents/voice/dashboard/settings/teams")}
            >
              <UsersRound size={16} />

              <span>Teams</span>
            </button>

            <button
              className="settings-item"
              onClick={() => goTo("/agents/voice/dashboard/settings/block-list")}
            >
              <Ban size={16} />

              <span>Block List</span>
            </button>
          </div>

          {/* BILLING */}

          <div className="settings-group">
            <div className="settings-group-title">BILLING</div>

            <button
              className="settings-item"
              onClick={() => goTo("/agents/voice/dashboard/affiliates")}
            >
              <Handshake size={16} />

              <span>Affiliates</span>
            </button>

            <button
              className="settings-item"
              onClick={() => goTo("/agents/voice/dashboard/billing")}
            >
              <CreditCard size={16} />

              <span>Billing & Plans</span>
            </button>
          </div>

          {/* HELP */}

          <div className="settings-group">
            <div className="settings-group-title">HELP</div>

            <button
              className="settings-item"
              onClick={() => goTo("/agents/voice/dashboard/support")}
            >
              <Headphones size={16} />

              <span>Support</span>
            </button>
          </div>

          {/* LOGOUT */}

          <div className="settings-logout-container">
            <button
              className="settings-item settings-logout"
              onClick={handleLogout}
            >
              <LogOut size={16} />

              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsMenu;

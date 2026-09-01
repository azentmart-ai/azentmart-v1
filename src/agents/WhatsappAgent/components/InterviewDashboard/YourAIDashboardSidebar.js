import React from "react";
import {
  FiFileText,
  FiFolder,
  FiBookOpen,
  FiMessageCircle,
  FiGift,
  FiLogOut,
  FiMoreVertical,
  FiSidebar,
} from "react-icons/fi";

import { MdGraphicEq } from "react-icons/md";

import logo from "../../assets/logo.jpeg";

const YourAIDashboardSidebar = ({ activePage, setActivePage }) => {

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

          <h4 className="dashboard-heading">
            Workspace
          </h4>

          {workspaceMenu.map((item) => (

            <div
              key={item.id}
              className={`dashboard-menu-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >

              <div className="dashboard-icon">

                {item.icon}

              </div>

              <span>

                {item.title}

              </span>

            </div>

          ))}

        </div>

        {/* Support */}

        <div className="dashboard-menu support-menu">

          <h4 className="dashboard-heading">
            Support
          </h4>

          {supportMenu.map((item) => (

            <div
              key={item.id}
              className={`dashboard-menu-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >

              <div className="dashboard-icon">

                {item.icon}

              </div>

              <span>

                {item.title}

              </span>

            </div>

          ))}

        </div>

        {/* Free Plan */}

        <div className="dashboard-plan-card">

          <div className="dashboard-plan-header">

            <div className="dashboard-plan-title">

              <FiGift />

              <span>
                Free Plan
              </span>

            </div>

            <FiMoreVertical />

          </div>

          <p>

            Start your AI interview preparation with the free plan.

          </p>

        </div>

        {/* Bottom Menu */}

        <div className="dashboard-bottom-menu">

          <div
            className="dashboard-menu-item"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >

            <div className="dashboard-icon">

              <FiLogOut />

            </div>

            <span>

              Log Out

            </span>

          </div>

        </div>

      </div>

      {/* Profile */}

      <div className="dashboard-profile">

        <div className="dashboard-avatar">

          NE

        </div>

        <div className="dashboard-profile-info">

          <h4>

            user

          </h4>

          <p>

            user@gmail.com

          </p>

        </div>

      </div>

    </aside>
  );
};

export default YourAIDashboardSidebar;
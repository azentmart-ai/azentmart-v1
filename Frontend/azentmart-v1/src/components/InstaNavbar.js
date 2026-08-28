import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpeg";

function InstaNavbar({ showMarketplace = true }) {
  const [active, setActive] = useState("");
  const location = useLocation();

  // Scroll detection for Demo section
  useEffect(() => {
    const handleScroll = () => {
      const demoSection = document.getElementById("demo-section");

      if (demoSection) {
        const rect = demoSection.getBoundingClientRect();

        if (rect.top <= 120 && rect.bottom >= 120) {
          setActive("demo");
        } else if (window.scrollY < 100) {
          setActive(""); // back to Home
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid navbar-container">

        {/* LOGO */}
        <img src={logo} alt="logo" className="logo" />

        {/* MOBILE TOGGLE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarContent"
        >
          <ul className="nav-links navbar-nav">

            {/* HOME */}
            <li className="nav-item">
              <NavLink
                to="/instagram-agent"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive && active !== "demo" ? "active" : ""
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            {/* PRICING */}
            <li className="nav-item">
              <NavLink
                to="/pricing"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive && active !== "demo" ? "active" : ""
                  }`
                }
              >
                Pricing
              </NavLink>
            </li>

            {/* MARKETPLACE */}
            {showMarketplace && (
              <li className="nav-item">
                <NavLink
                  to="/marketplace"
                  className={({ isActive }) =>
                    `nav-link ${
                      isActive && active !== "demo" ? "active" : ""
                    }`
                  }
                >
                  Marketplace
                </NavLink>
              </li>
            )}

            {/* DEMO (SCROLL LINK) */}
            <li className="nav-item">
              <button
                className={`nav-link btn ${
                  active === "demo" ? "active" : ""
                }`}
                onClick={() => {
                  document
                    .getElementById("demo-section")
                    ?.scrollIntoView({ behavior: "smooth" });

                  setActive("demo");
                }}
              >
                Demo
              </button>
            </li>

            {/* LOGIN */}
            <li className="nav-item">
              <NavLink to="/instagram-dashboard" className="login-btn">
                Login
              </NavLink>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default InstaNavbar;
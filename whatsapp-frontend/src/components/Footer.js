import React from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import logo from "../assets/logo.jpeg";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Left Section */}

        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logo} alt="AzentMart AI"/>
            <span>AzentMart AI</span>
          </div>

          <p>
            The central hub for discovering, deploying, and managing AI agents
            that transform business operations.
          </p>

          <FaGithub className="footer-icon"/>
        </div>

        {/* Platform */}

        <div className="footer-links">
          <h4>Platform</h4>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/admin">Admin Panel</Link>
        </div>

        {/* Industries */}

        <div className="footer-links">
          <h4>Industries</h4>
          <Link to="#">Sales</Link>
          <Link to="#">HR & Recruitment</Link>
          <Link to="#">Finance</Link>
          <Link to="#">Customer Support</Link>
        </div>

        {/* Company */}

        <div className="footer-links">
          <h4>Company</h4>
          <Link to="#">About Us</Link>
          <Link to="#">Blog</Link>
          <Link to="#">Contact</Link>
          <Link to="#">Privacy Policy</Link>
        </div>

      </div>

      {/* Bottom */}

      <div className="footer-bottom">
        <p>© 2026 AzentMart AI. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;
import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaGithub, FaLinkedinIn } from "react-icons/fa";
import logo from "../assets/azentmart-logo.png";

function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="az-global-footer">
      <div className="az-footer-main">
        <div className="az-footer-brand">
          <Link to="/" className="az-footer-logo" onClick={scrollTop}>
            <img src={logo} alt="AzentMart AI" />
          </Link>
          <p>Discover, deploy and manage AI agents that turn business context into action.</p>
          <div className="az-footer-socials">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
          </div>
        </div>

        <div className="az-footer-column">
          <span>Platform</span>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/#platform">AI platform</Link>
          <Link to="/#orchestration">Orchestration</Link>
          <Link to="/pricing">Pricing</Link>
        </div>
        <div className="az-footer-column">
          <span>Solutions</span>
          <Link to="/#teams">Sales</Link>
          <Link to="/#teams">HR & Recruitment</Link>
          <Link to="/#teams">Finance</Link>
          <Link to="/#teams">Customer Support</Link>
        </div>
        <div className="az-footer-column">
          <span>Company</span>
          <Link to="/#testimonials">Customer stories</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/signin">Sign in</Link>
          <Link to="/marketplace">Get started <FaArrowRight /></Link>
        </div>
      </div>

      <div className="az-footer-bottom">
        <span>© 2026 AzentMart AI. All rights reserved.</span>
        <button type="button" onClick={scrollTop}>Back to top ↑</button>
      </div>
    </footer>
  );
}

export default Footer;

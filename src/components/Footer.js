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
          <Link to="/" className="az-footer-logo" onClick={scrollTop}><img src={logo} alt="AzentMart AI" /></Link>
          <p>The AI Workforce Platform for Businesses.</p>
          <div className="az-footer-socials"><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a><a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a></div>
        </div>
        <div className="az-footer-column"><span>Platform</span><Link to="/#solution">AI Workforce</Link><Link to="/#employees">AI Employees</Link><Link to="/#how-it-works">How It Works</Link><Link to="/marketplace">Agents</Link></div>
        <div className="az-footer-column"><span>Solutions</span><Link to="/#industries">Industries</Link><Link to="/#employees">Business Functions</Link><Link to="/#why-azentmart">Why AzentMart</Link><Link to="/#pricing">Pricing</Link></div>
        <div className="az-footer-column"><span>Company</span><Link to="/company/about">About AzentMart</Link><Link to="/company/leadership">Leadership Team</Link><Link to="/company/culture">Culture</Link><Link to="/company/careers">Careers</Link><Link to="/company/contact">Contact Us</Link></div>
        <div className="az-footer-column"><span>Legal</span><Link to="/privacy-policy">Privacy Policy</Link><Link to="/signin">Sign in</Link><Link to="/#final-cta">Book Free Demo <FaArrowRight /></Link></div>
      </div>
      <div className="az-footer-bottom"><span>© 2026 AzentMart AI. All rights reserved.</span><button type="button" onClick={scrollTop}>Back to top ↑</button></div>
    </footer>
  );
}
export default Footer;

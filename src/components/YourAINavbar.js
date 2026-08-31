import React, { useState } from "react";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const YourAINavbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Solutions", href: "#solutions" },
    { name: "Pricing", href: "#pricing" },
    { name: "Resources", href: "#resources" },
    { name: "Contact", href: "#contact" },
  ];

  return (

    <header className="your-ai-navbar">

      <div className="your-ai-navbar-container">

        {/* Logo */}
        <a href="/" className="your-ai-logo">
          <img src={logo} alt="AzentMart AI" />
        </a>

        {/* Navigation */}
        <nav className="your-ai-nav-links">
          {navLinks.map((item) => (
            <a key={item.name} href={item.href}>
              {item.name}
            </a>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="your-ai-nav-buttons">

          <button
            className="your-ai-login-btn"
            onClick={() => navigate("/auth?mode=login")}
          >
            Login
          </button>

          <button
            className="your-ai-start-btn"
            onClick={() => navigate("/auth?mode=signup")}
          >
            Get Started
          </button>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="your-ai-mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
        </button>

      </div>

      {/* Mobile Menu */}
      <div
        className={`your-ai-mobile-menu ${
          menuOpen ? "your-ai-mobile-menu-open" : ""
        }`}
      >

        {navLinks.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={() => setMenuOpen(false)}
          >
            {item.name}
          </a>
        ))}

        <button
          className="your-ai-login-btn your-ai-mobile-btn"
          onClick={() => {
            setMenuOpen(false);
            navigate("/auth?mode=login");
          }}
        >
          Login
        </button>

        <button
          className="your-ai-start-btn your-ai-mobile-btn"
          onClick={() => {
            setMenuOpen(false);
            navigate("/auth?mode=signup");
          }}
        >
          Get Started
        </button>

      </div>

    </header>

  );

};

export default YourAINavbar;
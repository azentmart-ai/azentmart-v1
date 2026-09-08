import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/azentmart-logo.png";

function Navbar({ showMarketplace = true }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const toggleMenu = (menu) => setOpenMenu((current) => current === menu ? null : menu);

  return (
    <header className="az-global-nav" ref={navRef}>
      <div className="az-nav-shell">
        <Link to="/" className="az-nav-brand" aria-label="AzentMart AI home">
          <img src={logo} alt="AzentMart AI" />
        </Link>

        <nav className={`az-nav-links ${mobileOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <div className="az-nav-dropdown-wrap">
            <button type="button" className="az-nav-link az-nav-menu-button" onClick={() => toggleMenu("platform")} aria-expanded={openMenu === "platform"}>
              Platform <FaChevronDown />
            </button>
            {openMenu === "platform" && (
              <div className="az-nav-mega">
                <div className="az-nav-mega-intro">
                  <span>PLATFORM</span>
                  <h3>One layer for your AI workforce.</h3>
                  <p>Discover, activate, orchestrate and measure AI agents from one connected experience.</p>
                </div>
                <div className="az-nav-mega-grid">
                  <Link to="/#platform"><strong>AI Agent Platform</strong><small>Connect agents to real business workflows.</small></Link>
                  <Link to="/marketplace"><strong>Agent Marketplace</strong><small>Explore ready-to-deploy agents.</small></Link>
                  <Link to="/#orchestration"><strong>Orchestration</strong><small>Coordinate agents, tools and actions.</small></Link>
                  <Link to="/#how-it-works"><strong>Automation</strong><small>Move repetitive work into reliable flows.</small></Link>
                </div>
              </div>
            )}
          </div>

          <div className="az-nav-dropdown-wrap">
            <button type="button" className="az-nav-link az-nav-menu-button" onClick={() => toggleMenu("solutions")} aria-expanded={openMenu === "solutions"}>
              Solutions <FaChevronDown />
            </button>
            {openMenu === "solutions" && (
              <div className="az-nav-mega az-nav-mega-small">
                <div className="az-nav-mega-grid">
                  <Link to="/#teams"><strong>Sales</strong><small>Lead research, qualification and follow-up.</small></Link>
                  <Link to="/#teams"><strong>HR & Recruitment</strong><small>Candidate workflows and employee support.</small></Link>
                  <Link to="/#teams"><strong>Finance</strong><small>Operational analysis and repetitive tasks.</small></Link>
                  <Link to="/#teams"><strong>Customer Support</strong><small>Faster, contextual customer conversations.</small></Link>
                </div>
              </div>
            )}
          </div>

          {showMarketplace && <Link className="az-nav-link" to="/marketplace">Agents</Link>}
          <Link className="az-nav-link" to="/#how-it-works">How it works</Link>
          <Link className="az-nav-link" to="/#pricing">Pricing</Link>
        </nav>

        <div className="az-nav-actions">
          <Link className="az-nav-signin" to="/signin">Sign in</Link>
          <Link className="az-nav-cta" to="/marketplace">Get started <FaArrowRight /></Link>
        </div>

        <button className="az-nav-mobile-toggle" type="button" onClick={() => setMobileOpen((value) => !value)} aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen}>
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;

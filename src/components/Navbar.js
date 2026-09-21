import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/azentmart-logo.png";
import agentUrls from "../config/agentUrls";

const industries = ["Healthcare", "Retail & E-commerce", "Manufacturing", "Real Estate", "Hospitality & Food", "Education", "Finance & BFSI", "Legal", "IT & SaaS", "Logistics & Supply Chain", "Travel & Tourism"];
const functions = ["Sales", "Marketing", "Customer Support", "HR & Recruitment", "Finance", "Legal", "Operations"];

function MenuItem({ title, children, menu, openMenu, toggleMenu }) {
  return (
    <div className="az-nav-dropdown-wrap">
      <button type="button" className="az-nav-link az-nav-menu-button" onClick={() => toggleMenu(menu)} aria-expanded={openMenu === menu}>
        {title} <FaChevronDown />
      </button>
      {openMenu === menu && children}
    </div>
  );
}

function Navbar({ showMarketplace = true }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => { setOpenMenu(null); setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    const handlePointerDown = (event) => { if (navRef.current && !navRef.current.contains(event.target)) setOpenMenu(null); };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const toggleMenu = (menu) => setOpenMenu((current) => current === menu ? null : menu);
  const closeMobile = () => { setMobileOpen(false); setOpenMenu(null); };

  return (
    <header className="az-global-nav" ref={navRef}>
      <div className="az-nav-shell">
        <Link to="/" className="az-nav-brand" aria-label="AzentMart AI home"><img src={logo} alt="AzentMart AI" /></Link>
        <nav className={`az-nav-links ${mobileOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <MenuItem title="Platform" menu="platform" openMenu={openMenu} toggleMenu={toggleMenu}>
            <div className="az-nav-mega az-nav-mega-wide">
              <div className="az-nav-mega-intro"><span>PLATFORM</span><h3>One platform for your AI workforce.</h3><p>Discover, test, deploy and manage AI employees across business functions and industry domains.</p></div>
              <div className="az-nav-mega-grid">
                <Link to="/#solution" onClick={closeMobile}><strong>AI Workforce</strong><small>10,000+ AI employee catalog vision.</small></Link>
                <Link to="/#how-it-works" onClick={closeMobile}><strong>How It Works</strong><small>Discover, test, deploy and manage.</small></Link>
                <Link to="/marketplace" onClick={closeMobile}><strong>Agent Marketplace</strong><small>Explore the existing ready-to-use agents.</small></Link>
                <Link to="/#why-azentmart" onClick={closeMobile}><strong>Trust & Control</strong><small>Security, integrations and human oversight.</small></Link>
              </div>
              <div className="az-nav-submenu-block"><div><span>INDUSTRIES</span><strong>Explore AI by domain</strong></div><div className="az-nav-chip-grid">{industries.map((item) => <Link key={item} to="/#industries" onClick={closeMobile}>{item}</Link>)}</div></div>
              <div className="az-nav-submenu-block"><div><span>BUSINESS FUNCTIONS</span><strong>AI employees by function</strong></div><div className="az-nav-chip-grid">{functions.map((item) => <Link key={item} to="/#employees" onClick={closeMobile}>{item}</Link>)}</div></div>
            </div>
          </MenuItem>

          <MenuItem title="Solutions" menu="solutions" openMenu={openMenu} toggleMenu={toggleMenu}>
            <div className="az-nav-mega az-nav-mega-small">
              <div className="az-nav-mega-grid">
                <Link to="/#industries" onClick={closeMobile}><strong>Industry Solutions</strong><small>AI workforce domains across business sectors.</small></Link>
                <Link to="/#problem" onClick={closeMobile}><strong>Automate Repetitive Work</strong><small>Reduce manual work across workflows.</small></Link>
                <Link to="/#employees" onClick={closeMobile}><strong>Customer & Revenue</strong><small>Sales, marketing and customer support.</small></Link>
                <Link to="/#solution" onClick={closeMobile}><strong>Operations</strong><small>Connect AI employees to business processes.</small></Link>
                <Link to="/#why-azentmart" onClick={closeMobile}><strong>Human + AI</strong><small>Keep people involved where judgment matters.</small></Link>
                <Link to="/#final-cta" onClick={closeMobile}><strong>Custom Workflows</strong><small>Build AI workflows for your unique needs.</small></Link>
              </div>
            </div>
          </MenuItem>

          <MenuItem title="AI Employees" menu="employees" openMenu={openMenu} toggleMenu={toggleMenu}>
            <div className="az-nav-mega az-nav-mega-small">
              <div className="az-nav-mega-grid">
                {functions.map((item) => <Link key={item} to="/#employees" onClick={closeMobile}><strong>AI {item} Employee</strong><small>Specialized workflows for {item.toLowerCase()}.</small></Link>)}
                <Link to="/#employees" onClick={closeMobile}><strong>10,000+ AI Employees</strong><small>Explore the workforce catalog.</small></Link>
              </div>
            </div>
          </MenuItem>

          <MenuItem title="Company" menu="company" openMenu={openMenu} toggleMenu={toggleMenu}>
            <div className="az-nav-mega az-nav-mega-company">
              <div className="az-nav-mega-intro"><span>COMPANY</span><h3>Build the future of work with AzentMart.</h3><p>Learn about AzentMart AI, our people, culture, careers and how to get in touch.</p></div>
              <div className="az-nav-mega-grid">
                <Link to="/company/about" onClick={closeMobile}><strong>About AzentMart</strong><small>Who we are and what we are building.</small></Link>
                <Link to="/company/leadership" onClick={closeMobile}><strong>Leadership Team</strong><small>Meet the team behind the vision.</small></Link>
                <Link to="/company/culture" onClick={closeMobile}><strong>Culture</strong><small>The principles behind our work.</small></Link>
                <Link to="/company/careers" onClick={closeMobile}><strong>Careers</strong><small>Build the future with us.</small></Link>
                <Link to="/company/contact" onClick={closeMobile}><strong>Contact Us</strong><small>Talk to the AzentMart team.</small></Link>
              </div>
            </div>
          </MenuItem>

          <MenuItem title="Agents" menu="agents" openMenu={openMenu} toggleMenu={toggleMenu}>
            <div className="az-nav-mega az-nav-mega-agents">
              <div className="az-nav-mega-intro"><span>AGENTS</span><h3>Ready-to-use AI agents.</h3><p>Access the existing AzentMart AI agent applications directly.</p></div>
              <div className="az-nav-mega-grid az-agent-nav-grid">
                <a href={agentUrls.instagram} target="_blank" rel="noreferrer"><strong>Instagram Agent</strong><small>AI-powered Instagram workflows.</small></a>
                <a href={agentUrls.interview} target="_blank" rel="noreferrer"><strong>Interview Agent</strong><small>Interview and recruitment workflows.</small></a>
                <a href={agentUrls.whatsapp} target="_blank" rel="noreferrer"><strong>WhatsApp Agent</strong><small>Customer conversations and support.</small></a>
                <a href={agentUrls.voice} target="_blank" rel="noreferrer"><strong>Voice Agent</strong><small>Voice-based AI interactions.</small></a>
              </div>
              <Link className="az-nav-agent-marketplace" to="/marketplace" onClick={closeMobile}>Explore all agents <FaArrowRight /></Link>
            </div>
          </MenuItem>
        </nav>
        <div className="az-nav-actions"><Link className="az-nav-signin" to="/signin">Sign in</Link><a className="az-nav-cta" href="#final-cta">Get a demo <FaArrowRight /></a></div>
        <button className="az-nav-mobile-toggle" type="button" onClick={() => setMobileOpen((value) => !value)} aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen}>{mobileOpen ? <FaTimes /> : <FaBars />}</button>
      </div>
    </header>
  );
}

export default Navbar;

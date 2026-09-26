import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/azentmart-logo.png";
import agentUrls from "../config/agentUrls";
import { businessFunctions, industries } from "../config/siteContent";

const platformLinks = [
  ["AI Workforce", "/platform/ai-workforce", "10,000+ AI employee catalog vision."],
  ["How It Works", "/how-it-works/discover", "Discover, test, deploy and manage."],
  ["Agent Marketplace", "/marketplace", "Explore ready-to-use agents."],
  ["Trust & Control", "/platform/trust-and-control", "Security, integrations and human oversight."],
];

const solutionLinks = [
  ["Industry Solutions", "/solutions/industry-solutions", "AI workforce domains across business sectors."],
  ["Automate Repetitive Work", "/solutions/automate-repetitive-work", "Reduce manual work across workflows."],
  ["Customer & Revenue", "/solutions/customer-and-revenue", "Sales, marketing and customer support."],
  ["Operations", "/solutions/operations", "Connect AI employees to business processes."],
  ["Human + AI", "/solutions/human-and-ai", "Keep people involved where judgment matters."],
  ["Custom Workflows", "/solutions/custom-workflows", "Build AI workflows for your unique needs."],
];

const companyLinks = [
  ["About AzentMart", "/company/about", "Who we are and what we are building."],
  ["Leadership Team", "/company/leadership", "Meet the team behind the vision."],
  ["Culture", "/company/culture", "The principles behind our work."],
  ["Careers", "/company/careers", "Build the future with us."],
  ["Contact Us", "/company/contact", "Talk to the AzentMart team."],
];

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
                {platformLinks.map(([title, path, text]) => <Link key={path} to={path} onClick={closeMobile}><strong>{title}</strong><small>{text}</small></Link>)}
              </div>
              <div className="az-nav-submenu-block"><div><span>INDUSTRIES</span><strong>Explore AI by domain</strong></div><div className="az-nav-chip-grid">{industries.map((item) => <Link key={item.id} to={`/industries/${item.id}`} onClick={closeMobile}>{item.name}</Link>)}</div></div>
              <div className="az-nav-submenu-block"><div><span>BUSINESS FUNCTIONS</span><strong>AI employees by function</strong></div><div className="az-nav-chip-grid">{businessFunctions.map((item) => <Link key={item.id} to={`/business-functions/${item.id}`} onClick={closeMobile}>{item.name}</Link>)}</div></div>
            </div>
          </MenuItem>

          <MenuItem title="Solutions" menu="solutions" openMenu={openMenu} toggleMenu={toggleMenu}>
            <div className="az-nav-mega az-nav-mega-small">
              <div className="az-nav-mega-grid">
                {solutionLinks.map(([title, path, text]) => <Link key={path} to={path} onClick={closeMobile}><strong>{title}</strong><small>{text}</small></Link>)}
              </div>
            </div>
          </MenuItem>

          <MenuItem title="AI Employees" menu="employees" openMenu={openMenu} toggleMenu={toggleMenu}>
            <div className="az-nav-mega az-nav-mega-small">
              <div className="az-nav-mega-grid">
                {businessFunctions.map((item) => <Link key={item.id} to={`/ai-employees/${item.id}`} onClick={closeMobile}><strong>AI {item.name} Employee</strong><small>{item.focus}.</small></Link>)}
                <Link to="/ai-employees/10k-plus" onClick={closeMobile}><strong>10,000+ AI Employees</strong><small>Explore the workforce catalog vision.</small></Link>
              </div>
            </div>
          </MenuItem>

          <MenuItem title="Company" menu="company" openMenu={openMenu} toggleMenu={toggleMenu}>
            <div className="az-nav-mega az-nav-mega-company">
              <div className="az-nav-mega-intro"><span>COMPANY</span><h3>Build the future of work with AzentMart.</h3><p>Learn about AzentMart AI, our people, culture, careers and how to get in touch.</p></div>
              <div className="az-nav-mega-grid">
                {companyLinks.map(([title, path, text]) => <Link key={path} to={path} onClick={closeMobile}><strong>{title}</strong><small>{text}</small></Link>)}
              </div>
            </div>
          </MenuItem>

          <MenuItem title="Resources" menu="resources" openMenu={openMenu} toggleMenu={toggleMenu}>
            <div className="az-nav-mega az-nav-mega-small">
              <div className="az-nav-mega-grid">
                <Link to="/resources/learning" onClick={closeMobile}><strong>Learning</strong><small>Guides, tutorials and practical AI workforce resources.</small></Link>
              </div>
            </div>
          </MenuItem>

          {showMarketplace && <MenuItem title="Agents" menu="agents" openMenu={openMenu} toggleMenu={toggleMenu}>
            <div className="az-nav-mega az-nav-mega-agents">
              <div className="az-nav-mega-intro"><span>AGENTS</span><h3>Ready-to-use AI agents.</h3><p>Access the existing AzentMart AI agent applications directly.</p></div>
              <div className="az-nav-mega-grid az-agent-nav-grid">
                <Link to={agentUrls.instagram} onClick={closeMobile}><strong>Instagram Agent</strong><small>AI-powered Instagram workflows.</small></Link>
                <Link to={agentUrls.interview} onClick={closeMobile}><strong>Interview Agent</strong><small>Interview and recruitment workflows.</small></Link>
                <Link to={agentUrls.whatsapp} onClick={closeMobile}><strong>WhatsApp Agent</strong><small>Customer conversations and support.</small></Link>
                <Link to={agentUrls.voice} onClick={closeMobile}><strong>Voice Agent</strong><small>Voice-based AI interactions.</small></Link>
              </div>
              <Link className="az-nav-agent-marketplace" to="/marketplace" onClick={closeMobile}>Explore all agents <FaArrowRight /></Link>
            </div>
          </MenuItem>}
        </nav>

        <div className="az-nav-actions"><Link className="az-nav-signin" to="/signin">Sign in</Link><Link className="az-nav-cta" to="/demo">Get a demo <FaArrowRight /></Link></div>
        <button className="az-nav-mobile-toggle" type="button" onClick={() => setMobileOpen((value) => !value)} aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen}>{mobileOpen ? <FaTimes /> : <FaBars />}</button>
      </div>
    </header>
  );
}

export default Navbar;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMicrophone,
  FaWhatsapp,
  FaInstagram,
  FaStar,
  FaArrowRight,
  FaCheck,
  FaSearch,
  FaUserPlus,
  FaRocket,
  FaChartLine,
  FaBolt,
  FaShieldAlt,
  FaComments,
  FaDatabase,
  FaNetworkWired,
  FaCogs,
  FaPlay,
  FaLock,
  FaChevronRight,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Style/LandingPage.css";

const featuredAgents = [
  { name: "Voice Agent", slug: "agents/voice", category: "Voice AI", desc: "Automate calls, conversations and customer interactions with a context-aware voice agent.", icon: <FaMicrophone /> },
  { name: "WhatsApp Agent", slug: "agents/whatsapp", category: "Customer AI", desc: "Qualify leads, answer questions and support customers through real-time WhatsApp conversations.", icon: <FaWhatsapp /> },
  { name: "Instagram Agent", slug: "agents/instagram", category: "Social AI", desc: "Automate DMs, lead generation and audience engagement without losing the human touch.", icon: <FaInstagram /> },
  { name: "Interview Agent", slug: "agents/interview", category: "Recruitment AI", desc: "Prepare candidates, organize interview sessions and keep hiring workflows moving.", icon: <FaUserPlus /> },
];

const plans = [
  { name: "Free", price: "0", desc: "Start exploring AI agents with essential usage and one active agent.", tasks: "100 tasks / month" },
  { name: "Basic", price: "29", desc: "For small teams building repeatable automation into everyday work.", tasks: "1,000 tasks / month" },
  { name: "Pro", price: "79", desc: "Advanced agents, analytics and priority support for growing teams.", tasks: "10,000 tasks / month", featured: true },
  { name: "Enterprise", price: "299", desc: "Scale across teams with dedicated support and custom integrations.", tasks: "Unlimited tasks" },
];

const testimonials = [
  { text: "AzentMart gives our team a much clearer path from an AI idea to a workflow people can actually use.", name: "Desmond Okafor", company: "Operations Lead" },
  { text: "The marketplace model makes it much easier to discover automation opportunities without starting from scratch.", name: "Priyanka Mehrotra", company: "Growth Team" },
  { text: "The combination of agents, workflow automation and visibility is exactly what we needed as our operations grew.", name: "Bjorn Kristiansen", company: "Operations Director" },
];

const workflow = [
  { icon: <FaSearch />, title: "Discover", text: "Find the right agent for the exact task, team or workflow you want to improve." },
  { icon: <FaUserPlus />, title: "Connect", text: "Give your agent the right business context, tools and access to do useful work." },
  { icon: <FaRocket />, title: "Activate", text: "Launch the workflow and let agents handle repetitive work with the right level of autonomy." },
  { icon: <FaChartLine />, title: "Measure", text: "Track activity, usage and outcomes so you can continuously improve automation." },
];

const teamSolutions = [
  { id: "sales", label: "Sales", title: "Turn sales signals into action.", text: "Research prospects, qualify leads, prepare follow-ups and move opportunities forward with AI-assisted workflows.", metric: "Lead workflows", icon: "↗" },
  { id: "hr", label: "HR & Recruitment", title: "Make people workflows simpler.", text: "Automate candidate intake, interview coordination, employee questions and repetitive HR operations.", metric: "People operations", icon: "◎" },
  { id: "finance", label: "Finance", title: "Bring intelligence to operations.", text: "Summarize information, route requests and automate repeatable finance processes with controlled AI.", metric: "Operational AI", icon: "◌" },
  { id: "support", label: "Customer Support", title: "Resolve more with context.", text: "Give customers fast, relevant answers while agents work across knowledge, conversations and support workflows.", metric: "Service automation", icon: "✦" },
];

function LandingPage() {
  const [stats, setStats] = useState({ agents: 0, users: 0, satisfaction: 0 });
  const [chatMessage, setChatMessage] = useState("I can help you find an agent or design a workflow.");
  const [chatTyping, setChatTyping] = useState(false);
  const [activeCapability, setActiveCapability] = useState("Discover");
  const [activeTeam, setActiveTeam] = useState("sales");

  useEffect(() => {
    let agents = 0;
    let users = 0;
    let satisfaction = 0;
    const interval = setInterval(() => {
      agents = Math.min(1000, agents + 25);
      users = Math.min(12000, users + 300);
      satisfaction = Math.min(98, satisfaction + 3);
      setStats({ agents, users, satisfaction });
      if (agents === 1000 && users === 12000 && satisfaction === 98) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll(".az-home .az-reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const askAI = (message) => {
    setChatTyping(true);
    window.setTimeout(() => {
      setChatMessage(message);
      setChatTyping(false);
    }, 550);
  };

  const activeSolution = teamSolutions.find((item) => item.id === activeTeam) || teamSolutions[0];

  return (
    <div className="az-site">
      <Navbar />
      <main className="az-home">
        {/* HERO */}
        <section className="az-hero" id="top">
          <div className="az-hero-grid" aria-hidden="true" />
          <div className="az-hero-glow az-hero-glow-one" aria-hidden="true" />
          <div className="az-hero-glow az-hero-glow-two" aria-hidden="true" />
          <div className="az-container az-hero-inner">
            <div className="az-hero-copy az-reveal">
              <div className="az-eyebrow"><span className="az-live-dot" /> ENTERPRISE AI AGENT PLATFORM</div>
              <h1>AI that understands your business.<span> AI that gets the work done.</span></h1>
              <p>Discover, deploy and orchestrate AI agents across sales, HR, finance, support and more — grounded in the context your business already runs on.</p>
              <div className="az-hero-actions">
                <Link to="/marketplace" className="az-btn az-btn-primary">Explore the platform <FaArrowRight /></Link>
                <a href="#agents" className="az-btn az-btn-secondary"><FaPlay /> See agents in action</a>
              </div>
              <div className="az-trust-row"><span><FaCheck /> No credit card required</span><span><FaShieldAlt /> Enterprise-ready</span><span><FaBolt /> Setup in minutes</span></div>
              <div className="az-stat-row">
                <div><strong>{stats.agents}+</strong><span>AI AGENTS</span></div><i /><div><strong>{stats.users.toLocaleString()}+</strong><span>ACTIVE USERS</span></div><i /><div><strong>{stats.satisfaction}%</strong><span>SATISFACTION</span></div>
              </div>
            </div>

            <div className="az-hero-product az-reveal az-delay-2">
              <div className="az-product-backdrop" aria-hidden="true" />
              <div className="az-ai-window">
                <header className="az-ai-window-header">
                  <div className="az-ai-identity"><div className="az-ai-mark">✦</div><div><strong>AZENT AI</strong><small><span /> CONNECTED · READY</small></div></div>
                  <span className="az-window-status">AI WORKSPACE</span>
                </header>
                <div className="az-ai-context-row"><span><FaDatabase /> Company context</span><span><FaNetworkWired /> 24 connected tools</span></div>
                <div className="az-ai-chat">
                  <div className="az-chat-bubble az-chat-bot az-chat-intro"><small>AZENT AI</small><p>What are you trying to get done?</p><p>I can find an agent, connect a workflow, or help you automate a business process.</p></div>
                  <div className="az-chat-bubble az-chat-user"><p>Help me automate lead follow-up.</p></div>
                  <div className="az-chat-bubble az-chat-bot"><small>AZENT AI · RECOMMENDATION</small>{chatTyping ? <div className="az-typing"><span /><span /><span /></div> : <><p>{chatMessage}</p><div className="az-ai-suggestions"><button type="button" onClick={() => askAI("Recommended: Sales Agent + CRM follow-up workflow.")}>Sales agent <FaArrowRight /></button><button type="button" onClick={() => askAI("I can map the workflow from lead intake to follow-up.")}>Build workflow <FaArrowRight /></button></div></>}</div>
                </div>
                <footer className="az-ai-input-area"><div className="az-ai-input"><span>Ask Azent AI anything...</span><button type="button" onClick={() => askAI("Tell me what you want to automate and I’ll map the next step.")} aria-label="Send"><FaArrowRight /></button></div><small>AZENTMART AI · CONTEXT-AWARE WORK</small></footer>
                <div className="az-peeking-robot" aria-hidden="true"><span className="az-robot-antenna"><i /></span><span className="az-robot-head"><i /><i /></span><span className="az-robot-neck" /><span className="az-robot-body"><img src="/assets/azentmart-onlylogo.png" alt="" /></span><span className="az-robot-arm az-robot-arm-left" /><span className="az-robot-arm az-robot-arm-right" /></div>
              </div>
              <div className="az-floating-proof az-proof-one"><span>●</span><div><small>Agent activity</small><strong>Workflow ready</strong></div></div>
              <div className="az-floating-proof az-proof-two"><span>✓</span><div><small>Context</small><strong>Permissions synced</strong></div></div>
            </div>
          </div>
        </section>

        {/* LOGO / PLATFORM SIGNAL */}
        <section className="az-proof-strip">
          <div className="az-container"><span>BUILT FOR MODERN TEAMS</span><div><b>SALES</b><b>OPERATIONS</b><b>HR</b><b>FINANCE</b><b>SUPPORT</b><b>LEGAL</b></div></div>
        </section>

        {/* CONNECTED PLATFORM */}
        <section className="az-section az-platform-section" id="platform">
          <div className="az-container">
            <div className="az-section-heading az-reveal"><span className="az-section-kicker">ONE CONNECTED LAYER</span><h2>Bring people, knowledge, agents and workflows together.</h2><p>AI becomes more useful when it can understand your business context and take the next action — not just return an answer.</p></div>
            <div className="az-platform-shell az-reveal">
              <div className="az-platform-tabs">
                {["Discover", "Automate", "Interact", "Grow"].map((label, index) => {
                  const icons = [<FaSearch />, <FaBolt />, <FaComments />, <FaChartLine />];
                  return <button key={label} type="button" className={activeCapability === label ? "is-active" : ""} onClick={() => setActiveCapability(label)}><span>{icons[index]}</span><strong>{label}</strong><small>{["Find the right agent and knowledge.", "Turn work into repeatable flows.", "Give teams contextual AI.", "Measure and improve automation."][index]}</small></button>;
                })}
              </div>
              <div className="az-platform-demo">
                <div className="az-demo-copy"><span className="az-section-kicker">{activeCapability.toUpperCase()}</span><h3>{activeCapability === "Discover" ? "Find the right AI for the job." : activeCapability === "Automate" ? "Turn repetitive work into reliable action." : activeCapability === "Interact" ? "Give every conversation more context." : "See what your AI is improving."}</h3><p>{activeCapability === "Discover" ? "Search your agent library by business goal, team or use case — then activate what fits." : activeCapability === "Automate" ? "Connect agents, tools and approvals into workflows that can run with the right level of autonomy." : activeCapability === "Interact" ? "Let AI meet customers and teams where work already happens, with context-aware responses." : "Track usage, activity and outcomes from one connected workspace as your automation grows."}</p><Link to="/marketplace">Explore {activeCapability.toLowerCase()} <FaArrowRight /></Link></div>
                <div className="az-demo-visual"><div className="az-ring az-ring-one" /><div className="az-ring az-ring-two" /><div className="az-demo-node az-demo-node-main"><span>✦</span><strong>Azent AI</strong><small>{activeCapability}</small></div><div className="az-demo-node az-demo-node-one"><small>01</small><strong>Context</strong></div><div className="az-demo-node az-demo-node-two"><small>02</small><strong>Agent</strong></div><div className="az-demo-node az-demo-node-three"><small>03</small><strong>Action</strong></div></div>
              </div>
            </div>
          </div>
        </section>

        {/* ORCHESTRATION */}
        <section className="az-section az-orchestration-section" id="orchestration">
          <div className="az-container az-orchestration-grid">
            <div className="az-orchestration-copy az-reveal"><span className="az-section-kicker">AGENT ORCHESTRATION</span><h2>One request. The right agents. The right actions.</h2><p>Coordinate purpose-built agents, business systems and human approvals in a single workflow. Start simple and add autonomy as your team is ready.</p><div className="az-feature-list"><span><FaCheck /> Route work to the right agent</span><span><FaCheck /> Connect tools and business systems</span><span><FaCheck /> Keep humans in the loop when needed</span><span><FaCheck /> Observe activity and outcomes</span></div><Link to="/marketplace" className="az-text-link">Explore agent workflows <FaArrowRight /></Link></div>
            <div className="az-orchestration-visual az-reveal az-delay-2"><div className="az-orch-grid-bg" /><div className="az-orch-line l1" /><div className="az-orch-line l2" /><div className="az-orch-line l3" /><div className="az-orch-node az-orch-request"><small>REQUEST</small><strong>Customer needs help</strong></div><div className="az-orch-node az-orch-core"><span>✦</span><strong>AZENT AI</strong><small>ORCHESTRATOR</small></div><div className="az-orch-node az-orch-a"><small>AGENT 01</small><strong>Sales</strong></div><div className="az-orch-node az-orch-b"><small>AGENT 02</small><strong>Support</strong></div><div className="az-orch-node az-orch-c"><small>AGENT 03</small><strong>CRM Action</strong></div><div className="az-orch-result"><FaCheck /><span>Workflow completed</span></div></div>
          </div>
        </section>

        {/* AGENTS */}
        <section className="az-section az-agents-section" id="agents">
          <div className="az-container">
            <div className="az-section-heading az-agents-heading az-reveal"><span className="az-section-kicker">AGENT MARKETPLACE</span><h2>Ready-to-deploy AI for every team.</h2><p>Start with a focused agent, then connect it to the workflows and systems your business already uses.</p></div>
            <div className="az-marketplace-toolbar az-reveal"><div><FaSearch /><span>Search agents by task, team or workflow</span></div><Link to="/marketplace">View marketplace <FaArrowRight /></Link></div>
            <div className="az-agent-grid">{featuredAgents.map((agent, index) => <article className={`az-agent-card az-reveal az-delay-${index % 4}`} key={agent.name}><div className="az-agent-card-top"><span className="az-agent-icon">{agent.icon}</span><span className="az-agent-pill">READY TO DEPLOY</span></div><small>{agent.category}</small><h3>{agent.name}</h3><p>{agent.desc}</p><Link to={`/${agent.slug}`}>Explore agent <FaArrowRight /></Link></article>)}</div>
            <div className="az-centered-action az-reveal"><Link to="/marketplace" className="az-btn az-btn-outline">Explore the full agent library <FaArrowRight /></Link></div>
          </div>
        </section>

        {/* TEAMS */}
        <section className="az-section az-teams-section" id="teams">
          <div className="az-container">
            <div className="az-section-heading az-reveal"><span className="az-section-kicker">AI FOR EVERY TEAM</span><h2>Start where the work happens.</h2><p>Bring the same connected AI layer to the teams that keep your business moving.</p></div>
            <div className="az-team-tabs az-reveal">{teamSolutions.map((team) => <button type="button" key={team.id} className={activeTeam === team.id ? "is-active" : ""} onClick={() => setActiveTeam(team.id)}>{team.label}<FaChevronRight /></button>)}</div>
            <div className="az-team-panel az-reveal"><div className="az-team-panel-copy"><span>{activeSolution.metric}</span><h3>{activeSolution.title}</h3><p>{activeSolution.text}</p><Link to="/marketplace" className="az-text-link">Explore {activeSolution.label} agents <FaArrowRight /></Link></div><div className="az-team-panel-visual"><div className="az-team-center"><span>{activeSolution.icon}</span><strong>{activeSolution.label}</strong><small>AI WORKSPACE</small></div><div className="az-team-card tc1">Context<br /><b>Connected</b></div><div className="az-team-card tc2">Workflow<br /><b>Running</b></div><div className="az-team-card tc3">Outcome<br /><b>Measured</b></div></div></div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="az-section az-how-section" id="how-it-works">
          <div className="az-container"><div className="az-section-heading az-reveal"><span className="az-section-kicker">HOW IT WORKS</span><h2>From idea to automation in minutes.</h2><p>Start with a business task, choose an agent, connect the right context and let AzentMart handle the rest.</p></div><div className="az-workflow"><div className="az-workflow-line" aria-hidden="true" />{workflow.map((item, index) => <article className={`az-workflow-step az-reveal az-delay-${index}`} key={item.title}><div className="az-step-top"><div>{item.icon}</div></div><div className="az-workflow-card"><small>STEP 0{index + 1}</small><h3>{item.title}</h3><p>{item.text}</p><span className="az-step-arrow"><FaArrowRight /></span></div></article>)}</div></div>
        </section>

        {/* OUTCOMES */}
        <section className="az-outcomes-section">
          <div className="az-container"><div className="az-outcomes-heading az-reveal"><span className="az-section-kicker">BUILT FOR OUTCOMES</span><h2>AI that moves work forward.</h2><p>One connected layer for discovery, execution and continuous improvement.</p></div><div className="az-outcomes-grid"><article className="az-outcome-card az-reveal"><strong>24/7</strong><span>Always-on workflows</span><p>Let repeatable work continue beyond office hours.</p></article><article className="az-outcome-card az-reveal az-delay-1"><strong>1 → ∞</strong><span>Scale across teams</span><p>Start with one agent and expand into a connected AI workforce.</p></article><article className="az-outcome-card az-reveal az-delay-2"><strong>100%</strong><span>More visibility</span><p>Understand what agents are doing and where to improve.</p></article></div></div>
        </section>

        {/* SECURITY */}
        <section className="az-section az-security-section">
          <div className="az-container az-security-grid"><div className="az-security-copy az-reveal"><span className="az-section-kicker">TRUSTED AI</span><h2>Enterprise control without enterprise complexity.</h2><p>As your AI footprint grows, keep the context, permissions, visibility and human oversight that make automation dependable.</p><Link to="/privacy-policy" className="az-text-link">Read our privacy policy <FaArrowRight /></Link></div><div className="az-security-card az-reveal az-delay-2"><div className="az-security-card-head"><span><FaShieldAlt /> AZENTMART PROTECT</span><small>CONNECTED</small></div><div className="az-security-row"><FaLock /><div><strong>Permission-aware access</strong><span>Keep workflows aligned to your business controls.</span></div><FaCheck /></div><div className="az-security-row"><FaCogs /><div><strong>Workflow governance</strong><span>Control automation with the right human checkpoints.</span></div><FaCheck /></div><div className="az-security-row"><FaChartLine /><div><strong>Activity visibility</strong><span>Track usage and outcomes from a central workspace.</span></div><FaCheck /></div></div></div>
        </section>

        {/* PRICING */}
        <section className="az-section az-pricing-section" id="pricing"><div className="az-container"><div className="az-section-heading az-reveal"><span className="az-section-kicker">PRICING</span><h2>Start small. Scale when you're ready.</h2><p>Choose the plan that matches your team's automation needs. Upgrade as your AI workforce grows.</p></div><div className="az-pricing-grid">{plans.map((plan, index) => <article className={`az-price-card ${plan.featured ? "is-featured" : ""} az-reveal az-delay-${index}`} key={plan.name}>{plan.featured && <div className="az-popular">MOST POPULAR</div>}<span className="az-plan-label">{plan.name}</span><div className="az-price"><b>${plan.price}</b><span>/ month</span></div><p>{plan.desc}</p><div className="az-plan-task"><FaCheck /> {plan.tasks}</div><Link to="/pricing" className={`az-price-btn ${plan.featured ? "primary" : ""}`}>Get started <FaArrowRight /></Link></article>)}</div></div></section>

        {/* TESTIMONIALS */}
        <section className="az-section az-testimonials-section" id="testimonials"><div className="az-container"><div className="az-section-heading az-reveal"><span className="az-section-kicker">CUSTOMER STORIES</span><h2>Built to become part of the way your team works.</h2><p>Real workflows start with small wins, then expand across the business.</p></div><div className="az-testimonial-grid">{testimonials.map((item, index) => <article className={`az-testimonial az-reveal az-delay-${index}`} key={item.name}><div className="az-stars">{[...Array(5)].map((_, i) => <FaStar key={i} />)}</div><p>“{item.text}”</p><div><span className="az-avatar">{item.name.charAt(0)}</span><section><strong>{item.name}</strong><small>{item.company}</small></section></div></article>)}</div></div></section>

        {/* CTA */}
        <section className="az-cta-section"><div className="az-container"><div className="az-cta-card az-reveal"><div className="az-cta-orb" aria-hidden="true" /><span className="az-section-kicker">READY WHEN YOU ARE</span><h2>Build your AI workforce with AzentMart.</h2><p>Discover your first agent, connect a workflow and start turning repetitive work into something your team no longer has to think about.</p><div className="az-hero-actions"><Link to="/marketplace" className="az-btn az-btn-white">Explore agents <FaArrowRight /></Link><a href="#platform" className="az-btn az-btn-blue-ghost">See the platform</a></div></div></div></section>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;

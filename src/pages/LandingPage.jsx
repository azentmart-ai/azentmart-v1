import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheck,
  FaChevronDown,
  FaChartLine,
  FaCogs,
  FaHeadset,
  FaInstagram,
  FaPhoneAlt,
  FaRobot,
  FaShieldAlt,
  FaUsers,
  FaSearch,
  FaFlask,
  FaRocket,
  FaTasks,
  FaBolt,
  FaFileInvoiceDollar,
  FaBalanceScale,
  FaIndustry,
  FaPlane,
  FaGraduationCap,
  FaHospital,
  FaBuilding,
  FaShoppingCart,
  FaTruck,
  FaLaptopCode,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import agentUrls from "../config/agentUrls";
import { slugify } from "../config/siteContent";
import "../Style/LandingPage.css";

const workforceCards = [
  {
    id: "sales",
    number: "01",
    name: "AI Sales Employee",
    eyebrow: "SALES",
    title: "Turn every lead into an opportunity.",
    text: "Find, qualify, engage and follow up with prospects while your sales team stays focused on conversations that matter.",
    items: ["Lead Generation Agent", "Lead Qualification Agent", "SDR Agent", "Follow-up Agent", "Sales Research Agent"],
    icon: <FaChartLine />,
    accent: "blue",
  },
  {
    id: "marketing",
    number: "02",
    name: "AI Marketing Employee",
    eyebrow: "MARKETING",
    title: "Keep your brand moving.",
    text: "Automate repetitive engagement and marketing workflows while keeping your brand voice consistent across customer channels.",
    items: ["Content Agent", "SEO Agent", "Social Media Agent", "Campaign Agent", "Marketing Analytics Agent"],
    icon: <FaInstagram />,
    accent: "violet",
    url: agentUrls.instagram,
  },
  {
    id: "customer-support",
    number: "03",
    name: "AI Customer Support Employee",
    eyebrow: "CUSTOMER SUPPORT",
    title: "Support customers around the clock.",
    text: "Resolve routine questions, retrieve knowledge and escalate complex conversations when human judgment is needed.",
    items: ["WhatsApp Support Agent", "Voice Support Agent", "Email Support Agent", "Ticket Resolution Agent", "Customer Success Agent"],
    icon: <FaHeadset />,
    accent: "cyan",
    url: agentUrls.whatsapp,
  },
  {
    id: "hr-and-recruitment",
    number: "04",
    name: "AI HR & Recruitment Employee",
    eyebrow: "HR & RECRUITMENT",
    title: "Recruitment Agent",
    text: "Recruitment, screening, scheduling, onboarding and HR support workflows.",
    items: ["Recruitment Agent", "Resume Screening Agent", "Interview Scheduling Agent", "Onboarding Agent", "HR Support Agent"],
    icon: <FaUsers />,
    accent: "orange",
  },
  {
    id: "finance-and-bfsi",
    number: "05",
    name: "AI Finance Employee",
    eyebrow: "FINANCE",
    title: "Finance workflows, automated.",
    text: "Invoice, payment, reporting, expense and finance support workflows.",
    items: ["Invoice Processing Agent", "Payment Follow-up Agent", "Financial Reporting Agent", "Expense Management Agent", "Finance Support Agent"],
    icon: <FaFileInvoiceDollar />,
    accent: "green",
  },
];

const additionalFunctions = [
  { name: "Legal", icon: <FaBalanceScale /> },
  { name: "Operations", icon: <FaCogs /> },
  { name: "And thousands more", icon: <FaRobot /> },
];

const industries = [
  { id: "healthcare", name: "Healthcare", text: "AI employees for customer, administrative and operational workflows with people involved where judgment matters.", icon: <FaHospital /> },
  { id: "retail-and-e-commerce", name: "Retail & E-commerce", text: "Customer engagement, lead capture and commerce workflows across digital channels.", icon: <FaShoppingCart /> },
  { id: "manufacturing", name: "Manufacturing", text: "Process, procurement, inventory and operational workflows connected to business teams.", icon: <FaIndustry /> },
  { id: "real-estate", name: "Real Estate", text: "Lead response, follow-up and customer workflows for property businesses.", icon: <FaBuilding /> },
  { id: "hospitality-and-food", name: "Hospitality & Food", text: "Customer conversations, reservations and repeatable service workflows.", icon: <FaBuilding /> },
  { id: "education", name: "Education", text: "Support, admissions, coordination and administrative workflows for education teams.", icon: <FaGraduationCap /> },
  { id: "finance-and-bfsi", name: "Finance & BFSI", text: "Information-heavy service, finance and operational workflows with controlled human oversight.", icon: <FaFileInvoiceDollar /> },
  { id: "legal", name: "Legal", text: "Research, document, contract and compliance workflows supported by AI.", icon: <FaBalanceScale /> },
  { id: "it-and-saas", name: "IT & SaaS", text: "Customer support, sales and operations workflows for technology businesses.", icon: <FaLaptopCode /> },
  { id: "logistics-and-supply-chain", name: "Logistics & Supply Chain", text: "Procurement, inventory, customer and workflow automation across supply operations.", icon: <FaTruck /> },
  { id: "travel-and-tourism", name: "Travel & Tourism", text: "Customer conversations, travel support and operational coordination.", icon: <FaPlane /> },
];

const whyItems = [
  { title: "Save Time", text: "Automate repetitive and manual work.", icon: <FaBolt /> },
  { title: "Reduce Costs", text: "Do more with less resources.", icon: <FaChartLine /> },
  { title: "Increase Revenue", text: "Generate more leads, close more deals.", icon: <FaArrowRight /> },
  { title: "Make Better Decisions", text: "Use AI-powered insights and data.", icon: <FaRobot /> },
  { title: "Scale Effortlessly", text: "From small businesses to enterprises.", icon: <FaRocket /> },
];

const faqs = [
  ["What is an AI Employee?", "An AI Employee is a specialized AI system designed around a business role or workflow. It can understand context, use connected tools, execute defined tasks and hand work to people when needed."],
  ["Can AzentMart AI work with our existing tools?", "AzentMart AI is designed around connected business workflows. Specific integrations and available connectors can be evaluated for your environment during discovery."],
  ["Can humans take over an AI workflow?", "Yes. Human-in-the-loop workflows can be designed so people review, approve or take over work when context, judgment or authorization is required."],
  ["How secure is the platform?", "Security is treated as a core platform concern. Access controls, data handling and integration boundaries can be reviewed for your business environment."],
  ["Can we start with one AI Employee?", "Yes. A focused workflow can be a practical starting point, after which additional AI Employees and workflows can be introduced as your needs grow."],
];

function LandingPage() {
  const [deckIndex, setDeckIndex] = useState(0);
  const [deckDropping, setDeckDropping] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    let dropTimer;
    let nextTimer;

    dropTimer = window.setTimeout(() => {
      setDeckDropping(true);
      nextTimer = window.setTimeout(() => {
        setDeckIndex((current) => (current + 1) % workforceCards.length);
        setDeckDropping(false);
      }, 760);
    }, 2600);

    return () => {
      window.clearTimeout(dropTimer);
      window.clearTimeout(nextTimer);
    };
  }, [deckIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    const elements = document.querySelectorAll(".az-home .az-reveal");
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const visibleDeck = useMemo(() => {
    return workforceCards.map((_, offset) => workforceCards[(deckIndex + offset) % workforceCards.length]);
  }, [deckIndex]);


  const goToDeck = (index) => { setDeckDropping(false); setDeckIndex(index); };
  const tickerItems = [
    ["10,000+", "AI EMPLOYEES"],
    ["11+", "INDUSTRY DOMAINS"],
    ["24/7", "AI WORKFORCE"],
    ["HUMAN + AI", "WORK TOGETHER"],
    ["SALES", "AI EMPLOYEE"],
    ["MARKETING", "AI EMPLOYEE"],
    ["CUSTOMER SUPPORT", "AI EMPLOYEE"],
    ["HR & RECRUITMENT", "AI EMPLOYEE"],
    ["FINANCE", "AI EMPLOYEE"],
    ["LEGAL", "AI EMPLOYEE"],
    ["OPERATIONS", "AI EMPLOYEE"],
  ];

  return (
    <div className="az-site">
      <Navbar />
      <main className="az-home">
        <section className="az-hero" id="top">
          <div className="az-hero-grid" />
          <div className="az-hero-glow az-hero-glow-one" />
          <div className="az-hero-glow az-hero-glow-two" />
          <div className="az-container az-hero-inner">
            <div className="az-hero-copy az-reveal">
              <div className="az-eyebrow"><span className="az-live-dot" /> THE AI WORKFORCE PLATFORM</div>
              <h1>The Future of Business is <span>10,000 AI Employees.</span></h1>
              <div className="az-hero-subline">One Platform. <strong>Every Business.</strong> <strong>Every Function.</strong></div>
              <p>AzentMart AI gives your business a ready-to-deploy workforce of 10,000+ AI employees across industries and business functions—helping teams automate work, move faster and scale with confidence.</p>
              <div className="az-hero-actions">
                <Link to="/ai-employees/10k-plus" className="az-btn az-btn-secondary az-hero-explore">Explore AI employees <FaArrowRight /></Link>
                <Link to="/demo" className="az-btn az-btn-primary az-hero-demo">Get a demo <FaArrowRight /></Link>
              </div>
              <div className="az-trust-row">
                <span><FaCheck /> Business-ready workflows</span>
                <span><FaShieldAlt /> Human oversight</span>
                <span><FaBolt /> Built to scale</span>
              </div>
            </div>

            <div className="az-hero-deck-wrap az-reveal az-delay-2" aria-label="AI employee showcase">
              <div className="az-deck-glow" />
              <div className="az-deck-stage">
                <div className="az-deck-label"><span /> AI WORKFORCE / 10,000+</div>
                {visibleDeck.map((card, position) => (
                  <article
                    key={card.id}
                    className={`az-deck-card az-deck-card-${position} az-accent-${card.accent} ${position === 0 && deckDropping ? "is-dropping" : ""}`}
                    aria-hidden={position !== 0}
                  >
                    <div className="az-deck-card-top">
                      <div className="az-deck-icon">{card.icon}</div>
                      <span>{card.number} / 05</span>
                    </div>
                    <small>{card.eyebrow}</small>
                    <h3>{card.name}</h3>
                    <p className="az-deck-card-role">{card.title}</p>
                    <p className="az-deck-card-description">{card.text}</p>
                    <div className="az-deck-card-section-label">CORE WORKFLOWS</div>
                    <ul>{card.items.map((item) => <li key={item}><FaCheck /> {item}</li>)}</ul>
                    <div className="az-deck-card-footer"><span>AI EMPLOYEE</span><i>● READY</i></div>
                  </article>
                ))}
                <div className="az-deck-counter"><strong>{String(deckIndex + 1).padStart(2, "0")}</strong><span>/ 05</span></div>
              </div>
              <div className="az-deck-dots" role="tablist" aria-label="AI employee cards">
                {workforceCards.map((card, index) => (
                  <button key={card.id} type="button" className={deckIndex === index ? "is-active" : ""} onClick={() => goToDeck(index)} aria-label={`Show ${card.name}`} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="az-workflow-section" id="workflow">
          <div className="az-container">
            <div className="az-workflow-heading az-reveal">
              <div>
                <span className="az-section-kicker">HOW AI WORK FLOWS</span>
                <h2>From a business signal to a completed outcome.</h2>
              </div>
              <p>Connect the work your teams already do with specialized AI employees. The animated paths show how information moves through the workflow while people stay in control where judgment matters.</p>
            </div>
            <div className="az-workflow-canvas az-reveal">
              <svg className="az-workflow-lines" viewBox="0 0 1200 320" preserveAspectRatio="none" aria-hidden="true">
                <path className="az-workflow-path az-workflow-path-blue" d="M170 95 C330 95 335 220 500 220 S690 95 820 95 S1010 220 1085 220" />
                <path className="az-workflow-path az-workflow-path-green" d="M170 220 C330 220 350 95 500 95 S690 220 820 220 S1000 95 1085 95" />
              </svg>
              {[
                ["01", "Business signal", "Lead, request or customer event"],
                ["02", "AI employee", "Understands context and next action"],
                ["03", "Workflow action", "Uses connected systems to execute"],
                ["04", "Human checkpoint", "Review, approve or take over when needed"],
                ["05", "Outcome", "A completed task with a clear result"],
              ].map(([number, title, text], index) => (
                <div className={`az-workflow-node az-workflow-node-${index + 1}`} key={number}>
                  <span>{number}</span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </div>
              ))}
            </div>
            <div className="az-workflow-note">The moving dotted paths indicate direction—not just a static diagram.</div>
          </div>
        </section>

        <section className="az-proof-strip" id="trust">
          <div className="az-container">
            <div className="az-proof-heading az-reveal">
              <span>EVERY BUSINESS IS DIFFERENT. SO ARE ITS AI EMPLOYEES.</span>
              <p>Our goal is to build a comprehensive catalog of <strong>10,000+ AI employees</strong>, tailored for every industry, use case and business function.</p>
            </div>
            <div className="az-metric-marquee az-reveal" aria-label="AzentMart AI workforce highlights">
              <div className="az-metric-track">
                {[...tickerItems, ...tickerItems].map(([value, label], index) => (
                  <div className="az-metric-pill" key={`${value}-${label}-${index}`}>
                    <strong>{value}</strong><span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="az-section az-problem-section" id="problem">
          <div className="az-container az-problem-grid">
            <div className="az-section-heading az-reveal"><span className="az-section-kicker">THE PROBLEM</span><h2>Your teams shouldn't spend their time doing work AI can handle.</h2></div>
            <div className="az-problem-copy az-reveal az-delay-1">
              <p>Repetitive work, fragmented workflows and slow responses create operational drag as businesses grow.</p>
              <div className="az-problem-list">
                <div><b>01</b><strong>Lost opportunities</strong><span>Leads and requests can go unanswered when teams are overloaded.</span></div>
                <div><b>02</b><strong>Repetitive work</strong><span>People spend hours on tasks that do not require human judgment.</span></div>
                <div><b>03</b><strong>Slow response</strong><span>Customers expect fast, consistent support across every channel.</span></div>
                <div><b>04</b><strong>Scaling costs</strong><span>Growing operations often bring growing headcount and complexity.</span></div>
              </div>
            </div>
          </div>
          <div className="az-container"><div className="az-cost-callout az-reveal"><span>COST OF DOING NOTHING</span><strong>The cost isn't just time. It's missed opportunities, slower growth and unnecessary operational complexity.</strong></div></div>
        </section>

        <section className="az-section az-solution-section" id="solution">
          <div className="az-container">
            <div className="az-section-heading az-reveal"><span className="az-section-kicker">THE SOLUTION</span><h2>One platform. Every business. Every function.</h2><p>AzentMart AI connects intelligent AI employees with your business workflows, tools and teams—so work can move from request to result with less manual effort.</p></div>
            <div className="az-solution-visual az-reveal">
              <div className="az-solution-core"><div className="az-core-mark">✦</div><small>AZENTMART AI</small><strong>AI WORKFORCE</strong><span>10,000+</span></div>
              <div className="az-solution-node sn-sales"><FaChartLine /><span>Sales</span></div>
              <div className="az-solution-node sn-support"><FaHeadset /><span>Support</span></div>
              <div className="az-solution-node sn-voice"><FaPhoneAlt /><span>Voice</span></div>
              <div className="az-solution-node sn-marketing"><FaInstagram /><span>Marketing</span></div>
              <div className="az-solution-node sn-ops"><FaCogs /><span>Operations</span></div>
              <div className="az-solution-orbit orbit-a" /><div className="az-solution-orbit orbit-b" />
            </div>
          </div>
        </section>

        <section className="az-section az-employees-section" id="employees">
          <div className="az-container">
            <div className="az-section-heading az-reveal"><span className="az-section-kicker">AI EMPLOYEES ACROSS BUSINESS FUNCTIONS</span><h2>Hire. Deploy. Manage. Scale.</h2><p>Specialized AI employees for the functions that keep a business moving, with thousands more possible through custom workflows.</p></div>
            <div className="az-workforce-grid">
              {workforceCards.map((card) => (
                <article className={`az-workforce-card az-accent-${card.accent} az-reveal`} key={card.id}>
                  <div className="az-workforce-card-head"><span>{card.eyebrow}</span><div>{card.icon}</div></div>
                  <div className="az-workforce-card-body"><small>{card.number}</small><h3>{card.name}</h3><p>{card.title}</p><ul>{card.items.map((item) => <li key={item}><FaCheck /> {item}</li>)}</ul></div>
                  {card.url ? <Link className="az-text-link" to={card.url}>Open agent <FaArrowRight /></Link> : <Link className="az-text-link" to={`/ai-employees/${card.id}`}>Explore workflow <FaArrowRight /></Link>}
                </article>
              ))}
            </div>
            <div className="az-more-functions az-reveal">
              {additionalFunctions.map((item) => <Link to={item.name === "And thousands more" ? "/ai-employees/10k-plus" : `/business-functions/${slugify(item.name)}`} key={item.name}><span>{item.icon}</span><strong>{item.name}</strong></Link>)}
            </div>
          </div>
        </section>

        <section className="az-section az-how-section" id="how-it-works">
          <div className="az-container">
            <div className="az-section-heading az-reveal"><span className="az-section-kicker">HOW IT WORKS</span><h2>From idea to AI employee in four steps.</h2><p>Discover the right workflow, validate it, deploy it and keep improving your AI workforce.</p></div>
            <div className="az-process"><div className="az-process-line" />{[
              { n: "01", slug: "discover", title: "Discover", text: "Identify the workflows where AI can create the greatest impact.", icon: <FaSearch /> },
              { n: "02", slug: "test", title: "Test", text: "Validate your AI employee in a real business environment before going live.", icon: <FaFlask /> },
              { n: "03", slug: "deploy", title: "Deploy", text: "Connect your tools, workflows and teams and put your AI employee to work.", icon: <FaRocket /> },
              { n: "04", slug: "manage", title: "Manage", text: "Monitor performance, review outcomes and continuously improve your AI workforce.", icon: <FaTasks /> },
            ].map((step) => <Link className="az-process-step az-reveal" key={step.n} to={`/how-it-works/${step.slug}`}><div className="az-step-number">{step.n}</div><div className="az-step-icon">{step.icon}</div><h3>{step.title}</h3><p>{step.text}</p></Link>)}</div>
          </div>
        </section>

        <section className="az-section az-industries-section" id="industries">
          <div className="az-container">
            <div className="az-section-heading az-reveal"><span className="az-section-kicker">USE CASES / INDUSTRIES</span><h2>AI that adapts to the way your industry works.</h2><p>Explore the domains from the AzentMart AI workforce catalog.</p></div>
            <div className="az-industry-cards az-reveal">
              {industries.map((industry) => (
                <Link
                  key={industry.id}
                  className="az-industry-card"
                  to={`/industries/${industry.id}`}
                >
                  <div className="az-industry-card-main">
                    <span className="az-industry-card-icon">{industry.icon}</span>
                    <strong>{industry.name}</strong>
                    <FaArrowRight className="az-industry-card-arrow" />
                  </div>
                  <div className="az-industry-card-points">
                    <span><FaCheck /> Customer workflows</span>
                    <span><FaCheck /> AI-assisted operations</span>
                    <span><FaCheck /> Human escalation</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="az-section az-why-section" id="why-azentmart">
          <div className="az-container">
            <div className="az-why-header az-reveal"><div className="az-section-heading"><span className="az-section-kicker">WHY AZENTMART AI?</span><h2>More than just AI tools — it's your AI workforce.</h2></div><p>Build a workforce that helps automate work, support revenue, improve decisions and scale with your business.</p></div>
            <div className="az-why-grid">{whyItems.map((item, index) => {
              const points = [
                ["Automate repetitive work", "Reduce manual tasks", "Move workflows faster"],
                ["Do more with fewer resources", "Automate recurring work", "Reduce operational complexity"],
                ["Generate more leads", "Follow up consistently", "Close more deals"],
                ["Use AI-powered insights", "Work with business data", "Keep human oversight"],
                ["Start with focused workflows", "Expand across functions", "Scale from small teams to enterprises"],
              ][index];
              return (
                <Link className="az-why-card az-reveal" key={item.title} to={`/why-azentmart/${slugify(item.title)}`}>
                  <span>0{index + 1}</span>
                  <div className="az-why-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p className="az-why-summary">{item.text}</p>
                  <div className="az-why-points">{points.map((point) => <span key={point}><FaCheck /> {point}</span>)}</div>
                  <FaArrowRight className="az-card-arrow" />
                </Link>
              );
            })}</div>
          </div>
        </section>

        <section className="az-section az-results-section" id="results">
          <div className="az-container"><div className="az-results-card az-reveal"><div className="az-results-copy"><span className="az-section-kicker">CASE STUDIES / RESULTS</span><h2>See what happens when AI gets to work.</h2><p>Use verified customer outcomes to show where AzentMart creates measurable impact. Add approved case studies and results here as they become available.</p><Link to="/company/contact" className="az-btn az-btn-primary">Discuss your workflow <FaArrowRight /></Link></div><div className="az-results-placeholder"><div><strong>10,000+</strong><span>AI employee catalog target</span></div><div><strong>24/7</strong><span>Workforce availability</span></div><div><strong>Human + AI</strong><span>Human oversight</span></div><small>Customer-specific performance metrics should be replaced with verified results.</small></div></div></div>
        </section>

        <section className="az-section az-pricing-section" id="pricing">
          <div className="az-container"><div className="az-section-heading az-reveal"><span className="az-section-kicker">PRICING / CTA</span><h2>Start with what your business needs. Scale when you're ready.</h2><p>Choose a focused workflow and expand your AI workforce as your business grows.</p></div><div className="az-pricing-note az-reveal"><div><span>AI WORKFORCE PLATFORM</span><strong>Flexible deployment for growing teams.</strong><p>Explore the right AI employee, workflow and deployment approach for your business.</p></div><Link to="/demo" className="az-btn az-btn-primary">Book a free demo <FaArrowRight /></Link></div></div>
        </section>

        <section className="az-section az-faq-section" id="faq">
          <div className="az-container az-faq-grid"><div className="az-section-heading az-reveal"><span className="az-section-kicker">FAQ</span><h2>Questions, answered.</h2><p>Everything you need to understand the AzentMart AI workforce approach.</p></div><div className="az-faq-list az-reveal">{faqs.map(([question, answer], index) => <div className={`az-faq-item ${openFaq === index ? "is-open" : ""}`} key={question}><button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{question}</span><FaChevronDown /></button><div className="az-faq-answer"><p>{answer}</p></div></div>)}</div></div>
        </section>

        <section className="az-final-cta" id="final-cta">
          <div className="az-cta-orb" /><div className="az-container"><div className="az-final-card az-reveal"><div><span className="az-section-kicker">READY TO BUILD YOUR AI WORKFORCE?</span><h2>Hire. Deploy. Manage.<br /><span>Scale with AI.</span></h2><p>See how AzentMart AI can help your business automate work, improve customer experiences and scale more efficiently.</p></div><div className="az-final-actions"><Link to="/demo" className="az-btn az-btn-white">Book Free Demo <FaArrowRight /></Link><Link to="/marketplace" className="az-btn az-btn-blue-ghost">Explore agents</Link></div></div></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;

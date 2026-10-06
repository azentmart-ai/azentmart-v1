import React from "react";
import "./LandingPage.css";

const employees = [
  {
    icon: "✦",
    title: "Marketing & Strategy",
    text: "Turn business goals into clear marketing plans, campaigns and next steps.",
    tone: "violet"
  },
  {
    icon: "Aa",
    title: "Content",
    text: "Create campaign copy, blogs, messaging and content ideas for every stage.",
    tone: "blue"
  },
  {
    icon: "◎",
    title: "Social Media",
    text: "Plan social content, engagement ideas and channel-ready messaging.",
    tone: "cyan"
  },
  {
    icon: "⌕",
    title: "SEO",
    text: "Explore keywords, search intent and optimization opportunities for content.",
    tone: "indigo"
  },
  {
    icon: "↗",
    title: "Ads",
    text: "Develop paid-search concepts, ad messaging and campaign directions.",
    tone: "purple"
  },
  {
    icon: "✉",
    title: "Email Marketing",
    text: "Build personalized email campaign ideas, sequences and audience messaging.",
    tone: "sky"
  },
  {
    icon: "◫",
    title: "Market Research",
    text: "Organize customer, market and competitor research into useful insights.",
    tone: "teal"
  },
  {
    icon: "⌁",
    title: "Campaign Analyst",
    text: "Review campaign outputs and identify opportunities for optimization.",
    tone: "blue"
  }
];

const workflow = [
  {
    number: "01",
    title: "Describe the goal",
    text: "Give the workspace a product, audience, campaign objective or marketing task."
  },
  {
    number: "02",
    title: "Let the agents collaborate",
    text: "Specialized marketing employees can handle strategy, content, SEO, social, ads and research."
  },
  {
    number: "03",
    title: "Work from one workspace",
    text: "Review the generated campaign work and use the existing authenticated workspace to continue."
  }
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M10.5 5.5 15 10l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z" fill="currentColor" />
      <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" fill="currentColor" opacity=".72" />
    </svg>
  );
}

function LandingPage({ onLogin }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="landing-page">
      <div className="landing-noise" />
      <div className="landing-orb landing-orb-one" />
      <div className="landing-orb landing-orb-two" />

      <header className="landing-header">
        <div className="landing-header-inner">
          <button className="landing-brand" onClick={() => scrollTo("top")} aria-label="Azentmart AI home">
            <span className="brand-logo-frame">
              <img src="/agent-apps/marketing/azentmart-ai-logo.jpg" alt="Azentmart AI" />
            </span>
          </button>

          <nav className="landing-nav" aria-label="Main navigation">
            <button onClick={() => scrollTo("capabilities")}>Capabilities</button>
            <button onClick={() => scrollTo("agents")}>AI Employees</button>
            <button onClick={() => scrollTo("workflow")}>How it works</button>
            <button onClick={() => scrollTo("about")}>About</button>
          </nav>

          <button className="landing-login-button" onClick={onLogin}>
            Login <ArrowIcon />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="landing-hero">
          <div className="hero-copy">
            <div className="eyebrow-pill">
              <span className="eyebrow-dot" />
              <SparkIcon />
              MARKETING AI WORKSPACE
            </div>

            <h1>
              Your marketing team,
              <span> amplified by AI.</span>
            </h1>

            <p className="hero-description">
              Bring strategy, content, SEO, social media, advertising, email and research
              into one intelligent marketing workspace built around specialized AI employees.
            </p>

            <div className="hero-actions">
              <button className="primary-cta" onClick={onLogin}>
                Enter Marketing Workspace <ArrowIcon />
              </button>
              <button className="secondary-cta" onClick={() => scrollTo("agents")}>
                Explore AI Employees
              </button>
            </div>

            <div className="hero-note">
              <span className="status-dot" />
              <span>Powered by the existing authenticated Marketing AI workspace</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Marketing AI workspace preview">
            <div className="hero-glow" />
            <div className="dashboard-preview">
              <div className="preview-topbar">
                <div className="preview-brand-mini">
                  <span className="mini-mark">A</span>
                  <span>Marketing Workspace</span>
                </div>
                <span className="preview-status"><i /> Live</span>
              </div>

              <div className="preview-body">
                <div className="preview-sidebar">
                  <span className="preview-label">AI EMPLOYEES</span>
                  {employees.slice(0, 5).map((employee, index) => (
                    <div className={`preview-agent ${index === 0 ? "active" : ""}`} key={employee.title}>
                      <span>{employee.icon}</span>
                      <b>{employee.title}</b>
                    </div>
                  ))}
                </div>

                <div className="preview-main">
                  <div className="preview-heading">
                    <div>
                      <span className="preview-kicker">CAMPAIGN ORCHESTRATOR</span>
                      <h3>Launch a coordinated campaign</h3>
                    </div>
                    <span className="preview-spark"><SparkIcon /></span>
                  </div>

                  <div className="preview-input">
                    <span>Describe your marketing objective...</span>
                    <span className="preview-send"><ArrowIcon /></span>
                  </div>

                  <div className="preview-cards">
                    <div className="preview-result large">
                      <span>STRATEGY</span>
                      <strong>Audience + positioning</strong>
                      <div className="fake-lines"><i /><i /><i /></div>
                    </div>
                    <div className="preview-result">
                      <span>CONTENT</span>
                      <strong>Campaign messaging</strong>
                      <div className="fake-bars"><i /><i /><i /><i /></div>
                    </div>
                    <div className="preview-result">
                      <span>INSIGHTS</span>
                      <strong>Market signals</strong>
                      <div className="fake-chart"><i /><i /><i /><i /><i /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="capability-strip" id="capabilities">
          <div className="capability-strip-inner">
            <div>
              <span className="section-kicker">ONE WORKSPACE</span>
              <strong>From the first idea to campaign analysis.</strong>
            </div>
            <div className="capability-tags">
              <span>Strategy</span><span>Content</span><span>SEO</span><span>Social</span><span>Ads</span><span>Email</span><span>Research</span>
            </div>
          </div>
        </section>

        <section className="landing-section" id="agents">
          <div className="section-heading centered">
            <span className="section-kicker">SPECIALIZED AI EMPLOYEES</span>
            <h2>Different marketing jobs.<br /><span>One coordinated workspace.</span></h2>
            <p>
              The existing Marketing AI project includes specialized employees for the core
              parts of a modern marketing workflow.
            </p>
          </div>

          <div className="employee-grid">
            {employees.map((employee) => (
              <article className="employee-card" key={employee.title}>
                <div className={`employee-icon ${employee.tone}`}>{employee.icon}</div>
                <div className="employee-card-copy">
                  <h3>{employee.title}</h3>
                  <p>{employee.text}</p>
                </div>
                <span className="card-arrow"><ArrowIcon /></span>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section workflow-section" id="workflow">
          <div className="workflow-layout">
            <div className="section-heading">
              <span className="section-kicker">HOW IT WORKS</span>
              <h2>Turn a marketing brief into coordinated AI work.</h2>
              <p>
                Start with the outcome you want. The workspace is designed around specialized
                agents so each marketing task has a clear place in the workflow.
              </p>
              <button className="text-cta" onClick={onLogin}>
                Open the workspace <ArrowIcon />
              </button>
            </div>

            <div className="workflow-list">
              {workflow.map((step) => (
                <div className="workflow-step" key={step.number}>
                  <span className="step-number">{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="architecture-section" id="about">
          <div className="architecture-panel">
            <div className="architecture-copy">
              <span className="section-kicker">BUILT AROUND YOUR WORKFLOW</span>
              <h2>A polished front door to the Marketing AI system you already have.</h2>
              <p>
                This landing experience sits in front of the existing application. Your
                authentication, marketing agents, APIs, database and backend workflow remain
                behind the same workspace entry point.
              </p>
              <div className="architecture-points">
                <span><i /> Existing authentication</span>
                <span><i /> Existing AI employees</span>
                <span><i /> Existing backend APIs</span>
                <span><i /> Existing workspace data</span>
              </div>
            </div>
            <div className="architecture-visual">
              <div className="architecture-node main-node">
                <span className="node-symbol"><SparkIcon /></span>
                <div><small>FRONT DOOR</small><strong>Marketing Landing</strong></div>
              </div>
              <div className="architecture-line" />
              <div className="architecture-node">
                <span className="node-symbol blue">↗</span>
                <div><small>AUTHENTICATED</small><strong>Existing Workspace</strong></div>
              </div>
              <div className="architecture-line short" />
              <div className="architecture-chip-row">
                <span>Strategy</span><span>Content</span><span>SEO</span><span>Research</span>
              </div>
            </div>
          </div>
        </section>

        <section className="final-cta-section">
          <div className="final-cta-glow" />
          <div className="final-cta-content">
            <span className="section-kicker">READY WHEN YOU ARE</span>
            <h2>Make your next marketing workflow<br /><span>feel less fragmented.</span></h2>
            <p>Enter the existing Marketing AI workspace and continue where the platform already works.</p>
            <button className="primary-cta large" onClick={onLogin}>
              Login to Marketing AI <ArrowIcon />
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand-block">
            <span className="footer-logo-frame">
              <img src="/agent-apps/marketing/azentmart-ai-logo.jpg" alt="Azentmart AI" />
            </span>
            <p>Intelligent marketing workflows, presented through one focused AI workspace.</p>
          </div>

          <div className="footer-links">
            <div>
              <span>EXPLORE</span>
              <button onClick={() => scrollTo("capabilities")}>Capabilities</button>
              <button onClick={() => scrollTo("agents")}>AI Employees</button>
              <button onClick={() => scrollTo("workflow")}>How it works</button>
            </div>
            <div>
              <span>WORKSPACE</span>
              <button onClick={onLogin}>Login</button>
              <button onClick={() => scrollTo("about")}>About</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Azentmart AI</span>
          <span>Marketing AI Workspace</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

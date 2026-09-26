import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  BrainCircuit,
  CalendarCheck2,
  CheckCircle2,
  FileSearch,
  Mic2,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import "./Home.css";

const agents = [
  {
    id: "recruiter",
    label: "01",
    title: "AI Recruiter",
    subtitle: "Your intelligent sourcing partner",
    icon: BrainCircuit,
    color: "blue",
    description:
      "Find the right talent faster with AI-powered sourcing, screening and candidate matching.",
    points: [
      "Understands your job requirements",
      "Finds relevant candidates",
      "Screens resumes with AI",
      "Shortlists the best matches",
    ],
    stat: "12K+",
    statText: "Candidates sourced",
  },

  {
    id: "interviewer",
    label: "02",
    title: "AI Interviewer",
    subtitle: "Your intelligent interview partner",
    icon: Mic2,
    color: "violet",
    description:
      "Conduct structured AI interviews and instantly understand candidate skills, experience and fit.",
    points: [
      "Conducts intelligent interviews",
      "Evaluates skills and fit",
      "Generates interview summaries",
      "Reduces manual interview work",
    ],
    stat: "5K+",
    statText: "Interviews conducted",
  },

  {
    id: "candidate",
    label: "03",
    title: "Candidate Agent",
    subtitle: "Your candidate experience partner",
    icon: Users,
    color: "cyan",
    description:
      "Keep candidates informed, engaged and supported throughout the recruitment journey.",
    points: [
      "Answers candidate questions",
      "Provides real-time updates",
      "Supports interview scheduling",
      "Improves candidate experience",
    ],
    stat: "24/7",
    statText: "Candidate support",
  },
];

const workflow = [
  ["Understand", FileSearch],
  ["Source", Search],
  ["Assess", CheckCircle2],
  ["Engage", Mic2],
  ["Hire", Sparkles],
];

export default function Home() {
  const [activeAgent, setActiveAgent] = useState(0);
  const sceneRef = useRef(null);

  /*
   * CHANGE AGENT EVERY 3 SECONDS
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAgent((current) => (current + 1) % agents.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  /*
   * MOUSE 3D PARALLAX
   */
  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) return;

    const handleMove = (event) => {
      const rect = scene.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      scene.style.setProperty(
        "--mouse-x",
        `${x * 18}px`
      );

      scene.style.setProperty(
        "--mouse-y",
        `${y * 14}px`
      );

      scene.style.setProperty(
        "--rotate-x",
        `${y * -3}deg`
      );

      scene.style.setProperty(
        "--rotate-y",
        `${x * 5}deg`
      );
    };

    const reset = () => {
      scene.style.setProperty("--mouse-x", "0px");
      scene.style.setProperty("--mouse-y", "0px");
      scene.style.setProperty("--rotate-x", "0deg");
      scene.style.setProperty("--rotate-y", "0deg");
    };

    scene.addEventListener(
      "pointermove",
      handleMove
    );

    scene.addEventListener(
      "pointerleave",
      reset
    );

    return () => {
      scene.removeEventListener(
        "pointermove",
        handleMove
      );

      scene.removeEventListener(
        "pointerleave",
        reset
      );
    };
  }, []);

  const currentAgent = agents[activeAgent];
  const CurrentIcon = currentAgent.icon;

  return (
    <div className="recruiting-home">

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <header className="recruiting-navbar">

        <Link
          to="/"
          className="recruiting-logo"
        >
          <img
            src="/company-logo.png"
            alt="AzentMart AI"
          />
        </Link>

        <nav className="recruiting-navigation">

          <a href="#product">
            Product
          </a>

          <a href="#agents">
            AI Agents
          </a>

          <a href="#workflow">
            How it works
          </a>

          <a href="#customers">
            Customers
          </a>

          <a href="#pricing">
            Pricing
          </a>

        </nav>

        <div className="recruiting-nav-actions">

          <Link
            to="/login"
            className="recruiting-login"
          >
            Sign in
          </Link>

          <Link
            to="/signup"
            className="recruiting-start"
          >
            Get started
            <ArrowRight size={15} />
          </Link>

        </div>

      </header>


      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className="recruiting-hero"
        id="product"
      >

        {/* Background */}

        <div className="hero-background" />

        <div className="hero-background-overlay" />

        <div className="hero-blue-glow" />


        {/* ================================================
            LEFT SIDE
        ================================================ */}

        <div className="hero-content">

          <div className="hero-eyebrow">

            <span className="eyebrow-dot" />

            THE AI RECRUITING AGENT

          </div>


          <h1>

            Hiring

            <span>
              moves forward.
            </span>

          </h1>


          <p className="hero-description">

            AzentMart AI Recruiter finds,
            screens, interviews and helps you
            hire the right people — so you can
            focus on what matters most.

          </p>


          <div className="hero-buttons">

            <Link
              to="/signup"
              className="hero-primary-button"
            >

              Get started

              <ArrowRight size={16} />

            </Link>


            <a
              href="#agents"
              className="hero-demo-button"
            >

              <span className="play-button">

                <span />

              </span>

              Watch demo

            </a>

          </div>


          {/* Metrics */}

          <div className="hero-metrics">

            <div className="metric">

              <strong>
                3x
              </strong>

              <span>
                Faster hiring
              </span>

            </div>


            <div className="metric">

              <strong>
                70%
              </strong>

              <span>
                More qualified
                <br />
                candidates
              </span>

            </div>


            <div className="metric">

              <strong>
                90%
              </strong>

              <span>
                Reduced
                <br />
                manual work
              </span>

            </div>

          </div>

        </div>


        {/* ================================================
            3D AI SCENE
        ================================================ */}

        <div
          className={`hero-3d-scene agent-${currentAgent.id}`}
          ref={sceneRef}
        >

          {/* Glow */}

          <div className="scene-glow" />


          {/* Orbit */}

          <div className="orbit orbit-one" />

          <div className="orbit orbit-two" />

          <div className="orbit orbit-three" />


          {/* ============================================
              CENTRAL AI CORE
          ============================================ */}

          <div className="ai-core">

            <div className="ai-core-circle">

              <div className="core-light" />

              <img
                src="/company-logo.png"
                alt="AzentMart AI"
              />

            </div>

            <strong>
              AzentMart AI
            </strong>

            <span>
              Recruiting Agent
            </span>

          </div>


          {/* ============================================
              ACTIVE AGENT CARD
          ============================================ */}

          <div
            key={currentAgent.id}
            className={`active-agent-card ${currentAgent.color}`}
          >

            <div className="agent-card-header">

              <div className="agent-card-icon">

                <CurrentIcon size={22} />

              </div>

              <div>

                <span className="agent-number">
                  AGENT {currentAgent.label}
                </span>

                <h2>
                  {currentAgent.title}
                </h2>

              </div>

            </div>


            <p className="agent-subtitle">
              {currentAgent.subtitle}
            </p>


            <p className="agent-description">
              {currentAgent.description}
            </p>


            <div className="agent-features">

              {currentAgent.points.map(
                (point) => (

                  <div
                    className="agent-feature"
                    key={point}
                  >

                    <CheckCircle2
                      size={14}
                    />

                    <span>
                      {point}
                    </span>

                  </div>

                )
              )}

            </div>


            <div className="agent-card-footer">

              <div className="agent-avatars">

                <span>U</span>
                <span>A</span>
                <span>K</span>

              </div>

              <div>

                <strong>
                  {currentAgent.stat}
                </strong>

                <small>
                  {currentAgent.statText}
                </small>

              </div>

            </div>

          </div>


          {/* ============================================
              AGENT SWITCH INDICATOR
          ============================================ */}

          <div className="agent-switcher">

            {agents.map(
              (agent, index) => {

                const Icon = agent.icon;

                return (
                  <button
                    key={agent.id}
                    className={
                      activeAgent === index
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setActiveAgent(index)
                    }
                  >

                    <span className="switch-icon">

                      <Icon size={15} />

                    </span>

                    <span className="switch-name">
                      {agent.title}
                    </span>

                  </button>
                );
              }
            )}

          </div>


          {/* Floating status */}

          <div className="floating-card floating-top">

            <Search size={13} />

            <span>
              AI analyzing candidates
            </span>

          </div>


          <div className="floating-card floating-bottom">

            <CalendarCheck2 size={13} />

            <span>
              Interview scheduled
            </span>

          </div>


          {/* Label */}

          <div className="ai-hiring-label">

            <span>
              Your AI
            </span>

            <strong>
              Hiring Team
            </strong>

            <ArrowDown size={15} />

          </div>


          {/* Particles */}

          <span className="particle particle-1" />
          <span className="particle particle-2" />
          <span className="particle particle-3" />
          <span className="particle particle-4" />

        </div>


        {/* Notes */}

        <div className="hero-note hero-note-left">

          Great teams
          <br />

          build brighter
          <br />

          tomorrows.

        </div>


        <div className="hero-note hero-note-right">

          People.
          <br />

          Progress.
          <br />

          Together.

        </div>


        {/* Scroll */}

        <a
          href="#agents"
          className="hero-scroll"
        >

          SCROLL TO EXPLORE

          <ArrowDown size={15} />

        </a>

      </section>


      {/* ==================================================
          AGENTS SECTION
      ================================================== */}

      <section
        className="agents-section"
        id="agents"
      >

        <div className="page-container">

          <span className="section-label">
            YOUR AI HIRING TEAM
          </span>

          <h2>

            Three agents.

            <span>
              One connected experience.
            </span>

          </h2>

          <p className="section-description">

            Specialized AI agents work together
            across sourcing, interviewing and
            candidate engagement.

          </p>


          <div className="agent-grid">

            {agents.map(
              ({
                icon: Icon,
                title,
                description,
              }) => (

                <div
                  className="agent-grid-card"
                  key={title}
                >

                  <div className="grid-agent-icon">

                    <Icon size={23} />

                  </div>

                  <small>
                    AI AGENT
                  </small>

                  <h3>
                    {title}
                  </h3>

                  <p>
                    {description}
                  </p>

                  <Link to="/signup">

                    Explore agent

                    <ArrowRight size={14} />

                  </Link>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ==================================================
          WORKFLOW
      ================================================== */}

      <section
        className="workflow-section"
        id="workflow"
      >

        <div className="page-container">

          <span className="section-label">
            THE RECRUITING LOOP
          </span>

          <h2>

            Understand → Source → Assess

            <br />

            → Engage →

            <span>
              Hire.
            </span>

          </h2>


          <div className="workflow">

            {workflow.map(
              ([name, Icon]) => (

                <div
                  className="workflow-step"
                  key={name}
                >

                  <span>

                    <Icon size={18} />

                  </span>

                  <strong>
                    {name}
                  </strong>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ==================================================
          FINAL CTA
      ================================================== */}

      <section className="final-section">

        <div className="final-glow" />

        <div className="page-container">

          <span className="section-label">
            AZENTMART AI RECRUITING AGENT
          </span>

          <h2>

            Let AI move hiring

            <span>
              forward.
            </span>

          </h2>

          <p>

            Bring sourcing, screening,
            interviews and candidate engagement
            into one intelligent workspace.

          </p>

          <Link
            to="/signup"
            className="hero-primary-button"
          >

            Get started

            <ArrowRight size={16} />

          </Link>

        </div>

      </section>

    </div>
  );
}
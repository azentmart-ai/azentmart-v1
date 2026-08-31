import React, { useEffect, useState } from "react";

function Hero() {

  const [agents, setAgents] = useState(0);
  const [users, setUsers] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);

  useEffect(() => {

    let a = 0;
    let u = 0;
    let s = 0;

    const interval = setInterval(() => {

      if (a < 500) {
        a += 10;
        setAgents(a);
      }

      if (u < 12000) {
        u += 200;
        setUsers(u);
      }

      if (s < 98) {
        s += 2;
        setSatisfaction(s);
      }

    }, 30);

    return () => clearInterval(interval);

  }, []);

  return (
    <section className="hero">

      <div className="hero-badge">
        ✨ The AI Agent Marketplace for Modern Business
      </div>

      <h1 className="hero-title">
        Discover & deploy AI agents
        <br />
        that transform your
        <br />
        workflow
      </h1>

      <p className="hero-desc">
        AzentMart AI is the central hub where forward-thinking businesses
        discover, activate, and manage AI agents that automate sales, HR,
        finance, support, and more — no technical expertise required.
      </p>

      <div className="hero-buttons1">
        <button className="primary-btn1">Get Started Free</button>
        <button className="secondary-btn1">Browse Agents</button>
      </div>

      {/* STATS SECTION */}

      <div className="hero-stats">

        <div className="stat">
          <h2>{agents}+</h2>
          <p>AI Agents</p>
        </div>

        <div className="stat-divider"></div>

        <div className="stat">
          <h2>{users.toLocaleString()}+</h2>
          <p>Active Users</p>
        </div>

        <div className="stat-divider"></div>

        <div className="stat">
          <h2>{satisfaction}%</h2>
          <p>Satisfaction Rate</p>
        </div>

      </div>
      <div className="hero-divider"></div>

    </section>
  );
}

export default Hero;
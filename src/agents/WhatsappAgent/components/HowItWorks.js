import React from "react";

function HowItWorks() {
  return (
    <section className="how-section">

      <div className="how-badge">How It Works</div>

      <h2 className="how-title">Up and Running in Minutes</h2>

      <p className="how-desc">
        Four simple steps to automate your business workflows with the power of AI agents.
      </p>

      <div className="row how-cards">

        <div className="col-12 col-md-6 col-lg-3 d-flex">
          <div className="how-card">
            <div className="icon-box">🔍</div>
            <div className="step">Step 1</div>
            <h3>Discover Agents</h3>
            <p>Browse our curated marketplace of AI agents organized by industry and use case.</p>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 d-flex">
          <div className="how-card">
            <div className="icon-box">👤</div>
            <div className="step">Step 2</div>
            <h3>Create Account</h3>
            <p>Sign up with your company details and choose the subscription plan that fits your needs.</p>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 d-flex">
          <div className="how-card">
            <div className="icon-box">🚀</div>
            <div className="step">Step 3</div>
            <h3>Activate Agent</h3>
            <p>Click activate on any agent to instantly provision it to your account.</p>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 d-flex">
          <div className="how-card">
            <div className="icon-box">📈</div>
            <div className="step">Step 4</div>
            <h3>Monitor & Grow</h3>
            <p>Track performance, usage stats, and activity logs from your dashboard.</p>
          </div>
        </div>

      </div>

    </section>
  );
}

export default HowItWorks;
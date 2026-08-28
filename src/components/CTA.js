import React from "react";
import { Link } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

function CTA() {
  return (
    <section className="cta-section">

      <div className="cta-card">

        {/* <FaRobot className="cta-icon" /> */}

        <h2 className="cta-title">
          Ready to Automate Your Business?
        </h2>

        <p className="cta-desc">
          Join thousands of businesses that trust AzentMart AI to power their
          operations. Get started in minutes — no credit card required.
        </p>

        <div className="cta-buttons">

          <Link to="/signup" className="cta-primary">
            Start for Free
          </Link>

          <Link to="/marketplace" className="cta-secondary">
            Browse Agents First
          </Link>

        </div>

      </div>

    </section>
  );
}

export default CTA;
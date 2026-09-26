import React from "react";
import { FaMagic } from "react-icons/fa";

function MarketplaceHero() {
  return (
    <section className="marketplace-hero">

      <div className="marketplace-badge">
        <FaMagic className="spark-icon" />
        READY-TO-USE AI AGENTS
      </div>

      <h1 className="marketplace-title">
        Discover the Right AI Agent
        <br />
        for Your Business
      </h1>

      <p className="marketplace-desc">
        Browse, filter, and activate powerful AI agents that automate your workflows
        across sales, HR, finance, support, and more.
      </p>

    </section>
  );
}

export default MarketplaceHero;
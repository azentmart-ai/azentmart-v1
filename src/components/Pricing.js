import React from "react";

function Pricing() {

  const plans = [
    {
      name: "Free",
      price: "0",
      desc: "Access to Free-tier agents, up to 100 tasks/mo, community support, 1 active agent",
      tasks: "100 tasks/month"
    },
    {
      name: "Basic",
      price: "29",
      desc: "Access to Free and Basic agents, up to 1000 tasks/mo, email support, 3 active agents, basic analytics",
      tasks: "1000 tasks/month"
    },
    {
      name: "Pro",
      price: "79",
      desc: "Access to Free, Basic, and Pro agents, up to 10000 tasks/mo, priority support, advanced analytics",
      tasks: "10000 tasks/month"
    },
    {
      name: "Enterprise",
      price: "299",
      desc: "Access to all agents including Enterprise tier, unlimited tasks, dedicated support, custom integrations",
      tasks: "Unlimited tasks/month"
    }
  ];

  return (
    <section className="pricing-section1">

      <div className="pricing-badge1">Pricing</div>

      <h2 className="pricing-title1">
        Simple, Transparent Pricing
      </h2>

      <p className="pricing-desc1">
        Choose the plan that matches your team's size and automation needs.
        Upgrade or downgrade anytime.
      </p>

      <div className="row pricing-grid1">

        {plans.map((plan, index) => (
          <div className="col-12 col-md-6 col-lg-3 d-flex" key={index}>

            <div className="pricing-card1 w-100">

              <span className="plan-label">{plan.name}</span>

              <h3 className="price">
                ${plan.price}
              </h3>

              <p className="per-month">per month</p>

              <p className="plan-desc">
                {plan.desc}
              </p>

              <div className="task-limit">
                ✔ {plan.tasks}
              </div>

              <button className="pricing-btn">
                Get Started
              </button>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Pricing;
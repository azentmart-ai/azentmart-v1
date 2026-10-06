import React, { useState } from "react";

function PricingPage() {
  const [billing, setBilling] = useState("annual");

  const pricing = {
    growth: {
      monthly: 2999,
      annual: 2199,
    },
    pro: {
      monthly: 5999,
      annual: 4899,
    },
    business: {
      monthly: 17999,
      annual: 14799,
    }
  };

  return (
    <section className="pricing-section py-5">
      <div className="container">

        {/* HEADER */}
        <div className="text-center mb-5">
          <h2 className="fw-bold">
            Get powerful features at a price that scales with you
          </h2>

          <p className="text-muted">
            Flexible pricing with zero setup cost
          </p>

          {/* TOGGLE */}
          <div className="pricing-toggle mt-3">
            <button
              className={billing === "annual" ? "active" : ""}
              onClick={() => setBilling("annual")}
            >
              Annual (Save 25%)
            </button>

            <button
              className={billing === "monthly" ? "active" : ""}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="row g-4">

          {/* GROWTH */}
          <div className="col-lg-4">
            <div className="pricing-card blue h-100">
              <h5>Growth</h5>
              <p>Perfect for small teams starting out</p>

              <h3>
                ₹{pricing.growth[billing]}
                <span>/month</span>
              </h3>

              {billing === "annual" && (
                <p className="text-success small">Save 25% with annual billing</p>
              )}

              <button className="btn btn-outline-light w-100 mb-3">
                Select Plan
              </button>

              <ul>
                <li>✔ Broadcast messaging</li>
                <li>✔ Omnichannel inbox</li>
                <li>✔ Campaign automation</li>
                <li>✔ Basic analytics</li>
              </ul>
            </div>
          </div>

          {/* PRO */}
          <div className="col-lg-4">
            <div className="pricing-card green highlight h-100">
              <span className="badge">Best Value</span>

              <h5>Pro</h5>
              <p>Advanced automation & integrations</p>

              <h3>
                ₹{pricing.pro[billing]}
                <span>/month</span>
              </h3>

              {billing === "annual" && (
                <p className="text-success small">Save 25% with annual billing</p>
              )}

              <button className="btn btn-outline-light w-100 mb-3">
                Select Plan
              </button>

              <ul>
                <li>✔ Auto lead qualification</li>
                <li>✔ Campaign optimization</li>
                <li>✔ AI automation tools</li>
                <li>✔ Advanced analytics</li>
              </ul>
            </div>
          </div>

          {/* BUSINESS */}
          <div className="col-lg-4">
            <div className="pricing-card purple h-100">
              <h5>Business</h5>
              <p>For scaling enterprises</p>

              <h3>
                ₹{pricing.business[billing]}
                <span>/month</span>
              </h3>

              {billing === "annual" && (
                <p className="text-success small">Save 25% with annual billing</p>
              )}

              <button className="btn btn-outline-light w-100 mb-3">
                Select Plan
              </button>

              <ul>
                <li>✔ Unlimited broadcasts</li>
                <li>✔ Dedicated support</li>
                <li>✔ Advanced integrations</li>
                <li>✔ Enterprise security</li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default PricingPage;
import React from "react";

export default function BenefitsSection() {
  const features = [
    "Reply to DMs instantly",
    "Automate comment replies",
    "Capture leads in chat",
    "Recommend products automatically",
    "Reduce response time",
    "Boost conversions",
    "Handle multiple chats",
    "24/7 AI support",
    "Increase engagement",
    "Track conversations",
    "Convert followers to buyers",
    "Smart auto replies",
  ];

  return (
    <section className="insta-benefits">

      <div className="container text-center">

        {/* HEADING */}
        <h2 className="insta-benefits-title">
          What our <span>Azentmart Agents</span> can do
        </h2>

        {/* SUBTEXT */}
        <p className="insta-benefits-desc">
          Turn every DM into an opportunity. Automate conversations,
          engage instantly, and convert followers into customers — effortlessly.
        </p>

        {/* GRID */}
        <div className="insta-benefits-grid">

          {features.map((item, index) => (
            <div key={index} className="insta-benefit-card">

              {/* <div className="insta-icon">✨</div> */}

              <p>{item}</p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
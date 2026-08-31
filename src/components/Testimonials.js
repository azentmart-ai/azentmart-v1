import React from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";

function Testimonials() {

  const testimonials = [
    {
      text: "ContentCraft AI has cut our content production time by 75%. Our blog output tripled and our SEO rankings have never looked better. Absolutely worth every penny.",
      name: "Desmond Okafor",
      company: "Orion Capital Group"
    },
    {
      text: "SalesForge AI transformed our outbound pipeline. We saw a 60% increase in qualified leads within the first month — I can't imagine going back to manual prospecting.",
      name: "Priyanka Mehrotra",
      company: "NexaTech Solutions"
    },
    {
      text: "We evaluated five AI platforms before choosing this one. The depth of analytics and workflow automation is unmatched at this price point. Our ops team is obsessed.",
      name: "Bjorn Kristiansen",
      company: "Arctic Logistics"
    }
  ];

  return (
    <section className="testimonial-section">

      <div className="testimonial-badge">Testimonials</div>

      <h2 className="testimonial-title">
        Trusted by Forward-Thinking Teams
      </h2>

      <p className="testimonial-desc">
        See how businesses like yours are leveraging AzentMart AI to unlock efficiency at scale.
      </p>

      <div className="row testimonial-grid">

        {testimonials.map((t, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4 d-flex">

            <div className="testimonial-card w-100">

              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>

              <p className="testimonial-text">
                "{t.text}"
              </p>

              <div className="testimonial-user">

                <FaUserCircle className="user-icon" />

                <div>
                  <h4>{t.name}</h4>
                  <span>{t.company}</span>
                </div>

              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Testimonials;
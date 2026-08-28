import React from "react";

function WhatsAppHero() {
  return (
    <section className="wa-hero">
      <div className="container-fluid">

        <div className="row align-items-center">

          {/* LEFT */}
          <div className="col-lg-6 col-md-12 mb-4">
            <h1 className="wa-title">
              Turn every conversation into revenue —
              <br />
              scale your business on WhatsApp 
            </h1>

            <p className="wa-subtitle">
             Replace manual workflows with intelligent automation, improve response times, and gain complete visibility into your customer conversations.
            </p>

            <div className="d-flex gap-3 flex-wrap">
              <button className="btn wa-btn-primary">
                Schedule a Demo
              </button>

              <button className="btn wa-btn-outline">
                See use cases
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-6 col-md-12 position-relative text-center">

            {/* CHAT UI */}
            <div className="wa-chat">

              <div className="wa-msg user">
                Hi, I am interested in wealth consultation.
              </div>

              <div className="wa-msg bot">
                Hello! I can help you. What’s your monthly investment plan?
              </div>

              <div className="wa-msg user small">
                ₹1,00,000
              </div>

              <div className="wa-msg bot">
                Great! Please share your email for a custom plan.
              </div>

            </div>

            {/* FLOATING CARD */}
            <div className="wa-floating-card">
              20–80% Revenue Growth
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default WhatsAppHero;
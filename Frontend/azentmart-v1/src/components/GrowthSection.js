import React from "react";

function GrowthSection() {
  return (
    <section className="growth-section">
      <div className="container-fluid">

        {/* TOP HEADING */}
        <div className="text-center mb-5">
          <h2 className="growth-title">
            Built for fast-growing sales teams
          </h2>

          <p className="growth-subtitle">
            Manage conversations, nurture leads, and close deals faster — all from WhatsApp. 
            Integrate seamlessly with your CRM to keep everything in sync.
          </p>
        </div>

        <div className="row align-items-center">

          {/* LEFT CONTENT */}
          <div className="col-lg-6 mb-4">

            <h3 className="feature-title">
              Outreach that drives real results
            </h3>

            <p className="feature-text">
              Reach thousands of high-intent customers using targeted WhatsApp campaigns 
              designed to maximize engagement and conversions.
            </p>

            <p className="feature-text">
              Start meaningful conversations instantly with interested prospects and 
              respond in real-time to accelerate your sales cycle.
            </p>

          </div>

          {/* RIGHT IMAGE UI */}
          <div className="col-lg-6 text-center">

            <div className="phone-ui">

              <div className="chat-preview">
                <p>
                  Hey! We’re offering a limited-time discount on selected services. Interested?
                </p>

                <button className="chat-btn">
                  Yes, show me →
                </button>
              </div>

              <div className="catalog-ui">
                <h6>Product Catalog</h6>

                <div className="catalog-item">UAE Travel Package – ₹7,500</div>
                <div className="catalog-item">Singapore Tour – ₹2,500</div>
                <div className="catalog-item">USA Travel Plan – ₹4,500</div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default GrowthSection;
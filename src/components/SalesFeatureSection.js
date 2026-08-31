import React from "react";
import whatsappImage from "../assets/whatsapp_agent.png"; 

function SalesFeatureSection() {
  return (
    <section className="sales-section py-5">
      <div className="container">

        {/* TOP */}
        <div className="text-center mb-5">
          <h2 className="fw-bold sales-heading">
            Built to accelerate modern sales teams
          </h2>

          <p className="text-muted mx-auto sales-subtext">
            Manage conversations, track leads, and close deals faster — all within WhatsApp.
            Seamlessly integrate with your CRM to keep your workflow connected.
          </p>
        </div>

        <div className="row align-items-center">

          {/* LEFT */}
          <div className="col-lg-6 col-md-12 mb-4 text-lg-start text-center">
            <h4 className="fw-semibold mb-3">
              Conversations that drive real growth
            </h4>

            <p className="text-muted">
              Engage high-intent customers through targeted WhatsApp campaigns
              designed to increase response rates and conversions.
            </p>

            <p className="text-muted">
              Instantly connect with prospects and respond in real-time
              to accelerate your sales pipeline.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="col-lg-6 col-md-12 text-center">
            <img
              src={whatsappImage}  
              alt="WhatsApp Sales UI"
              className="img-fluid sales-image"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default SalesFeatureSection;
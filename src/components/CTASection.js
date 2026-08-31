import React from "react";

function CTASection() {
  return (
    <section className="cta-section py-5">
      <div className="container">

        <div className="cta-box d-flex flex-lg-row flex-column align-items-center justify-content-between">

          {/* LEFT TEXT */}
          <div className="cta-text text-lg-start text-center mb-3 mb-lg-0">
            <h3 className="fw-bold mb-0">
              Accelerate your sales and grow revenue with Azentmart
            </h3>
          </div>

          {/* BUTTON */}
          <div>
            <button className="btn wa-btn-primary">
              Schedule a Demo
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

export default CTASection;
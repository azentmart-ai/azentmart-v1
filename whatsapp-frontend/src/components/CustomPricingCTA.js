import React from "react";

function CustomPricingCTA() {
  const phoneNumber = "919999999999"; // dummy number

  const message = encodeURIComponent(
    "Hi, I'm interested in Azentmart plans. Can you help me choose the right one?"
  );

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <section className="custom-cta py-5">
      <div className="container">

        <h3 className="text-center fw-bold mb-4">
          Compare plans in detail
        </h3>

        <div className="custom-box">

          {/* TOP */}
          <div className="d-flex flex-lg-row flex-column justify-content-between align-items-center mb-4">
            <p className="mb-3 mb-lg-0">
              Have custom needs? Let's explore how we can tailor{" "}
              <strong>Azentmart</strong> to empower your business.
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-warning custom-btn"
            >
              Talk to Sales
            </a>
          </div>

          {/* INNER BOX */}
          <div className="inner-box d-flex flex-lg-row flex-column justify-content-between align-items-center">

            <p className="mb-3 mb-lg-0">
              Get exclusive pricing for high-volume usage — over{" "}
              <strong>1 million messages/month</strong>.
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success custom-btn"
            >
              Contact Us
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}

export default CustomPricingCTA;
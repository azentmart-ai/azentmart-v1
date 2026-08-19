import React from "react";

function AutomationFlowSection() {
  return (
    <section className="automation-section py-5">

      <div className="container">

        {/* TOP HEADING */}
        <div className="text-center mb-5">
          <h2 className="fw-bold">
            Accelerate your entire sales journey with smart automation
          </h2>

          <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
            From capturing leads to closing deals — automate every step of your sales process
            and improve efficiency without increasing workload.
          </p>
        </div>

        {/* GRID CARDS (instead of funnel) */}
        <div className="row g-4">

          <div className="col-lg-3 col-md-6">
            <div className="automation-card">
              <h6>Capture leads instantly</h6>
              <p>Engage prospects in real-time and never miss an opportunity.</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="automation-card">
              <h6>Smart lead qualification</h6>
              <p>Automatically filter high-quality leads based on your criteria.</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="automation-card">
              <h6>Intelligent routing</h6>
              <p>Assign leads to the right sales reps instantly and efficiently.</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="automation-card">
              <h6>Automated follow-ups</h6>
              <p>Send timely reminders and personalized messages without manual effort.</p>
            </div>
          </div>

        </div>

        {/* SECOND ROW */}
        <div className="row g-4 mt-1">

          <div className="col-lg-4 col-md-6">
            <div className="automation-card">
              <h6>Boost conversions</h6>
              <p>Keep leads engaged throughout the journey and close deals faster.</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="automation-card">
              <h6>Real-time insights</h6>
              <p>Track performance and optimize your sales strategy with data.</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-12">
            <div className="automation-card highlight">
              <h6>All-in-one automation</h6>
              <p>Manage your entire sales pipeline seamlessly from a single platform.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default AutomationFlowSection;
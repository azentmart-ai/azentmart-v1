import React from "react";

function FlexibilitySection() {
  return (
    <section className="flex-section py-5">

      <div className="container">

        {/* HEADING */}
        <div className="text-center mb-5">
          <h2 className="fw-bold">
            Built to adapt to your business needs
          </h2>
        </div>

        {/* CARDS */}
        <div className="row g-4">

          {/* CARD 1 */}
          <div className="col-lg-4 col-md-6">
            <div className="flex-card h-100">
              <h5 className="fw-semibold mb-3">
                Manage multiple conversations effortlessly
              </h5>

              <p className="text-muted">
                Centralize all customer interactions in one place and eliminate
                the need for personal messaging apps across your team.
              </p>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="col-lg-4 col-md-6">
            <div className="flex-card h-100">
              <h5 className="fw-semibold mb-3">
                Smooth transition with zero disruption
              </h5>

              <p className="text-muted">
                Migrate your existing workflows, chats, and automations seamlessly
                without losing valuable data or interrupting operations.
              </p>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="col-lg-4 col-md-12">
            <div className="flex-card h-100">
              <h5 className="fw-semibold mb-3">
                Controlled access for better security
              </h5>

              <p className="text-muted">
                Assign permissions based on roles to ensure the right people have
                access to the right tools and insights.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default FlexibilitySection;
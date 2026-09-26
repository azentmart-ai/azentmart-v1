import React from "react";
import appointmentImage from "../assets/appointment_flow.png"; 

function AppointmentSection() {
  return (
    <section className="appointment-section py-5">
      <div className="container">

        <div className="row align-items-center">

          {/* LEFT IMAGE */}
          <div className="col-lg-6 col-md-12 mb-4 text-center">
            <img
              src={appointmentImage}
              alt="Appointment Automation"
              className="img-fluid appointment-image"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-lg-6 col-md-12 text-lg-start text-center">

            <h3 className="fw-bold mb-3 appointment-title">
              Simplify bookings & increase attendance rates
            </h3>

            <p className="text-muted mb-3">
              Enable customers to schedule appointments instantly through WhatsApp.
              Automate confirmations, reminders, and calendar syncing — all in one place.
            </p>

            <p className="text-muted mb-4">
              Reduce missed appointments and keep your schedule optimized with smart,
              automated follow-ups.
            </p>

            {/* BULLETS */}
            <div className="appointment-points">

              <p>✔ Reduce no-shows with automated reminders</p>
              <p>✔ Instant confirmations for faster scheduling</p>
              <p>✔ Seamless calendar integration</p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default AppointmentSection;
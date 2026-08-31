import React from "react";

function VoiceAgentBooking() {
  return (
    <section className="voice-booking">
      <div className="container">
        <div className="row align-items-center">

          {/* LEFT SIDE (FLOW + CALL UI) */}
          <div className="col-lg-6">

            <div className="voice-flow">

              {/* Flow Box */}
              <div className="flow-box">
                <h5>Start Call Flow</h5>
                <p>Condition: Incoming customer call</p>
                <p>Action: AI answers instantly</p>
              </div>

              <div className="flow-box orange">
                <h6>Collect Details</h6>
                <p>“What date would you like to book?”</p>
              </div>

              <div className="flow-box red">
                <h6>Send Reminder</h6>
                <p>AI schedules automated call reminders</p>
              </div>

            </div>

          </div>


          {/* RIGHT SIDE (CONTENT) */}
          <div className="col-lg-6">

            <h2 className="section-title">
              Automate calls & increase booking conversions
            </h2>

            <p className="section-text">
              Let AI voice agents handle incoming calls, schedule appointments,
              and send reminders automatically — without human intervention.
            </p>

            <p className="section-text">
              Reduce missed calls, improve response time, and boost customer satisfaction
              with natural, human-like conversations.
            </p>

            <ul className="benefits">
              <li>✓ Never miss a customer call</li>
              <li>✓ Instant booking & confirmations</li>
              <li>✓ Automated reminders & follow-ups</li>
              <li>✓ Human-like AI voice conversations</li>
            </ul>

          </div>

        </div>
      </div>
    </section>
  );
}

export default VoiceAgentBooking;
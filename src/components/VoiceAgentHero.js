import React from "react";

function VoiceAgentHero() {
  return (
    <section className="voice-hero">
      <div className="container">
        <div className="row align-items-center">

          {/* LEFT SIDE */}
          <div className="col-lg-6">

            <h1 className="hero-title">
              Turn every call into revenue — <br />
              scale your business with AI Voice Agents
            </h1>

            <p className="hero-subtext">
              Automate inbound & outbound calls, qualify leads instantly,
              and deliver human-like conversations 24/7 without missing opportunities.
            </p>

            <div className="d-flex gap-3 mt-4">
              <button className="btn-primary">
                Try Voice Demo
              </button>

              <button className="btn-outline">
                See use cases
              </button>
            </div>

          </div>


          {/* RIGHT SIDE - VOICE CHAT UI */}
          <div className="col-lg-6 d-flex justify-content-center">

            <div className="voice-card">

              {/* Conversation */}
                <div className="chat user">
    Hi, I want to book a consultation.
                </div>

                <div className="chat bot">
                Sure! What date works best for you?
                </div>

                <div className="chat user">
                Tomorrow evening.
                </div>

                <div className="chat bot">
                I have slots at 5 PM and 7 PM. Which do you prefer?
                </div>

                <div className="chat user">
                7 PM.
                </div>

                <div className="chat bot">
                Booked! You’ll receive a confirmation shortly.
                </div>
              {/* Voice Indicator */}
              <div className="voice-status">
                <span className="dot"></span>
                AI Speaking...
              </div>

              {/* Badge */}
              {/* <div className="growth-badge">
                20–80% Revenue Growth
              </div> */}

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default VoiceAgentHero;
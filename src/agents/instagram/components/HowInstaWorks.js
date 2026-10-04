import React from "react";

export default function HowInstaWorks() {
  return (
    <div className="insta-flow">

      <h2 className="flow-title">
        How <span>Instagram Agent</span> works
      </h2>

      <div className="insta-steps">

        {/* STEP 1 */}
        <div className="flow-step">
          <div className="step-number">1</div>

          <div className="step-card">
            <div className="mini-ui connect">
              <p>Instagram + Azentmart</p>
              <button>Connect Account</button>
            </div>

            <h3>Connect</h3>
            <p>Link your Instagram in seconds with secure login.</p>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="flow-step">
          <div className="step-number">2</div>

          <div className="step-card premium-train">
            <div className="train-header">
              AI Training in Progress
            </div>

            <div className="train-progress">
              <div className="train-fill"></div>
            </div>

            <div className="train-items">
              <div className="chip">📄 Profile</div>
              <div className="chip">📸 Posts</div>
              <div className="chip">💬 Messages</div>
            </div>

            <h3>Train</h3>
            <p>Your AI learns from your content and conversations.</p>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="flow-step">
          <div className="step-number">3</div>

          <div className="step-card">
            <div className="mini-ui chat">
              <div className="msg user">Is this available?</div>
              <div className="msg ai">Yes! Order below 👇</div>
            </div>

            <h3>Automate</h3>
            <p>Reply instantly and convert chats into customers.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
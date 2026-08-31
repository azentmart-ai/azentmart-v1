import React from "react";

export default function HowFacebookWorks() {
  return (
    <div className="fb-flow">

      <h2 className="fb-flow-title">
        How <span>Facebook Agent</span> works
      </h2>

      <div className="fb-steps">

        {/* STEP 1 */}
        <div className="fb-flow-step">
          <div className="fb-step-number">1</div>

          <div className="fb-step-card">
            <div className="fb-mini-ui connect">
              <p>Facebook + Azentmart</p>
              <button>Connect Account</button>
            </div>

            <h3>Connect</h3>
            <p>Securely link your Facebook page in seconds.</p>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="fb-flow-step">
          <div className="fb-step-number">2</div>

          <div className="fb-step-card">
            <div className="fb-train-header">
              AI Training in Progress
            </div>

            <div className="fb-train-progress">
              <div className="fb-train-fill"></div>
            </div>

            <div className="fb-train-items">
              <div className="fb-chip">📄 Page</div>
              <div className="fb-chip">📢 Posts</div>
              <div className="fb-chip">💬 Messages</div>
            </div>

            <h3>Train</h3>
            <p>Your AI learns from Messenger chats and content.</p>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="fb-flow-step">
          <div className="fb-step-number">3</div>

          <div className="fb-step-card">
            <div className="fb-mini-ui chat">
              <div className="msg user">Is this available?</div>
              <div className="msg ai">Yes! You can order now 👇</div>
            </div>

            <h3>Automate</h3>
            <p>Reply instantly and convert chats into customers.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
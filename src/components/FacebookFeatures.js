import React from "react";

const FacebookFeatures = () => {
  return (
    <div className="fbf-container">

      <div className="fbf-top">

        {/* LEFT */}
        <div className="fbf-card fbf-blue">
          <h3>
            Automate your <span>Messages</span>
          </h3>
          <p>Never miss a message — automatically collect and respond</p>

          <div className="fbf-chat">
            <div className="fbf-badge">Limited deal 🔥</div>

            <div className="fbf-msg fbf-left">Hey 👋 Any offers?</div>
            <div className="fbf-msg fbf-right fbf-highlight">
              Yes 🎉 Flat 20% OFF!
            </div>
            <div className="fbf-msg fbf-left">Tap below 👉</div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="fbf-card fbf-purple">
          <h3>
            Reply to <span>comments</span>
          </h3>
          <p>Engage your audience instantly with AI replies.</p>

          <div className="fbf-chat">
            <div className="fbf-msg fbf-left">
              <b>rahul_23</b><br />
              Do you have sizes available?
            </div>

            <div className="fbf-msg fbf-right">
              @rahul_23 Check your inbox 💬
            </div>

            <div className="fbf-msg fbf-right fbf-highlight">
              sure@email.com 🔥
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="fbf-bottom">
        <h2>
          Generate <span>Leads</span>
        </h2>
        <p>
          Turn conversations into customers — automatically capture and convert.
        </p>

        <div className="fbf-leads-wrap">

          {/* LEFT */}
          <div className="fbf-leads-left">
            <h4>Facebook Leads</h4>

            <div className="fbf-user">
              <div className="fbf-avatar"></div>
              <div>
                <strong>Ananya</strong>
                <p>ananya@email.com</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="fbf-leads-right">

            <div className="fbf-flow">
              <span>Message</span>
              <span>Email</span>
              <span>Conversion</span>
            </div>

            <div className="fbf-msg fbf-left">Yes 🎉 30% OFF today!</div>
            <div className="fbf-msg fbf-left">Can I get your email?</div>
            <div className="fbf-msg fbf-right fbf-highlight">
              sure@email.com
            </div>
            <div className="fbf-msg fbf-left">
              Perfect 🎉 Here's your offer
            </div>

            <button className="fbf-btn">Shop Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacebookFeatures;
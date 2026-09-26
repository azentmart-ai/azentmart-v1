import React from "react";
// import girl from "../assets/ai-girl.png";

export default function InstaFeature() {
  return (
    <div className="insta-dual">
      <div className="container">

        <div className="row g-4">

          {/* ================= LEFT: AUTOMATE DMs ================= */}
          <div className="col-lg-6">
            <div className="insta-card">

              <h3>
                Automate your <span>DMs</span>
              </h3>
              <p>
                Never miss a message — automatically collect, organize, and respond instantly.
              </p>

              <div className="insta-visual pink">

                {/* BACK STACK */}
                <div className="dm-stack stack1"></div>
                <div className="dm-stack stack2"></div>

                {/* MAIN CHAT */}
                <div className="insta-chat">

                  <div className="insta-header">
                    <div className="avatar"></div>
                    <span>instastore</span>
                  </div>

                  <div className="chat-area">

                    <div className="msg left">
                      Hey 👋 Any offers?
                    </div>

                    <div className="msg right gradient">
                      Yes 🎉 Flat 20% OFF!
                    </div>

                    <div className="msg right gradient small">
                      Tap below 👇
                    </div>

                    <button className="insta-btn">
                      View Offer
                    </button>

                  </div>

                </div>

                {/* FLOAT MSG */}
                <div className="floating-msg">
                  Limited deal 🔥
                </div>

                {/* GIRL */}
                {/* <img src={girl} alt="" className="insta-girl premium" /> */}

              </div>
            </div>
          </div>

          {/* ================= RIGHT: COMMENTS ================= */}
          <div className="col-lg-6">
            <div className="insta-card">

              <h3>
                Reply to <span>comments</span>
              </h3>
              <p>
                Engage your audience instantly with AI replies — no manual effort.
              </p>

              <div className="insta-visual purple">

                {/* COMMENT CARD */}
                <div className="comment-card">

                  <div className="comment">
                    <div className="avatar small"></div>
                    <div>
                      <b>rahul_23</b>
                      <p>Do you have sizes available?</p>
                    </div>
                  </div>

                  <div className="reply-box">
                    @rahul_23 Check your DM 💬
                  </div>

                </div>

                {/* DM POPUP */}
                <div className="dm-popup premium">
                  Hi Rahul 👋 Details sent!
                </div>

                {/* EMOJI */}
                <div className="emoji">
                  😍🔥
                </div>

              </div>
            </div>
          </div>

        </div>
        {/* ================= WIDE LEADS CARD ================= */}
        <div className="row mt-4">
        <div className="col-12">
        <div className="insta-wide-card">

        {/* BACKGROUND LOGO */}
        <div className="insta-bg-logo"></div>

        {/* HEADER */}
        <div className="insta-wide-header text-center">
            <h2>
            Generate <span>leads</span>
            </h2>
            <p>
            Turn conversations into customers — capture details, follow up instantly, and close sales.
            </p>
        </div>

        {/* BODY */}
        <div className="insta-wide-body">

            {/* LEFT */}
            <div className="lead-left">
            <div className="lead-header">
                <span className="insta-logo"></span>
                <b>Instagram Leads</b>
            </div>

            <div className="lead-card active">
                <div className="avatar small"></div>
                <div>
                <b>Ananya</b>
                <p>ananya@email.com</p>
                </div>
            </div>

            <div className="lead-card blur"></div>
            <div className="lead-card blur"></div>
            </div>

            {/* CENTER FLOW */}
            <div className="lead-center">

            <div className="flow-step">DM</div>

            <div className="flow-line"></div>

            <div className="flow-step">Email</div>

            <div className="flow-line"></div>

            <div className="flow-step highlight">Conversion</div>

            </div>

            {/* RIGHT */}
            <div className="lead-chat">

            <div className="msg right gradient">
                Do you have offers on sneakers?
            </div>

            <div className="msg left">
                Yes 👟 30% OFF today!
            </div>

            <div className="msg left">
                Can I get your email?
            </div>

            <div className="msg right gradient small">
                sure@email.com
            </div>

            <div className="msg left">
                Perfect 🎉 Here’s your offer
            </div>

            <button className="insta-btn">
                Shop Now
            </button>

            </div>

        </div>
        </div>
        </div>
        </div>

      </div>
    </div>
  );
}
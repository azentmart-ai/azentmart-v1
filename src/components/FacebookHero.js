import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import girl from "../assets/facebookgirl.png"; 
import product1 from "../assets/Instastreetwear.png";
import product2 from "../assets/InstaSummerwear.png";

export default function FacebookHero() {
  const navigate = useNavigate();

  const fullText =
    "Hey 👋 Yes! We've got some great picks for you. Check them out below 👇";

  const [text, setText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fb-hero">

      {/* BACKGROUND */}
      <div className="fb-bg1"></div>
      <div className="fb-bg2"></div>

      <div className="container position-relative">
        <div className="row align-items-start">

          {/* LEFT */}
          <div className="col-lg-6 col-md-12 mb-5 mb-lg-0">
            <p className="fb-tag">Azentmart Facebook Agent</p>

            <h1 className="fb-title">
              AI Replies <br />
              for Your Facebook
            </h1>

            <p className="fb-desc">
              Capture every Messenger chat, reply instantly,
              <br />
              and convert customers automatically.
            </p>

            <div className="d-flex gap-3 flex-wrap">
              <button
                className="fb-primary"
                onClick={() => navigate("/connect-facebook")}
              >
                Create Facebook Agent
              </button>

              <button
                className="fb-secondary"
                onClick={() => {
                  document
                    .getElementById("demo-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                See Demo
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-6 col-md-12">
            <div className="fb-right mx-auto">

              {/* CHAT */}
              <div className="fb-chatCard">
                <div className="fb-chatInner">

                  {/* USER */}
                  <div className="fb-user">
                    <div className="fb-avatar"></div>
                    <div className="fb-bubble white">
                      Hey! Do you have trendy outfits under ₹2000?
                    </div>
                  </div>

                  {/* AI */}
                  <div className="fb-ai">
                    <p className="fb-typing">{text}</p>

                    <div className="fb-products">
                      <div className="fb-product">
                        <img src={product1} alt="" />
                        <p>Casual Streetwear</p>
                        <button>Shop Now</button>
                      </div>

                      <div className="fb-product">
                        <img src={product2} alt="" />
                        <p>Summer Outfit</p>
                        <button>Shop Now</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* GIRL */}
              <img src={girl} alt="" className="fb-girl" />

              {/* FACEBOOK ICON */}
              {/* <div className="fb-icon">f</div> */}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
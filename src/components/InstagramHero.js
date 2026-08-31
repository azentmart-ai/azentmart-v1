import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import girl from "../assets/instagirl.png";
import product1 from "../assets/Instastreetwear.png";
import product2 from "../assets/InstaSummerwear.png";

export default function InstagramHero() {
  const navigate = useNavigate();
  const fullText =
    "Hey 👋 Ye!! We've got some trending picks for you. Check them out below 👇";

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
    <div className="insta-hero">

      {/* BACKGROUND GLOW */}
      <div className="insta-bg1"></div>
      <div className="insta-bg2"></div>

      <div className="container position-relative">
        <div className="row align-items-start">
          {/* LEFT */}
          <div className="col-lg-6 col-md-12 mb-5 mb-lg-0">
            <p className="insta-tag">Azentmart Instagram Agent</p>

            <h1 className="insta-title">
              AI Replies <br />
              for Your Instagram
            </h1>

            <p className="insta-desc">
              Capture every DM, reply instantly,
              <br />
              and convert followers into customers automatically.
            </p>

            <div className="d-flex gap-3 flex-wrap">
              <button
                className="insta-primary"
                onClick={() => navigate("/connect-instagram")}
              >
                Create Instagram Agent
              </button>
              <button
                className="insta-secondary"
                onClick={() => {
                  document
                    .getElementById("demo-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                See Demo
              </button>            
              </div>

            {/* <p className="insta-free">– it’s free!</p> */}
          </div>

          {/* RIGHT */}
          <div className="col-lg-6 col-md-12">
            <div className="insta-right mx-auto">

              {/* OUTER CARD */}
              <div className="insta-chatCard">

                <div className="insta-chatInner">

                  {/* USER */}
                  <div className="insta-user">
                    <div className="insta-avatar"></div>
                    <div className="insta-bubble white">
                      Hey! Do you have trendy outfits under ₹2000?
                    </div>
                  </div>

                  {/* AI */}
                  <div className="insta-ai">
                    <p className="insta-typing">{text}</p>

                    <div className="insta-products">
                      <div className="insta-product">
                        <img src={product1} alt="" />
                        <p>Casual Streetwear</p>
                        <button>Shop Now</button>
                      </div>

                      <div className="insta-product">
                        <img src={product2} alt="" />
                        <p>Summer Outfit</p>
                        <button>Shop Now</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* GIRL */}
              <img src={girl} alt="" className="insta-girl" />

             

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
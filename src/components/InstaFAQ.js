import React, { useState } from "react";

export default function InstaFAQ() {
  const faqs = [
    {
      title: "Reply to DMs",
      desc: "Your AI instantly replies to customer messages, FAQs, and inquiries 24/7.",
      type: "dm",
    },
    {
      title: "Reply to comments",
      desc: "Automatically engage with comments and guide users to DM.",
      type: "comments",
    },
    {
      title: "Story replies & mentions",
      desc: "Reply instantly to story mentions and interactions.",
      type: "story",
    },
    {
      title: "Recommend products",
      desc: "Suggest products directly in chat.",
      type: "product",
    },
    {
      title: "Capture leads",
      desc: "Collect emails and customer info automatically.",
      type: "leads",
    },
    {
      title: "Automate bookings",
      desc: "Handle appointments without manual work.",
      type: "booking",
    },
  ];

  const [active, setActive] = useState(0);

  const renderUI = () => {
    const type = faqs[active].type;

    switch (type) {
      case "dm":
        return (
          <>
            <div className="msg left">Hey 👋 Any offers?</div>
            <div className="msg right">Yes 🎉 Flat 20% OFF!</div>
            <div className="msg right gradient">Tap below 👇</div>
            <button className="insta-btn">View Offer</button>
          </>
        );

      case "comments":
        return (
          <>
            <div className="comment">
              <b>rahul_23</b> Do you have sizes?
            </div>
            <div className="reply">@rahul_23 Check your DM 📩</div>
            <div className="msg right gradient">Details sent!</div>
          </>
        );

      case "story":
        return (
          <>
            <div className="msg left">🔥 Loved your story!</div>
            <div className="msg right gradient">
              Thanks! Check DM 👇
            </div>
          </>
        );

      case "product":
        return (
          <>
            <div className="msg left">Show me trending outfits</div>
            <div className="product-card">
              <img src="/product1.png" alt="" />
              <p>Summer Outfit</p>
              <button>Shop Now</button>
            </div>
          </>
        );

      case "leads":
        return (
          <>
            <div className="msg left">Send details</div>
            <div className="msg right">Drop your email 📩</div>
            <div className="msg left">user@email.com</div>
            <div className="msg right gradient">
              Got it! Sending now 🚀
            </div>
          </>
        );

      case "booking":
        return (
          <>
            <div className="msg left">Book appointment</div>
            <div className="msg right">Available slots 👇</div>
            <div className="options">
              <span>3:00 PM</span>
              <span>5:00 PM</span>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <section className="insta-faq">
      <h2>
        Engage Instantly. <span>Automatically.</span>
      </h2>

      <div className="faq-container">

        {/* LEFT */}
        <div className="faq-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${active === index ? "active" : ""}`}
              onClick={() => setActive(index)}
            >
              <h4>{faq.title}</h4>
              {active === index && <p>{faq.desc}</p>}
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="faq-right">
          <div className="insta-phone">

            <div className="insta-header">instastore</div>

            <div className="insta-chat">
              {renderUI()}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
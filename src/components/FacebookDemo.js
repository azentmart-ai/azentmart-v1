import React, { useState } from "react";

export default function FacebookDemo() {
  const [activeTab, setActiveTab] = useState("business");
  const [activeOption, setActiveOption] = useState(0);

  const data = {
    business: {
      title: "Facebook Shops",
      desc: "Convert Messenger chats into sales with instant replies and product suggestions.",
      options: [
        {
          label: "Instant Replies",
          chat: "Hey! 😊 Yes, this product is available. Want me to show options?",
        },
        {
          label: "Product Suggestions",
          chat: "Here are some trending picks you might like 👇",
        },
        {
          label: "Store Info",
          chat: "We’re open from 10 AM – 9 PM 🕘 Visit us anytime!",
        },
        {
          label: "Order Updates",
          chat: "Your order 📦 is out for delivery and will arrive today!",
        },
      ],
    },

    creator: {
      title: "Facebook Creators",
      desc: "Reply to followers automatically and never miss a message.",
      options: [
        {
          label: "Share Links",
          chat: "Here’s the link you asked for 🔗 Let me know your thoughts!",
        },
        {
          label: "Collaboration",
          chat: "Sounds great! 🤝 Let’s collaborate — sending details now.",
        },
        {
          label: "Free Resources",
          chat: "Here’s your free guide 🎁 Enjoy!",
        },
        {
          label: "Fan Replies",
          chat: "Thanks for your support ❤️ More content coming soon!",
        },
      ],
    },

    education: {
      title: "Online Learning",
      desc: "Answer student queries instantly with Messenger automation.",
      options: [
        {
          label: "Course Enrollment",
          chat: "You can enroll here 🎓 Limited seats available!",
        },
        {
          label: "Schedule",
          chat: "Your next class is at 4 PM today ⏰",
        },
        {
          label: "Ask Doubts",
          chat: "Happy to help 😊 What’s your question?",
        },
        {
          label: "Study Material",
          chat: "Here are your notes 📚 Download anytime.",
        },
      ],
    },

    health: {
      title: "Clinics & Wellness",
      desc: "Automate appointments and patient communication easily.",
      options: [
        {
          label: "Book Appointment",
          chat: "We have a slot at 5 PM today 🩺 Shall I confirm it?",
        },
        {
          label: "Doctor Info",
          chat: "Our specialist is available this evening.",
        },
        {
          label: "Help Desk",
          chat: "Tell me your concern, I’ll assist you right away 😊",
        },
        {
          label: "Health Tips",
          chat: "Stay hydrated 💧 and take proper rest.",
        },
      ],
    },
  };

  const current = data[activeTab];

  return (
    <div id="demo-section" className="fb-demo-section">

      <h2 className="fb-demo-title">
        <span className="fb-highlight">Demo</span> Facebook Agent in action
      </h2>

      <p className="fb-demo-sub">
        Smart Messenger replies that convert conversations into results.
      </p>

      {/* TABS */}
      <div className="fb-demo-tabs">
        {Object.keys(data).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setActiveOption(0);
            }}
            className={activeTab === tab ? "active" : ""}
          >
            {data[tab].title}
          </button>
        ))}
      </div>

      {/* CARD */}
      <div className="fb-demo-card">

        {/* LEFT */}
        <div className="fb-demo-left">
          <h3>{current.title}</h3>
          <p>{current.desc}</p>

          <div className="fb-demo-options">
            {current.options.map((item, i) => (
              <div
                key={i}
                className={`fb-demo-option ${
                  activeOption === i ? "active" : ""
                }`}
                onClick={() => setActiveOption(i)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="fb-demo-right">
          <div className="fb-phone">

            {/* HEADER (Messenger style) */}
            <div className="fb-chat-header">
              <div className="avatar"></div>
              <span>AI Assistant</span>
            </div>

            <div className="fb-chat">
              <div className="fb-msg user">Hi 👋</div>
              <div className="fb-msg ai">
                {current.options[activeOption].chat}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
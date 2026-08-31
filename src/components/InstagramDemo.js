import React, { useState } from "react";

export default function InstagramDemo() {
  const [activeTab, setActiveTab] = useState("business");
  const [activeOption, setActiveOption] = useState(0);

    const data = {
    business: {
        title: "Online Stores",
        desc: "Turn Instagram chats into sales with smart replies and instant product suggestions.",
        options: [
        {
            label: "Quick Customer Replies",
            chat: "Hey! 😊 Yes, this item is in stock. Want me to share details?",
        },
        {
            label: "Suggest Products",
            chat: "Based on your interest, here are some top picks you’ll love 👇",
        },
        {
            label: "Business Info",
            chat: "We’re open daily from 10 AM – 9 PM. Visit anytime!",
        },
        {
            label: "Order Assistance",
            chat: "I found your order 📦 It’s arriving tomorrow. Need anything else?",
        },
        ],
    },

    creator: {
        title: "Creators & Influencers",
        desc: "Engage your audience automatically and never miss a DM again.",
        options: [
        {
            label: "Share Content Links",
            chat: "Here’s the link you asked for 🔗 Let me know what you think!",
        },
        {
            label: "Brand Collaboration",
            chat: "Sounds exciting! 💼 Let’s connect — fill this quick form.",
        },
        {
            label: "Send Resources",
            chat: "Here’s your free resource 🎁 Hope you find it helpful!",
        },
        {
            label: "Audience Engagement",
            chat: "Appreciate your support ❤️ More content coming soon!",
        },
        ],
    },

    education: {
        title: "Learning Platforms",
        desc: "Help students with instant answers, schedules, and resources.",
        options: [
        {
            label: "Enroll in Course",
            chat: "You can enroll directly here 🎓 Limited seats available!",
        },
        {
            label: "View Timetable",
            chat: "Your next session is at 4 PM today. Don’t miss it!",
        },
        {
            label: "Ask Questions",
            chat: "I’m here to help 😊 What would you like to know?",
        },
        {
            label: "Get Study Material",
            chat: "Here are your notes 📚 Download anytime.",
        },
        ],
    },

    health: {
        title: "Wellness & Clinics",
        desc: "Automate bookings, responses, and patient communication.",
        options: [
        {
            label: "Schedule Visit",
            chat: "We’ve got availability today at 5 PM. Shall I book it?",
        },
        {
            label: "Doctor Info",
            chat: "Our specialist is available this evening 🩺",
        },
        {
            label: "General Help",
            chat: "Happy to assist! Tell me your concern.",
        },
        {
            label: "Recovery Tips",
            chat: "Stay hydrated 💧 and take proper rest for faster recovery.",
        },
        ],
    },
    };

  const current = data[activeTab];

  return (
    <div id="demo-section" className="demo-section">

      <h2 className="demo-title">
        <span className="demo-highlight">Demo</span> Instagram Agent in action
      </h2>

      <p className="demo-sub">
        From auto-replies to smart sales, it’s all here.
      </p>

      {/* TABS */}
      <div className="demo-tabs">
        {Object.keys(data).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setActiveOption(0); // reset option
            }}
            className={activeTab === tab ? "active" : ""}
          >
            {data[tab].title}
          </button>
        ))}
      </div>

      {/* CARD */}
      <div className="demo-card">

        {/* LEFT */}
        <div className="demo-left">
          <h3>{current.title}</h3>
          <p>{current.desc}</p>

          <div className="demo-options">
            {current.options.map((item, i) => (
              <div
                key={i}
                className={`demo-option ${activeOption === i ? "active" : ""}`}
                onClick={() => setActiveOption(i)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="demo-right">
          <div className="phone">
            <div className="chat">
              <div className="msg user">Hi 👋</div>
              <div className="msg ai">
                {current.options[activeOption].chat}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
import React, { useState } from "react";

export default function FacebookFAQ() {
  const [active, setActive] = useState(null);

  const faqs = [
    {
      question: "How does the Facebook agent reply to comments?",
      answer:
        "The agent automatically detects comments on your posts and sends instant replies or directs users to Messenger for further conversation.",
    },
    {
      question: "Can it send messages in Facebook Messenger automatically?",
      answer:
        "Yes, it can instantly reply to incoming messages, share product details, offers, and even collect user information without manual effort.",
    },
    {
      question: "Will it help me generate leads from Facebook?",
      answer:
        "Absolutely. The agent captures user details like email or phone number through conversations and turns engagement into qualified leads.",
    },
    {
      question: "Can I customize the replies and conversation flow?",
      answer:
        "Yes, you can fully customize responses, set conditions, and create flows tailored to your business needs.",
    },
    {
      question: "Does it work 24/7 even when I'm offline?",
      answer:
        "Yes, the agent runs круглосуточно (24/7), ensuring no message or comment goes unanswered.",
    },
    {
      question: "Is it suitable for small businesses?",
      answer:
        "Definitely. Whether you're a local business or a growing brand, it helps automate communication and increase conversions effortlessly.",
    },
  ];

  return (
    <section className="fbfaq-container">
      <div className="container">

        <h2 className="fbfaq-title">
          Frequently Asked <span>Questions</span>
        </h2>

        <div className="fbfaq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`fbfaq-item ${active === index ? "active" : ""}`}
              onClick={() => setActive(active === index ? null : index)}
            >
              <div className="fbfaq-question">
                {faq.question}
                <span>{active === index ? "−" : "+"}</span>
              </div>

              <div className="fbfaq-answer">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
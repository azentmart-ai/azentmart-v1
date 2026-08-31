import React, { useState } from "react";

import {
    FaPlus,
    FaMinus
} from "react-icons/fa";

const faqData = [

    {
        question: "How does AzentMart AI help during interviews?",
        answer:
            "AzentMart AI listens to the interviewer's questions in real time, converts speech into text, understands the context, and instantly generates relevant answers to help you respond confidently."
    },

    {
        question: "Which interview platforms are supported?",
        answer:
            "AzentMart AI works seamlessly with Google Meet, Microsoft Teams, Zoom, and other browser-based interview platforms."
    },

    {
        question: "Is my interview data secure?",
        answer:
            "Yes. Your interview data is encrypted during transmission and storage. We prioritize privacy and never share your information with third parties."
    },

    {
        question: "Can I practice mock interviews?",
        answer:
            "Absolutely! Practice interviews allow you to improve communication, receive AI feedback, and build confidence before your actual interview."
    },

    {
        question: "Can I cancel my subscription anytime?",
        answer:
            "Yes. You can upgrade, downgrade, or cancel your subscription whenever you want without hidden fees."
    },

    {
        question: "Does AzentMart support multiple languages?",
        answer:
            "Yes. AzentMart AI supports multiple languages and continues to expand language coverage for global users."
    }

];

const YourAIFAQ = () => {

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {

        if (activeIndex === index) {

            setActiveIndex(null);

        } else {

            setActiveIndex(index);

        }

    };

    return (

<section className="faq-section">

<div className="faq-container">

<div className="faq-header">

<span className="section-badge">

Frequently Asked Questions

</span>

<h2>

Everything You Need To Know

</h2>

<p>

Find answers to the most common questions about AzentMart AI,
its features, pricing, security, and interview assistance.

</p>

</div>
<div className="faq-list">

{

    faqData.map((item, index) => (

        <div

            key={index}

            className={

                activeIndex === index

                    ? "faq-item active"

                    : "faq-item"

            }

        >

            <button

                className="faq-question"

                onClick={() => toggleFAQ(index)}

            >

                <span>

                    {item.question}

                </span>

                <div className="faq-icon">

                    {

                        activeIndex === index

                            ? <FaMinus />

                            : <FaPlus />

                    }

                </div>

            </button>

            <div

                className={

                    activeIndex === index

                        ? "faq-answer open"

                        : "faq-answer"

                }

            >

                <p>

                    {item.answer}

                </p>

            </div>

        </div>

    ))

}

</div>
<div className="faq-footer">

    <h3>

        Still Have Questions?

    </h3>

    <p>

        Our team is here to help you get the most out of AzentMart AI.
        Reach out anytime, and we'll be happy to assist you.

    </p>

    <div className="faq-actions">

        <button className="faq-btn primary">

            Contact Support

        </button>

        <button className="faq-btn secondary">

            Book a Demo

        </button>

    </div>

</div>

</div>

</section>

);

};

export default YourAIFAQ;
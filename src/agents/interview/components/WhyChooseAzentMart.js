import React from "react";

import {
    BsCheckCircleFill,
    BsXCircleFill
} from "react-icons/bs";

const comparison = [

    {
        traditional: "Take notes manually",
        ai: "Live AI transcription"
    },

    {
        traditional: "Forget important answers",
        ai: "Instant AI-generated responses"
    },

    {
        traditional: "Miss interviewer intent",
        ai: "AI understands every question"
    },

    {
        traditional: "No interview feedback",
        ai: "Performance & confidence analysis"
    },

    {
        traditional: "Practice completely alone",
        ai: "Real-time interview copilot"
    }

];

const stats = [

    {
        number: "50K+",
        title: "Interviews Assisted"
    },

    {
        number: "98%",
        title: "Speech Accuracy"
    },

    {
        number: "94%",
        title: "Success Rate"
    }

];

const WhyChooseAzentMart = () => {

    return (

<section className="why-section">

<div className="why-container">

<div className="why-header">

<span className="section-badge">

Why Choose AzentMart

</span>

<h2>

The Smarter Way To Ace Every Interview

</h2>

<p>

Traditional interviews leave candidates struggling with note-taking,
remembering answers, and staying confident.
AzentMart AI becomes your intelligent interview copilot,
helping you focus on the conversation while AI does the rest.

</p>

</div>
{/* ================= COMPARISON ================= */}

<div className="comparison-wrapper">

    {/* Traditional */}

    <div className="comparison-card traditional-card">

        <div className="comparison-title">

            <BsXCircleFill className="comparison-icon negative" />

            <h3>

                Traditional Interviews

            </h3>

        </div>

        <div className="comparison-list">

            {

                comparison.map((item, index) => (

                    <div
                        className="comparison-row"
                        key={index}
                    >

                        <BsXCircleFill className="row-icon negative" />

                        <span>

                            {item.traditional}

                        </span>

                    </div>

                ))

            }

        </div>

    </div>

    {/* VS */}

    <div className="vs-circle">

        VS

    </div>

    {/* AzentMart */}

    <div className="comparison-card ai-card">

        <div className="comparison-title">

            <BsCheckCircleFill className="comparison-icon positive" />

            <h3>

                AzentMart AI

            </h3>

        </div>

        <div className="comparison-list">

            {

                comparison.map((item, index) => (

                    <div
                        className="comparison-row"
                        key={index}
                    >

                        <BsCheckCircleFill className="row-icon positive" />

                        <span>

                            {item.ai}

                        </span>

                    </div>

                ))

            }

        </div>

    </div>

</div>
{/* ================= STATS ================= */}

<div className="stats-section">

    {

        stats.map((item, index) => (

            <div
                className="stat-card"
                key={index}
            >

                <h3>

                    {item.number}

                </h3>

                <p>

                    {item.title}

                </p>

            </div>

        ))

    }

</div>

{/* ================= CTA ================= */}

<div className="why-cta">

    <h3>

        Ready To Transform Your Interview Experience?

    </h3>

    <p>

        Join thousands of professionals using AzentMart AI to
        prepare smarter, answer confidently, and perform better
        in every interview.

    </p>

    <button className="why-btn">

        Start Your Free Trial

    </button>

</div>

</div>

</section>

);

};

export default WhyChooseAzentMart;
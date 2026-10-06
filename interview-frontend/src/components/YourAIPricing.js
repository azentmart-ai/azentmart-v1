import React from "react";

import {
    FaCheck,
    FaTimes,
    FaCrown
} from "react-icons/fa";

const pricingPlans = [

    {
        id: 1,
        name: "Starter",
        price: "₹999",
        duration: "/month",
        popular: false,
        button: "Get Started",

        features: [

            {
                text: "20 AI Interviews / Month",
                available: true
            },

            {
                text: "Live AI Transcription",
                available: true
            },

            {
                text: "AI Answer Generator",
                available: true
            },

            {
                text: "Interview Performance Reports",
                available: true
            },

            {
                text: "Email Support",
                available: true
            },

            {
                text: "Resume Analysis",
                available: false
            },

            {
                text: "Priority Support",
                available: false
            },

            {
                text: "Team Dashboard",
                available: false
            }

        ]

    },

    {
        id: 2,
        name: "Professional",
        price: "₹1999",
        duration: "/month",
        popular: true,
        button: "Start Free Trial",

        features: [

            {
                text: "Unlimited AI Interviews",
                available: true
            },

            {
                text: "Real-Time AI Copilot",
                available: true
            },

            {
                text: "Unlimited AI Answers",
                available: true
            },

            {
                text: "Advanced Analytics",
                available: true
            },

            {
                text: "Resume Analysis",
                available: true
            },

            {
                text: "Priority Support",
                available: true
            },

            {
                text: "Interview History",
                available: true
            },

            {
                text: "Everything Included",
                available: true
            }

        ]

    },

    {
        id: 3,
        name: "Enterprise",
        price: "Custom",
        duration: "",
        popular: false,
        button: "Contact Sales",

        features: [

            {
                text: "Unlimited Everything",
                available: true
            },

            {
                text: "Team Dashboard",
                available: true
            },

            {
                text: "Admin Portal",
                available: true
            },

            {
                text: "API Access",
                available: true
            },

            {
                text: "Dedicated Account Manager",
                available: true
            },

            {
                text: "Custom AI Models",
                available: true
            },

            {
                text: "SSO Authentication",
                available: true
            },

            {
                text: "24×7 Premium Support",
                available: true
            }

        ]

    }

];

const YourAIPricing = () => {

    return (

<section className="pricing-section">

<div className="pricing-container">

<div className="pricing-header">

<span className="section-badge">

Pricing

</span>

<h2>

Simple, Transparent Pricing

</h2>

<p>

Choose the perfect plan for your interview journey.
Upgrade anytime as your career grows with AzentMart AI.

</p>

</div>
<div className="pricing-grid">

{

    pricingPlans.map((plan) => (

        <div

            key={plan.id}

            className={

                plan.popular

                ? "pricing-card popular"

                : "pricing-card"

            }

        >

            {

                plan.popular && (

                    <div className="popular-badge">

                        <FaCrown />

                        <span>

                            Most Popular

                        </span>

                    </div>

                )

            }

            <div className="plan-header">

                <h3>

                    {plan.name}

                </h3>

                <div className="price-wrapper">

                    <span className="price">

                        {plan.price}

                    </span>

                    <span className="duration">

                        {plan.duration}

                    </span>

                </div>

            </div>

            <div className="plan-features">

                {

                    plan.features.map((feature, index) => (

                        <div

                            className="feature-item"

                            key={index}

                        >

                            {

                                feature.available ? (

                                    <FaCheck className="feature-icon success" />

                                ) : (

                                    <FaTimes className="feature-icon disabled" />

                                )

                            }

                            <span>

                                {feature.text}

                            </span>

                        </div>

                    ))

                }

            </div>

            <button

                className={

                    plan.popular

                    ? "pricing-btn primary"

                    : "pricing-btn secondary"

                }

            >

                {plan.button}

            </button>

        </div>

    ))

}

</div>
<div className="pricing-footer">

    <div className="pricing-note">

        <FaCheck className="note-icon" />

        <span>

            No credit card required to start your free trial.

        </span>

    </div>

    <div className="pricing-note">

        <FaCheck className="note-icon" />

        <span>

            Cancel anytime with no hidden charges.

        </span>

    </div>

    <div className="pricing-note">

        <FaCheck className="note-icon" />

        <span>

            Secure payments with enterprise-grade encryption.

        </span>

    </div>

</div>

</div>

</section>

);

};

export default YourAIPricing;
import React, { useState } from "react";

import {
    FiArrowRight,
    FiChevronDown,
    FiCreditCard,
    FiEyeOff,
    FiMonitor,
    FiMousePointer,
    FiShield,
    FiSmartphone,
    FiX,
    FiZap,
} from "react-icons/fi";


const UpgradePage = () => {
    /* =====================================================
       STATE
    ===================================================== */

    const [billing, setBilling] = useState("yearly");

    const [openFaq, setOpenFaq] = useState(null);

    // First checkout popup
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    // Selected subscription plan
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Second payment screen
    const [paymentOpen, setPaymentOpen] = useState(false);

    // Payment method
    const [paymentMethod, setPaymentMethod] = useState("upi");

    // Save customer information
    const [saveInformation, setSaveInformation] = useState(false);

    // Discount / referral code
    const [discountCode, setDiscountCode] = useState("");

    /* =====================================================
       PLAN DATA
    ===================================================== */

    const plans = {
        monthly: {
            id: "monthly",
            name: "AzentMart AI Monthly",
            displayName: "Monthly",
            priceINR: "₹9,470",
            priceUSD: "$99.90",
            amountINR: 9470,
            amountUSD: 99.9,
            period: "month",
            billingText: "Billed monthly",
        },

        yearly: {
            id: "yearly",
            name: "AzentMart AI Yearly",
            displayName: "Yearly",
            priceINR: "₹37,900",
            priceUSD: "$399.90",
            amountINR: 37900,
            amountUSD: 399.9,
            period: "year",
            billingText: "Billed yearly",
        },
    };
    const creditPlans = [
        {
            id: "basic",
            name: "Basic",
            priceINR: "₹3,690",
            priceUSD: "$39.00",
            amountINR: 3690,
            credits: "3 Call Credits",
            extra: "",
            popular: false,
        },
        {
            id: "plus",
            name: "Plus",
            priceINR: "₹7,380",
            priceUSD: "$78.00",
            amountINR: 7380,
            credits: "6 Call Credits",
            extra: "+ 2 free",
            popular: true,
        },
        {
            id: "pro",
            name: "Pro",
            priceINR: "₹11,070",
            priceUSD: "$117.00",
            amountINR: 11070,
            credits: "9 Call Credits",
            extra: "+ 6 free",
            popular: false,
        },
    ];
    /* =====================================================
       FAQ DATA
    ===================================================== */

    const faqs = [
        {
            question: "What is AzentMart AI?",
            answer:
                "AzentMart AI is an AI-powered interview preparation platform designed to help you prepare for technical and non-technical interviews. You can practice interview questions, work with your resume and documents, and use AI-powered assistance to improve your interview preparation.",
        },

        {
            question: "How does AzentMart AI help me prepare for interviews?",
            answer:
                "AzentMart AI helps you prepare by allowing you to practice interview questions based on your skills, experience, resume, projects, and target role. You can use Interview Sessions to practice different interview scenarios and improve the way you structure your answers.",
        },

        {
            question: "Can I upload my CV or resume?",
            answer:
                "Yes. You can upload your CV or resume to AzentMart AI. Your resume can be used as additional context during interview preparation so that questions and suggested answers can be more relevant to your experience, skills, projects, and background.",
        },

        {
            question: "Can I upload documents for interview preparation?",
            answer:
                "Yes. AzentMart AI allows you to upload supporting documents that can be used as additional context. These documents can include project information, job descriptions, company information, study material, or other resources relevant to your interview.",
        },

        {
            question: "Can AzentMart AI help with technical interviews?",
            answer:
                "Yes. AzentMart AI can help you prepare for technical interviews covering areas such as programming, databases, cloud technologies, data engineering, system design, and other technical subjects. You can practice both conceptual and scenario-based questions.",
        },

        {
            question: "Can AzentMart AI generate answers based on my resume?",
            answer:
                "Yes. When your resume is available as context, AzentMart AI can generate interview responses that are more relevant to your professional experience, skills, projects, and background. This helps you practice answers that are consistent with your actual experience.",
        },

        {
            question: "Can I use AzentMart AI for HR and behavioral interviews?",
            answer:
                "Yes. AzentMart AI can help you prepare for HR and behavioral questions such as Tell me about yourself, strengths and weaknesses, project challenges, teamwork, leadership, conflict resolution, career goals, and other common behavioral interview questions.",
        },

        {
            question:
                "Is AzentMart AI suitable for freshers and experienced professionals?",
            answer:
                "Yes. AzentMart AI can be used by both freshers and experienced professionals. Your interview preparation can be based on your experience level, resume, skills, projects, target role, and the type of interview you are preparing for.",
        },

        {
            question: "Can I practice scenario-based interview questions?",
            answer:
                "Yes. Scenario-based questions are an important part of interview preparation. AzentMart AI can help you practice real-world situations and improve how you explain your decisions, problem-solving approach, technical knowledge, and communication.",
        },

        {
            question: "Is my resume and uploaded information private?",
            answer:
                "Your resume and uploaded documents are provided as context for your interview preparation. Please refer to AzentMart AI's privacy and data-handling policies for the specific details about how uploaded information is stored and processed. Avoid uploading passwords, payment credentials, or other highly sensitive information.",
        },

        {
            question: "What is included in the Free Plan?",
            answer:
                "The Free Plan allows you to get started with AzentMart AI and explore its interview preparation features. The available usage limits and features depend on the current plan configuration. You can upgrade when you need additional access.",
        },

        {
            question: "How can I upgrade my AzentMart AI plan?",
            answer:
                "You can upgrade your plan from the Upgrade section of your AzentMart AI dashboard. Choose Monthly or Yearly based on your requirements, select your preferred currency and payment method, and continue through the checkout process.",
        },
    ];

    /* =====================================================
       FAQ HANDLER
    ===================================================== */

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    /* =====================================================
       RAZORPAY SCRIPT LOADER HELPER
    ===================================================== */
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    /* =====================================================
       GENERIC RAZORPAY PAYMENT TRIGGER FUNCTION
    ===================================================== */
    const triggerRazorpayPayment = async (itemDetails) => {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
            alert("Unable to load Razorpay Checkout. Please check your internet connection.");
            return;
        }

        try {
            // Call backend API to create an order
            const response = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: itemDetails.amountINR,
                    name: itemDetails.name
                }),
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to create Razorpay order.");
            }

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency || "INR",
                name: "AzentMart AI",
                description: itemDetails.name,
                order_id: data.orderId,
                handler: async function (paymentResponse) {
                    try {
                        const verifyRes = await fetch("/api/razorpay/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_signature: paymentResponse.razorpay_signature,
                                itemName: itemDetails.name,
                                amount: itemDetails.amountINR,
                            }),
                        });
                        const verifyData = await verifyRes.json();
                        if (!verifyRes.ok || !verifyData.success) {
                            alert("Payment completed, but verification failed.");
                            return;
                        }
                        alert(`Successfully subscribed/purchased: ${itemDetails.name}!`);
                        setPaymentOpen(false);
                        setCheckoutOpen(false);
                        setSelectedPlan(null);
                    } catch (err) {
                        console.error("Verification error:", err);
                        alert("Payment verification request failed.");
                    }
                },
                prefill: {
                    email: "user@gmail.com",
                    contact: ""
                },
                theme: { color: "#2563eb" },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (resp) {
                alert(`Payment failed: ${resp.error.description}`);
            });
            rzp.open();
        } catch (error) {
            console.error("Razorpay error:", error);
            alert(error.message || "Unable to start Razorpay checkout.");
        }
    };

    /* =====================================================
       SUBSCRIBE HANDLER
    ===================================================== */

    const handleSubscribe = (planType) => {
        const plan = plans[planType];
        setSelectedPlan(plan);
        setDiscountCode("");
        setPaymentMethod("upi");
        setSaveInformation(false);
        setCheckoutOpen(true);
    };

    /* =====================================================
       CLOSE FIRST CHECKOUT
    ===================================================== */

    const closeCheckout = () => {
        setCheckoutOpen(false);
        setSelectedPlan(null);
    };

    /* =====================================================
       SELECT CURRENCY / OPEN PAYMENT SCREEN
    ===================================================== */

    const handleCurrencyPayment = () => {
        setCheckoutOpen(false);
        setPaymentOpen(true);
    };

    /* =====================================================
       BACK TO CURRENCY POPUP
    ===================================================== */

    const handleBackToCheckout = () => {
        setPaymentOpen(false);
        setCheckoutOpen(true);
    };

    /* =====================================================
       CLOSE PAYMENT SCREEN
    ===================================================== */

    const closePayment = () => {
        setPaymentOpen(false);
        setSelectedPlan(null);
        setPaymentMethod("upi");
        setSaveInformation(false);
    };

    /* =====================================================
       FINAL PAYMENT (TRIGGERS RAZORPAY)
    ===================================================== */

    const handleFinalSubscribe = () => {
        if (!selectedPlan) {
            return;
        }
        triggerRazorpayPayment(selectedPlan);
    };

    return (
        <div className="upgrade-page">

            {/* =================================================
          PRICING
      ================================================= */}

            <section className="upgrade-pricing-section">

                <div className="upgrade-small-label">
                    PRICING
                </div>

                <h1>
                    Buy credits or
                    <br />

                    <span>
                        Go unlimited
                    </span>

                    <span className="sparkle">
                        {" "}✨
                    </span>
                </h1>


                {/* BILLING SWITCH */}

                <div className="pricing-switch">

                    <button
                        type="button"
                        className={
                            billing === "credits"
                                ? "active"
                                : ""
                        }
                        onClick={() => setBilling("credits")}
                    >

                        <FiCreditCard />

                        Credits only

                    </button>


                    <button
                        type="button"
                        className={
                            billing !== "credits"
                                ? "active"
                                : ""
                        }
                        onClick={() => setBilling("yearly")}
                    >

                        ↻

                        Subscription

                    </button>

                </div>

            </section>



            {/* =================================================
    PRICING CONTENT
================================================= */}

            {billing === "credits" ? (

                /* ================================
                   CREDITS ONLY
                ================================= */

                <>

                    {/* CREDIT INFO LINKS */}

                    <div className="pricing-links">

                        <span>
                            Refund Policy
                        </span>

                        <span>
                            Credits Never Expire
                        </span>

                        <span>
                            1 Credit = 1h Interview Session
                            <span className="credit-info-icon">
                                i
                            </span>
                        </span>

                    </div>


                    {/* CREDIT CARDS */}

                    <div className="pricing-cards credits-cards">

                        {creditPlans.map((plan) => (

                            <div
                                key={plan.id}
                                className={
                                    plan.popular
                                        ? "pricing-card credit-card popular-credit"
                                        : "pricing-card credit-card"
                                }
                            >

                                {/* POPULAR BADGE */}

                                {plan.popular && (
                                    <div className="best-deal-label">
                                        Most popular
                                    </div>
                                )}


                                {/* PLAN NAME */}

                                <div className="pricing-card-title">
                                    {plan.name}
                                </div>


                                {/* PRICE */}

                                <div className="pricing-price">
                                    {plan.priceINR}
                                </div>

                                <div className="pricing-usd">
                                    ({plan.priceUSD})
                                </div>


                                {/* PERIOD */}

                                <div className="pricing-period">
                                    one-time
                                </div>


                                {/* CREDIT COUNT */}

                                <div className="unlimited credit-count">

                                    <FiCreditCard />

                                    <span>
                                        {plan.credits}
                                    </span>

                                    {plan.extra && (
                                        <span className="save-badge">
                                            {plan.extra}
                                        </span>
                                    )}

                                </div>


                                {/* GET CREDITS */}

                                <button
                                    type="button"
                                    className={
                                        plan.popular
                                            ? "pricing-button dark"
                                            : "pricing-button light"
                                    }
                                    onClick={() => {
                                        triggerRazorpayPayment({
                                            id: plan.id,
                                            name: `AzentMart AI ${plan.name} (${plan.credits})`,
                                            amountINR: plan.amountINR
                                        });
                                    }}
                                >
                                    Get credits
                                </button>

                            </div>

                        ))}

                    </div>


                    {/* ONE CREDIT OPTION */}

                    <div
                        className="weekly-link credit-single-link"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            triggerRazorpayPayment({
                                id: "single-credit",
                                name: "AzentMart AI Single Call Credit",
                                amountINR: 2360
                            });
                        }}
                    >

                        or, just need 1 call?

                        <strong>
                            1 credit for ₹2,360 →
                        </strong>

                    </div>

                </>

            ) : (

                /* ================================
                   SUBSCRIPTION
                ================================= */

                <>

                    {/* SUBSCRIPTION INFO */}

                    <div className="pricing-links">

                        <span>
                            Refund Policy
                        </span>

                        <span>
                            Unlimited Calls
                        </span>

                        <span>
                            Cancel Anytime
                        </span>

                    </div>


                    {/* SUBSCRIPTION CARDS */}

                    <div className="pricing-cards">

                        {/* MONTHLY */}

                        <div className="pricing-card">

                            <div className="pricing-card-title">
                                Monthly
                            </div>

                            <div className="pricing-price">
                                ₹9,470
                            </div>

                            <div className="pricing-usd">
                                ($99.90)
                            </div>

                            <div className="pricing-period">
                                per month
                            </div>

                            <div className="unlimited">
                                ∞ Unlimited Calls
                            </div>

                            <button
                                type="button"
                                className="pricing-button light"
                                onClick={() =>
                                    handleSubscribe("monthly")
                                }
                            >
                                Subscribe
                            </button>

                        </div>


                        {/* YEARLY */}

                        <div className="pricing-card best-deal">

                            <div className="best-deal-label">
                                Best deal
                            </div>

                            <div className="pricing-card-title">
                                Yearly
                            </div>

                            <div className="pricing-price">
                                ₹37,900
                            </div>

                            <div className="pricing-usd">
                                ($399.90)
                            </div>

                            <div className="pricing-period">
                                per year
                            </div>

                            <div className="unlimited">

                                ∞ Unlimited Calls

                                <span className="save-badge">
                                    Save 67%
                                </span>

                            </div>

                            <button
                                type="button"
                                className="pricing-button dark"
                                onClick={() =>
                                    handleSubscribe("yearly")
                                }
                            >
                                Subscribe
                            </button>

                        </div>

                    </div>


                    {/* WEEKLY */}

                    <div
                        className="weekly-link"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            triggerRazorpayPayment({
                                id: "weekly",
                                name: "AzentMart AI Weekly Subscription",
                                amountINR: 4980
                            });
                        }}
                    >

                        or, only need a week?

                        <strong>
                            Weekly for ₹4,980 →
                        </strong>

                    </div>

                </>

            )}


            {/* =================================================
          PAYMENT METHODS
      ================================================= */}

            <section className="payment-section">

                <h3>
                    Accepted Payment Methods
                </h3>

                <div className="payment-methods">

                    <span>
                        <FiCreditCard />
                        Visa
                    </span>

                    <span>
                        <FiCreditCard />
                        Mastercard
                    </span>

                    <span>
                        <FiCreditCard />
                        Amex
                    </span>

                    <span>
                        <FiSmartphone />
                        Apple Pay
                    </span>

                    <span>
                        <FiSmartphone />
                        Google Pay
                    </span>

                    <span>
                        <FiSmartphone />
                        UPI
                    </span>

                    <span>
                        <FiSmartphone />
                        GPay
                    </span>

                    <span>
                        <FiSmartphone />
                        PhonePe
                    </span>

                </div>

            </section>


            {/* =================================================
          INTERVIEW ASSISTANT
      ================================================= */}

            <section className="assistant-section">

                <div className="verified-badge">
                    ◈ AzentMart AI
                </div>

                <h2>

                    <span>
                        Your AI Interview Assistant
                    </span>

                    {" "}for smarter preparation

                </h2>

                <p className="assistant-subtitle">
                    Prepare confidently for your next interview
                </p>


                <div className="platform-banner">

                    <div className="platform-content">

                        <h3>
                            Works with your
                            <br />
                            interview preparation
                        </h3>

                        <p>
                            AzentMart AI helps you prepare for different
                            interview formats by using your resume, skills,
                            projects, documents, and target role as context.
                        </p>

                    </div>


                    <div className="platform-icons">

                        <div className="fake-platform">
                            AI
                        </div>

                        <div className="fake-platform">
                            CV
                        </div>

                        <div className="fake-platform">
                            SQL
                        </div>

                        <div className="fake-platform">
                            DEV
                        </div>

                        <div className="fake-platform">
                            DATA
                        </div>

                        <div className="fake-platform">
                            ☁
                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
          TRANSCRIPTION + AI ANSWERS
      ================================================= */}

            <section className="feature-two-column">

                {/* TRANSCRIPTION */}

                <div className="feature-box">

                    <div className="feature-label">
                        INTERVIEW PREPARATION
                    </div>

                    <h3>
                        Fast AI Assistance
                    </h3>


                    <div className="transcription-demo">

                        <div className="person-row">

                            <div className="person-avatar">
                                AI
                            </div>

                            <div>

                                <strong>
                                    AzentMart AI
                                </strong>

                                <small>
                                    Preparing response...
                                </small>

                            </div>

                            <span className="mic">
                                ✦
                            </span>

                        </div>


                        <div className="waveform">

                            ▁▃▅▇▅▃▇▆▃▅▇▃▆▇▅▃▅▇▆▃▇

                        </div>

                    </div>


                    <p>
                        AzentMart AI helps you prepare structured and
                        relevant responses so you can approach interview
                        questions with greater confidence.
                    </p>

                </div>


                {/* AI ANSWERS */}

                <div className="feature-box">

                    <div className="feature-label">
                        AI ANSWERS
                    </div>

                    <h3>
                        Relevant Interview Responses
                    </h3>


                    <div className="answer-demo">

                        <div className="question-bubble">

                            💬

                            {" "}

                            Tell me about a challenging
                            project you worked on.

                        </div>


                        <div className="answer-bubble">

                            AzentMart AI can help structure
                            your response using your project
                            experience and background.

                        </div>

                    </div>


                    <p>
                        Provide your resume, project details, or other
                        supporting information and use that context to
                        practice more relevant interview answers.
                    </p>

                </div>

            </section>


            {/* =================================================
          PRIVACY
      ================================================= */}

            <section className="privacy-section">

                <div className="privacy-content">

                    <h2>
                        Your information
                        <br />
                        stays protected
                    </h2>

                    <p>
                        Your resume and supporting documents can provide
                        useful context during interview preparation. Always
                        review your privacy settings and avoid uploading
                        highly sensitive information.
                    </p>


                    <button
                        type="button"
                        className="privacy-video-button"
                    >

                        ▶

                        <span>
                            Learn about privacy
                        </span>

                    </button>

                </div>


                <div className="privacy-features">

                    <div>

                        <FiEyeOff />

                        Privacy-focused preparation

                        <FiArrowRight />

                    </div>


                    <div>

                        <FiMonitor />

                        Resume-based context

                        <FiArrowRight />

                    </div>


                    <div>

                        <FiShield />

                        Secure interview preparation

                        <FiArrowRight />

                    </div>


                    <div>

                        <FiZap />

                        Fast AI assistance

                        <FiArrowRight />

                    </div>


                    <div>

                        <FiMousePointer />

                        Simple dashboard experience

                        <FiArrowRight />

                    </div>

                </div>

            </section>


            {/* =================================================
          FEATURES
      ================================================= */}

            <section className="features-section">

                <div className="feature-grid">

                    {/* RESUME */}

                    <div className="small-feature-card">

                        <span className="green-pill">
                            RESUME
                        </span>

                        <h3>
                            Upload your Resume
                        </h3>


                        <div className="resume-demo">

                            <div className="resume-avatar">
                                CV
                            </div>

                            <div>

                                <strong>
                                    Your Resume
                                </strong>

                                <small>
                                    Professional Profile
                                </small>

                            </div>

                        </div>


                        <p>
                            Upload your resume once and use it as context
                            while preparing for interview questions.
                        </p>

                    </div>


                    {/* INSTANT ANSWERS */}

                    <div className="small-feature-card">

                        <span className="green-pill">
                            AI ASSISTANCE
                        </span>

                        <h3>
                            AI Interview Answers
                        </h3>


                        <div className="chat-demo">

                            Tell me about your experience
                            with cloud technologies.

                        </div>


                        <p>
                            Practice interview questions and get structured
                            AI-powered guidance based on the context you provide.
                        </p>

                    </div>


                    {/* DOCUMENTS */}

                    <div className="large-feature-card">

                        <div>

                            <span className="green-pill">
                                KNOWLEDGE BASE
                            </span>

                            <h3>
                                Documents
                            </h3>

                            <p>
                                Upload supporting information that can be used
                                as context during your interview preparation.
                            </p>

                        </div>


                        <div className="document-demo">

                            <div>
                                📄 Resume
                            </div>

                            <div>
                                📄 Projects
                            </div>

                            <div>
                                📄 Job Description
                            </div>

                            <div>
                                📄 Skills
                            </div>

                            <div>
                                📄 Company
                            </div>

                            <div>
                                📄 Notes
                            </div>

                        </div>

                    </div>


                    {/* INTERVIEW SESSIONS */}

                    <div className="small-feature-card">

                        <span className="green-pill">
                            INTERVIEW
                        </span>

                        <h3>
                            Interview Sessions
                        </h3>


                        <div className="meeting-demo">

                            <span>
                                🎯 Interview Session
                            </span>

                            <span>
                                Practice questions and scenarios
                            </span>

                            <button type="button">
                                START SESSION →
                            </button>

                        </div>


                        <p>
                            Practice interview scenarios and improve your
                            responses before your actual interview.
                        </p>

                    </div>


                    {/* NOTES */}

                    <div className="small-feature-card">

                        <span className="green-pill">
                            NOTES
                        </span>

                        <h3>
                            AI Notes
                        </h3>


                        <div className="notes-demo">

                            <strong>
                                Interview Notes
                            </strong>

                            <p>
                                Review important questions, key points,
                                and preparation notes in one place.
                            </p>

                        </div>


                        <p>
                            Keep your interview preparation organized with
                            useful notes and important points.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
          FAQ
      ================================================= */}

            <section className="faq-section">

                {/* FAQ TITLE */}

                <div className="faq-title">

                    <span>
                        AZENTMART AI SUPPORT
                    </span>


                    <h2>
                        Frequently
                        <br />
                        Asked
                        <br />
                        Questions
                    </h2>


                    <div className="faq-tabs">

                        <button
                            type="button"
                            className="selected"
                        >
                            Features
                        </button>

                        <button type="button">
                            Privacy
                        </button>

                        <button type="button">
                            Billing
                        </button>

                        <button type="button">
                            Account
                        </button>

                    </div>

                </div>


                {/* FAQ LIST */}

                <div className="faq-list">

                    {faqs.map((faq, index) => (

                        <div
                            className={`faq-item ${openFaq === index
                                ? "open"
                                : ""
                                }`}
                            key={index}
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    toggleFaq(index)
                                }
                            >

                                <span>
                                    {faq.question}
                                </span>

                                <FiChevronDown />

                            </button>


                            {openFaq === index && (

                                <div className="faq-answer">

                                    {faq.answer}

                                </div>

                            )}

                        </div>

                    ))}

                </div>

            </section>


            {/* =================================================
          FIRST CHECKOUT POPUP
      ================================================= */}

            {checkoutOpen && selectedPlan && (

                <div className="checkout-overlay">

                    <div className="checkout-modal">

                        {/* HEADER */}

                        <div className="checkout-header">

                            <h2>
                                Checkout
                            </h2>


                            <button
                                type="button"
                                className="checkout-close"
                                onClick={closeCheckout}
                            >
                                <FiX />
                            </button>

                        </div>


                        {/* DISCOUNT CODE */}

                        <div className="discount-section">

                            <label>

                                Discount or Referral Code

                                <span>
                                    (Optional)
                                </span>

                            </label>


                            <input
                                type="text"
                                value={discountCode}
                                onChange={(e) =>
                                    setDiscountCode(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* CURRENCY */}

                        <div className="currency-section">

                            <p>
                                Select the currency you'd like to pay in.
                            </p>


                            {/* USD */}

                            <button
                                type="button"
                                className="currency-option"
                                onClick={
                                    handleCurrencyPayment
                                }
                            >

                                <div className="currency-main">

                                    <FiCreditCard />

                                    <strong>
                                        Pay {selectedPlan.priceUSD}
                                    </strong>

                                </div>


                                <span>
                                    US Dollars (Bank Cards)
                                </span>

                            </button>


                            {/* INR */}

                            <button
                                type="button"
                                className="currency-option currency-option-inr"
                                onClick={
                                    handleCurrencyPayment
                                }
                            >

                                <div className="currency-main">

                                    <FiCreditCard />

                                    <strong>
                                        Pay {selectedPlan.priceINR}
                                    </strong>

                                </div>


                                <span>
                                    Indian Rupees (Bank Cards or UPI)
                                </span>

                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
          PAYMENT CHECKOUT SCREEN
      ================================================= */}

            {paymentOpen && selectedPlan && (

                <div className="payment-overlay">

                    <div className="payment-checkout">

                        {/* ==========================================
                LEFT PAYMENT SUMMARY
            ========================================== */}

                        <div className="payment-summary">

                            <h2>
                                Subscribe to {selectedPlan.name}
                            </h2>


                            <div className="payment-big-price">

                                {selectedPlan.priceINR}

                                <span>
                                    per
                                    <br />
                                    {selectedPlan.period}
                                </span>

                            </div>


                            {/* PRODUCT */}

                            <div className="payment-product">

                                <div>

                                    <strong>
                                        {selectedPlan.name}
                                    </strong>


                                    <p>
                                        AzentMart AI{" "}
                                        {selectedPlan.period} subscription.
                                        Get access to AI-powered interview
                                        preparation, resume context, documents,
                                        and interview assistance.
                                    </p>


                                    <span>
                                        {selectedPlan.billingText}
                                    </span>

                                </div>


                                <strong>
                                    {selectedPlan.priceINR}
                                </strong>

                            </div>


                            <div className="payment-line" />


                            {/* SUBTOTAL */}

                            <div className="payment-row">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    {selectedPlan.priceINR}
                                </strong>

                            </div>


                            {/* TAX */}

                            <div className="payment-row">

                                <span>
                                    Tax
                                </span>

                                <span className="tax-text">
                                    Enter address to calculate
                                </span>

                            </div>


                            <div className="payment-line" />


                            {/* TOTAL */}

                            <div className="payment-total">

                                <span>
                                    Total due today
                                </span>

                                <strong>
                                    {selectedPlan.priceINR}
                                </strong>

                            </div>

                        </div>


                        {/* ==========================================
                RIGHT PAYMENT FORM
            ========================================== */}

                        <div className="payment-form">

                            {/* BACK */}

                            <button
                                type="button"
                                className="payment-back"
                                onClick={
                                    handleBackToCheckout
                                }
                            >
                                ← Back
                            </button>


                            {/* OR */}

                            <div className="payment-or">

                                <span />

                                OR

                                <span />

                            </div>


                            {/* CONTACT */}

                            <h2>
                                Contact information
                            </h2>


                            <div className="contact-box">

                                <label>
                                    Email
                                </label>


                                <input
                                    type="email"
                                    value="user@gmail.com"
                                    readOnly
                                />

                            </div>


                            {/* PAYMENT METHOD */}

                            <h2 className="payment-method-title">
                                Payment method
                            </h2>


                            <div className="payment-method-box">

                                {/* UPI */}

                                <label className="payment-method">

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="upi"
                                        checked={
                                            paymentMethod === "upi"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />


                                    <span className="radio-custom" />


                                    <span className="payment-method-name">
                                        UPI
                                    </span>


                                    <span className="upi-logo">
                                        UPI
                                    </span>

                                </label>


                                {/* CARD */}

                                <label className="payment-method">

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={
                                            paymentMethod === "card"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />


                                    <span className="radio-custom" />


                                    <span className="card-icon">
                                        ▬
                                    </span>


                                    <span className="payment-method-name">
                                        Card
                                    </span>


                                    <div className="card-brands">

                                        <span className="visa">
                                            VISA
                                        </span>

                                        <span className="mastercard">
                                            ●●
                                        </span>

                                        <span className="amex">
                                            AMEX
                                        </span>

                                        <span className="discover">
                                            D
                                        </span>

                                    </div>

                                </label>

                            </div>


                            {/* SAVE INFORMATION */}

                            <label className="save-information">

                                <input
                                    type="checkbox"
                                    checked={saveInformation}
                                    onChange={(e) =>
                                        setSaveInformation(
                                            e.target.checked
                                        )
                                    }
                                />


                                <span className="save-checkbox" />


                                <div>

                                    <strong>
                                        Save my information for faster checkout
                                    </strong>

                                    <p>
                                        Pay securely at AzentMart AI and
                                        everywhere Link is accepted.
                                    </p>

                                </div>

                            </label>


                            {/* FINAL SUBSCRIBE */}

                            <button
                                type="button"
                                className="final-subscribe-btn"
                                onClick={
                                    handleFinalSubscribe
                                }
                            >
                                Subscribe
                            </button>


                            <p className="secure-payment">
                                🔒 Secure payment
                            </p>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default UpgradePage;
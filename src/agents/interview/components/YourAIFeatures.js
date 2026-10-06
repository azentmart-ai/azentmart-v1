import React from "react";

import {
    BsLightningCharge,
    BsCameraVideo,
    BsGraphUpArrow,
    BsShieldCheck,
    BsRobot,
    BsMic
} from "react-icons/bs";

const features = [
    {
        icon: <BsRobot />,
        title: "AI Interview Copilot",
        desc: "Receive intelligent guidance and real-time suggestions throughout your interview."
    },
    {
        icon: <BsCameraVideo />,
        title: "Live Video Analysis",
        desc: "Analyze facial expressions, eye contact and body language using AI."
    },
    {
        icon: <BsMic />,
        title: "Speech Intelligence",
        desc: "Improve communication, fluency and confidence with instant feedback."
    },
    {
        icon: <BsGraphUpArrow />,
        title: "Performance Analytics",
        desc: "Track confidence, technical accuracy and interview progress."
    },
    {
        icon: <BsLightningCharge />,
        title: "Instant AI Suggestions",
        desc: "Get smart hints and personalized answers within milliseconds."
    },
    {
        icon: <BsShieldCheck />,
        title: "Privacy First",
        desc: "Your interview sessions stay secure with enterprise-grade encryption."
    }
];

const YourAIFeatures = () => {
    return (
        <section className="features">

            <div className="features-container">

                <span className="section-badge">
                    Why AzentMart AI
                </span>

                <h2>
                    Everything You Need To
                    <span> Crack Your Next Interview</span>
                </h2>

                <p className="section-desc">
                    Practice coding, technical and HR interviews with
                    an intelligent AI assistant that coaches you before,
                    during and after every interview.
                </p>

                <div className="feature-grid">

                    {features.map((item, index) => (

                        <div className="feature-card" key={index}>

                            <div className="feature-icon">
                                {item.icon}
                            </div>

                            <h3>{item.title}</h3>

                            <p>{item.desc}</p>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
};

export default YourAIFeatures;
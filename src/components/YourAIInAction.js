import React, { useState } from "react";

import {
    BsMic,
    BsChatDots,
    BsCpu,
    BsRobot,
    BsBarChart
} from "react-icons/bs";

const workflow = [

    {
        id: "listening",
        icon: <BsMic />,
        title: "Listening",
        subtitle: "Capture interviewer's voice"
    },

    {
        id: "transcription",
        icon: <BsChatDots />,
        title: "Transcription",
        subtitle: "Convert speech into text"
    },

    {
        id: "understanding",
        icon: <BsCpu />,
        title: "Understanding",
        subtitle: "Analyze question intent"
    },

    {
        id: "answer",
        icon: <BsRobot />,
        title: "Answer Generation",
        subtitle: "Generate best response"
    },

    {
        id: "analysis",
        icon: <BsBarChart />,
        title: "Performance",
        subtitle: "Confidence & communication"
    }

];

const YourAIInAction = () => {

    const [activeStep, setActiveStep] = useState("listening");

    return (

        <section className="in-action">

            <div className="in-action-container">

                {/* LEFT SIDE */}

                <div className="workflow-left">

                    <span className="section-badge">

                        Live AI Workflow

                    </span>

                    <h2>

                        Experience How AzentMart AI
                        Assists You During Every Interview

                    </h2>

                    <p>

                        From listening to the interviewer to generating
                        intelligent responses, AzentMart AI works in
                        real time so you can stay focused and confident.

                    </p>

                    <div className="workflow-list">

                        {

                            workflow.map((item) => (

                                <div

                                    key={item.id}

                                    className={`workflow-card ${
                                        activeStep === item.id
                                            ? "active-workflow"
                                            : ""
                                    }`}

                                    onClick={() => setActiveStep(item.id)}

                                >

                                    <div className="workflow-icon">

                                        {item.icon}

                                    </div>

                                    <div>

                                        <h4>

                                            {item.title}

                                        </h4>

                                        <p>

                                            {item.subtitle}

                                        </p>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="workflow-right">

                    <div className="ai-dashboard">

                        <div className="dashboard-header">

                            <div className="dashboard-dots">

                                <span className="red"></span>

                                <span className="yellow"></span>

                                <span className="green"></span>

                            </div>

                            <h5>

                                AzentMart AI Assistant

                            </h5>

                        </div>

                        <div className="dashboard-body">
                            {/* ================= LISTENING ================= */}

{activeStep === "listening" && (

<div className="dashboard-content listening-screen">

    <div className="live-indicator">

        <span className="live-dot"></span>

        LIVE

    </div>

    <div className="voice-assistant">

        <div className="mic-circle">

            <BsMic />

        </div>

        <div className="voice-wave">

            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>

        </div>

    </div>

    <h2>

        Listening to Interviewer...

    </h2>

    <p>

        AzentMart AI is securely listening to the interviewer's
        question and preparing it for live transcription.

    </p>

    <div className="listening-status">

        <div className="status-item">

            <strong>Microphone</strong>

            <span className="status success">

                Connected

            </span>

        </div>

        <div className="status-item">

            <strong>Noise Cancellation</strong>

            <span className="status success">

                Active

            </span>

        </div>

        <div className="status-item">

            <strong>Voice Detection</strong>

            <span className="status listening">

                Listening...

            </span>

        </div>

    </div>

    <div className="audio-visualizer">

        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>

    </div>

</div>

)}
{/* ================= LIVE TRANSCRIPTION ================= */}

{activeStep === "transcription" && (

<div className="dashboard-content">

    <div className="transcription-screen">

        <div className="transcription-header">

            <div>

                <h3>

                    📝 Live Transcription

                </h3>

                <span>

                    Real-time speech recognition

                </span>

            </div>

            <div className="recording-status">

                <span className="record-dot"></span>

                Recording

            </div>

        </div>

        {/* Interviewer Message */}

        <div className="chat-card interviewer-card">

            <div className="chat-avatar interviewer-avatar">

                I

            </div>

            <div className="chat-content">

                <h5>

                    Interviewer

                </h5>

                <p>

                    Can you explain your experience with React,
                    Laravel and how you've integrated REST APIs
                    in your previous projects?

                </p>

                <span className="chat-time">

                    Just now

                </span>

            </div>

        </div>

        {/* AI Transcribing */}

        <div className="chat-card ai-card">

            <div className="chat-avatar ai-avatar">

                AI

            </div>

            <div className="chat-content">

                <h5>

                    AzentMart AI

                </h5>

                <div className="typing-line">

                    <span></span>

                    <span></span>

                    <span></span>

                </div>

                <p className="transcript-preview">

                    Detecting speech and generating live transcript...

                </p>

            </div>

        </div>

        {/* Transcript */}

        <div className="transcript-output">

            <h4>

                Transcript

            </h4>

            <p>

                "Can you explain your experience with React,
                Laravel and how you've integrated REST APIs
                in your previous projects?"

            </p>

        </div>

        {/* Bottom Stats */}

        <div className="transcription-footer">

            <div className="footer-card">

                <strong>

                    99.4%

                </strong>

                <span>

                    Accuracy

                </span>

            </div>

            <div className="footer-card">

                <strong>

                    English

                </strong>

                <span>

                    Language

                </span>

            </div>

            <div className="footer-card">

                <strong>

                    Live

                </strong>

                <span>

                    Processing

                </span>

            </div>

        </div>

    </div>

</div>

)}
{/* ================= AI UNDERSTANDING ================= */}

{activeStep === "understanding" && (

<div className="dashboard-content">

    <div className="understanding-screen">

        <div className="analysis-header">

            <div>

                <h3>

                    🧠 AI Question Understanding

                </h3>

                <span>

                    Semantic analysis of the interview question

                </span>

            </div>

            <div className="analysis-status">

                <span className="status-dot"></span>

                Processing

            </div>

        </div>

        {/* AI Thinking */}

        <div className="thinking-card">

            <div className="thinking-icon">

                <BsCpu />

            </div>

            <div>

                <h4>

                    AI is Understanding the Question...

                </h4>

                <p>

                    Detecting technologies, intent, expected answer,
                    difficulty level and interviewer expectations.

                </p>

            </div>

        </div>

        {/* Keywords */}

        <div className="keyword-section">

            <h4>

                Detected Keywords

            </h4>

            <div className="keyword-grid">

                <span>React</span>

                <span>Laravel</span>

                <span>REST API</span>

                <span>Authentication</span>

                <span>Performance</span>

                <span>MySQL</span>

                <span>Optimization</span>

                <span>Scalability</span>

            </div>

        </div>

        {/* AI Insights */}

        <div className="insights-grid">

            <div className="insight-card">

                <strong>

                    Technical Question

                </strong>

                <p>

                    Backend + Frontend Experience

                </p>

            </div>

            <div className="insight-card">

                <strong>

                    Difficulty

                </strong>

                <p>

                    Intermediate

                </p>

            </div>

            <div className="insight-card">

                <strong>

                    AI Confidence

                </strong>

                <p>

                    98%

                </p>

            </div>

            <div className="insight-card">

                <strong>

                    Recommended Answer

                </strong>

                <p>

                    60-90 Seconds

                </p>

            </div>

        </div>

        {/* Progress */}

        <div className="analysis-progress">

            <div className="progress-row">

                <span>Speech Analysis</span>

                <span>100%</span>

            </div>

            <div className="progress-bar">

                <div
                    className="progress-fill"
                    style={{ width: "100%" }}
                ></div>

            </div>

            <div className="progress-row">

                <span>Intent Detection</span>

                <span>98%</span>

            </div>

            <div className="progress-bar">

                <div
                    className="progress-fill"
                    style={{ width: "98%" }}
                ></div>

            </div>

            <div className="progress-row">

                <span>Context Understanding</span>

                <span>96%</span>

            </div>

            <div className="progress-bar">

                <div
                    className="progress-fill"
                    style={{ width: "96%" }}
                ></div>

            </div>

        </div>

    </div>

</div>

)}
{/* ================= ANSWER GENERATION ================= */}

{activeStep === "answer" && (

<div className="dashboard-content">

    <div className="answer-screen">

        <div className="answer-header">

            <div>

                <h3>

                    🤖 AI Answer Generation

                </h3>

                <span>

                    Generating an optimized interview response...

                </span>

            </div>

            <div className="ai-badge">

                AI Ready

            </div>

        </div>

        <div className="generated-answer">

            <div className="answer-label">

                Suggested Response

            </div>

            <p className="answer-text">

                I have worked extensively with
                <strong> React </strong>
                and
                <strong> Laravel </strong>
                to build scalable web applications.
                In my recent projects, I developed responsive user
                interfaces using React and built secure REST APIs
                with Laravel.

                <br /><br />

                I integrated frontend and backend using JSON-based
                APIs, optimized MySQL queries for better performance,
                implemented authentication and authorization, and
                collaborated with cross-functional teams to deliver
                reliable enterprise applications.

                <br /><br />

                One challenge I solved was improving API response time
                by optimizing database queries and introducing caching,
                which significantly improved the application's overall
                performance and user experience.

            </p>

        </div>

        <div className="talking-points">

            <h4>

                💡 AI Talking Points

            </h4>

            <ul>

                <li>Explain your role clearly.</li>

                <li>Mention measurable achievements.</li>

                <li>Highlight React + Laravel integration.</li>

                <li>Discuss performance optimization.</li>

                <li>End with business impact.</li>

            </ul>

        </div>

        <div className="answer-actions">

            <button className="primary-btn">

                Use This Answer

            </button>

            <button className="secondary-btn">

                Regenerate

            </button>

        </div>

    </div>

</div>

)}
{/* ================= PERFORMANCE ANALYSIS ================= */}

{activeStep === "analysis" && (

<div className="dashboard-content">

    <div className="analysis-screen">

        <div className="analysis-header">

            <div>

                <h3>

                    📊 AI Performance Analysis

                </h3>

                <span>

                    Real-time evaluation of your interview performance

                </span>

            </div>

            <div className="score-circle">

                94%

            </div>

        </div>

        <div className="score-grid">

            <div className="score-card">

                <h5>Communication</h5>

                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{ width: "96%" }}
                    ></div>

                </div>

                <span>96%</span>

            </div>

            <div className="score-card">

                <h5>Technical Knowledge</h5>

                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{ width: "94%" }}
                    ></div>

                </div>

                <span>94%</span>

            </div>

            <div className="score-card">

                <h5>Confidence</h5>

                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{ width: "91%" }}
                    ></div>

                </div>

                <span>91%</span>

            </div>

            <div className="score-card">

                <h5>Speaking Pace</h5>

                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{ width: "93%" }}
                    ></div>

                </div>

                <span>93%</span>

            </div>

        </div>

        <div className="ai-feedback">

            <h4>

                🤖 AI Feedback

            </h4>

            <ul>

                <li>✅ Excellent technical explanation.</li>

                <li>✅ Good confidence while answering.</li>

                <li>✅ Structured and easy to understand.</li>

                <li>💡 Add one real project example for more impact.</li>

                <li>💡 Keep the answer within 90 seconds.</li>

            </ul>

        </div>

        <div className="overall-result">

            <div className="result-card">

                <h5>Overall Rating</h5>

                <strong>Excellent ⭐</strong>

            </div>

            <div className="result-card">

                <h5>Hiring Recommendation</h5>

                <strong>Highly Recommended</strong>

            </div>

        </div>

    </div>

</div>

)}

                    </div>

                </div>

            </div>

        </div>

    </section>

);

};

export default YourAIInAction;
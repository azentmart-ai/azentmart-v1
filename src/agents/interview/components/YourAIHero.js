import React, { useState } from "react";

import {
  FiArrowRight,
  FiPlayCircle,
} from "react-icons/fi";

import {
  BsStars,
  BsRobot,
  BsLightningCharge,
  BsGraphUpArrow,
  BsShieldCheck,
  BsCodeSlash,
  BsPersonCheck,
  BsMic,
  BsEmojiSmile,
  BsBug,
  BsCpu,
} from "react-icons/bs";

const YourAIHero = () => {

  const [mode, setMode] = useState("coding");

  return (

    <section className="your-ai-hero">

      <div className="hero-circle hero-circle-1"></div>
      <div className="hero-circle hero-circle-2"></div>
      <div className="hero-circle hero-circle-3"></div>

      <div className="your-ai-hero-container">

        {/* ================= LEFT ================= */}

        <div className="your-ai-hero-left">

          <div className="hero-badge">
            <BsStars />
            AI Powered Interview Platform
          </div>

          {/* Toggle */}

          <div className="hero-toggle">

            <button
              className={mode === "coding" ? "active" : ""}
              onClick={() => setMode("coding")}
            >
              👨‍💻 Coding
            </button>

            <button
              className={mode === "noncoding" ? "active" : ""}
              onClick={() => setMode("noncoding")}
            >
              👔 Non-Coding
            </button>

          </div>

          {/* Heading */}

          <h1>

            {mode === "coding" ? (

              <>
                Crack Your
                <span> Coding </span>
                Interviews with AI
              </>

            ) : (

              <>
                Master Every
                <span> HR Interview </span>
                with Confidence
              </>

            )}

          </h1>

          {/* Description */}

          <p>

            {mode === "coding"

              ? "Practice DSA, System Design, Frontend, Backend and AI interviews with instant feedback, hints and code evaluation."

              : "Practice HR, Behavioral, Sales, Marketing and Leadership interviews with AI-powered coaching and confidence analysis."

            }

          </p>

          {/* Buttons */}

          <div className="hero-buttons">

            <button className="hero-primary-btn">

              Start Free

              <FiArrowRight />

            </button>

            <button className="hero-secondary-btn">

              <FiPlayCircle />

              Watch Demo

            </button>

          </div>
                    {/* ================= STATS ================= */}

          <div className="hero-stats">

            {mode === "coding" ? (

              <>
                <div>
                  <h2>50K+</h2>
                  <span>Coding Interviews</span>
                </div>

                <div>
                  <h2>96%</h2>
                  <span>Success Rate</span>
                </div>

                <div>
                  <h2>500+</h2>
                  <span>DSA Questions</span>
                </div>
              </>

            ) : (

              <>
                <div>
                  <h2>30K+</h2>
                  <span>HR Interviews</span>
                </div>

                <div>
                  <h2>97%</h2>
                  <span>Confidence Boost</span>
                </div>

                <div>
                  <h2>100+</h2>
                  <span>HR Scenarios</span>
                </div>
              </>

            )}

          </div>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="your-ai-hero-right">

          <div className="hero-dashboard">

            <div className="dashboard-top">

              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>

            </div>

            <div className="dashboard-title">

              {mode === "coding"
                ? "Coding Interview Dashboard"
                : "HR Interview Dashboard"}

            </div>

            {

              mode === "coding"

              ?

              <>

                <div className="dashboard-card">

                  <div className="dashboard-icon">
                    <BsCodeSlash />
                  </div>

                  <div>

                    <h4>Live Coding Round</h4>

                    <p>
                      Solve coding problems in a real interview environment.
                    </p>

                  </div>

                </div>

                <div className="dashboard-card">

                  <div className="dashboard-icon">
                    <BsCpu />
                  </div>

                  <div>

                    <h4>AI Code Review</h4>

                    <p>
                      Get instant feedback on logic, complexity and style.
                    </p>

                  </div>

                </div>

                <div className="dashboard-card">

                  <div className="dashboard-icon">
                    <BsBug />
                  </div>

                  <div>

                    <h4>Bug Detection</h4>

                    <p>
                      AI detects mistakes and suggests improvements.
                    </p>

                  </div>

                </div>

                <div className="dashboard-card">

                  <div className="dashboard-icon">
                    <BsGraphUpArrow />
                  </div>

                  <div>

                    <h4>Performance Score</h4>

                    <p>
                      Current Interview Score : 94%
                    </p>

                  </div>

                </div>

              </>

              :

              <>

                <div className="dashboard-card">

                  <div className="dashboard-icon">
                    <BsPersonCheck />
                  </div>

                  <div>

                    <h4>Behavior Analysis</h4>

                    <p>
                      AI evaluates your communication and body language.
                    </p>

                  </div>

                </div>

                <div className="dashboard-card">

                  <div className="dashboard-icon">
                    <BsMic />
                  </div>

                  <div>

                    <h4>Communication Score</h4>

                    <p>
                      Analyze speaking pace, clarity and confidence.
                    </p>

                  </div>

                </div>

                <div className="dashboard-card">

                  <div className="dashboard-icon">
                    <BsEmojiSmile />
                  </div>

                  <div>

                    <h4>Confidence Level</h4>

                    <p>
                      AI continuously measures confidence while answering.
                    </p>

                  </div>

                </div>

                <div className="dashboard-card">

                  <div className="dashboard-icon">
                    <BsShieldCheck />
                  </div>

                  <div>

                    <h4>Interview Readiness</h4>

                    <p>
                      Overall Interview Readiness : 96%
                    </p>

                  </div>

                </div>

              </>

            }

          </div>
                    {/* Floating Cards */}

          {mode === "coding" ? (
            <>
              <div className="floating-card floating-card-1">
                💻 Live Coding
              </div>

              <div className="floating-card floating-card-2">
                🤖 AI Code Review
              </div>

              <div className="floating-card floating-card-3">
                ⚡ Runtime Analysis
              </div>
            </>
          ) : (
            <>
              <div className="floating-card floating-card-1">
                👔 HR Interview
              </div>

              <div className="floating-card floating-card-2">
                🎤 Communication Score
              </div>

              <div className="floating-card floating-card-3">
                😊 Confidence 96%
              </div>
            </>
          )}

          {/* Decorative Ring */}

          <div className="gradient-ring"></div>

        </div>

      </div>

    </section>

  );
};

export default YourAIHero;
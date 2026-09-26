import React from "react";

import {
  SiZoom,
  SiHackerrank,
  SiLeetcode,
  SiCodesignal,
} from "react-icons/si";

import {
  FaMicrosoft,
} from "react-icons/fa";

import {
  FcGoogle,
} from "react-icons/fc";

import {
  FiArrowRight,
} from "react-icons/fi";

const YourAIPlatforms = () => {

  return (

    <section className="platforms">

      <div className="platforms-container">

        {/* LEFT SIDE */}

        <div className="platforms-left">

          <span className="platform-badge">

            Works Everywhere

          </span>

          <h2>

            One AI Assistant

            <span>
              Every Interview Platform
            </span>

          </h2>

          <p>

            AzentMart AI works seamlessly across coding,
            HR and technical interviews. Practice interviews
            on your favorite platforms while receiving
            real-time AI assistance and insights.

          </p>

          <div className="platform-list">

            <div>

              <FcGoogle />

              <span>Google Meet</span>

            </div>

            <div>

              <FaMicrosoft />

              <span>Microsoft Teams</span>

            </div>

            <div>

              <SiZoom />

              <span>Zoom</span>

            </div>

            <div>

              <SiHackerrank />

              <span>HackerRank</span>

            </div>

            <div>

              <SiLeetcode />

              <span>LeetCode</span>

            </div>

            <div>

              <SiCodesignal />

              <span>CodeSignal</span>

            </div>

          </div>

          <button className="platform-btn">

            Explore Integrations

            <FiArrowRight />

          </button>

        </div>

        {/* RIGHT SIDE */}

        <div className="platforms-right">

          <div className="platform-window">

            <div className="window-top">

              <span></span>
              <span></span>
              <span></span>

            </div>

            <div className="meeting-screen">
                            {/* Candidate Video */}

              <div className="candidate"></div>

              {/* AI Assistant Panel */}

              <div className="ai-panel">

                <h4>🤖 AI Assistant</h4>

                <div className="score">

                  <span>Confidence</span>

                  <strong>96%</strong>

                </div>

                <div className="score">

                  <span>Communication</span>

                  <strong>94%</strong>

                </div>

                <div className="score">

                  <span>Technical Skills</span>

                  <strong>98%</strong>

                </div>

                <div className="score">

                  <span>Problem Solving</span>

                  <strong>95%</strong>

                </div>

              </div>

            </div>

          </div>

          {/* Floating Platform Icons */}

          <div className="platform-logo logo1">

            <FcGoogle />

          </div>

          <div className="platform-logo logo2">

            <SiHackerrank />

          </div>

          <div className="platform-logo logo3">

            <SiLeetcode />

          </div>

        </div>

      </div>

    </section>

  );

};

export default YourAIPlatforms;
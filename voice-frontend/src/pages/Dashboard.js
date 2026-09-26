import React from "react";

import {
  FaPhoneAlt,
  FaBullhorn,
  FaClock,
  FaDatabase,
  FaArrowUp,
  FaArrowDown,
  FaChevronDown,
  FaChevronRight,
  FaHeadset,
  FaPhoneVolume,
  FaRobot,
  FaHistory,
  FaChartLine,
  FaUserCheck,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Calls",
      value: "2",
      icon: <FaPhoneAlt />,
      color: "purple",
      bottomLeft: "Today",
      bottomLeftValue: "2.17 mins",
      bottomMiddle: "Last 7 Days",
      bottomMiddleValue: "2.17 mins",
      bottomRight: "Last 30 Days",
      bottomRightValue: "2.17 mins",
    },

    {
      title: "Total Campaigns",
      value: "0",
      icon: <FaBullhorn />,
      color: "pink",
      bottomLeft: "Active Campaigns",
      bottomLeftValue: "0",
      bottomMiddle: "Inactive Campaigns",
      bottomMiddleValue: "0",
      bottomRight: "",
      bottomRightValue: "",
    },

    {
      title: "Avg Response Latency",
      value: "—",
      icon: <FaPhoneVolume />,
      color: "purple",
      bottomLeft: "Calls measured",
      bottomLeftValue: "—",
      bottomMiddle: "",
      bottomMiddleValue: "",
      bottomRight: "",
      bottomRightValue: "",
    },

    {
      title: "LLM Tokens Used",
      value: "0",
      icon: <FaDatabase />,
      color: "purple",
      bottomLeft: "Input",
      bottomLeftValue: "0",
      bottomMiddle: "Output",
      bottomMiddleValue: "0",
      bottomRight: "",
      bottomRightValue: "",
    },
  ];

  const calls = [
    {
      date: "15 Aug",
      inbound: 0,
      outbound: 0,
      playground: 0,
    },
    {
      date: "16 Aug",
      inbound: 0,
      outbound: 0,
      playground: 0,
    },
    {
      date: "17 Aug",
      inbound: 0,
      outbound: 0,
      playground: 0,
    },
    {
      date: "18 Aug",
      inbound: 0,
      outbound: 0,
      playground: 0,
    },
    {
      date: "19 Aug",
      inbound: 0,
      outbound: 0,
      playground: 0,
    },
    {
      date: "20 Aug",
      inbound: 0,
      outbound: 0,
      playground: 0,
    },
    {
      date: "21 Aug",
      inbound: 2,
      outbound: 0,
      playground: 0,
    },
  ];

  const recentCalls = [
    {
      name: "Priya Kumar",
      phone: "+91 98765 43210",
      duration: "04:21",
      status: "Qualified",
    },

    {
      name: "Arun Kumar",
      phone: "+91 98452 78123",
      duration: "03:48",
      status: "Follow-up",
    },

    {
      name: "Meena S",
      phone: "+91 99621 45678",
      duration: "06:12",
      status: "Resolved",
    },
  ];

  return (
    <div className="dashboard-page">
      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <section className="dashboard-stats">
        {stats.map((stat) => (
          <div className="dashboard-stat-card" key={stat.title}>
            <div className="stat-card-header">
              <div>
                <span className="stat-card-title">{stat.title}</span>

                <strong className="stat-card-value">{stat.value}</strong>
              </div>

              <div className={`stat-card-icon ${stat.color}`}>{stat.icon}</div>
            </div>

            <div className="stat-card-footer">
              {stat.bottomLeft && (
                <div>
                  <span>{stat.bottomLeft}</span>
                  <strong>{stat.bottomLeftValue}</strong>
                </div>
              )}

              {stat.bottomMiddle && (
                <div>
                  <span>{stat.bottomMiddle}</span>
                  <strong>{stat.bottomMiddleValue}</strong>
                </div>
              )}

              {stat.bottomRight && (
                <div>
                  <span>{stat.bottomRight}</span>
                  <strong>{stat.bottomRightValue}</strong>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* =====================================================
          ANALYTICS GRID
      ===================================================== */}

      <section className="dashboard-analytics">
        {/* =================================================
            CALL METRICS
        ================================================= */}

        <div className="dashboard-panel call-metrics-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Call Metrics</h2>
            </div>

            <div className="chart-controls">
              <div className="chart-legend">
                <span>
                  <i className="legend inbound" />
                  Inbound
                </span>

                <span>
                  <i className="legend outbound" />
                  Outbound
                </span>

                <span>
                  <i className="legend playground" />
                  Playground
                </span>
              </div>
            </div>
          </div>

          <div className="call-chart">
            <div className="chart-y-values">
              <span>2</span>
              <span>1</span>
              <span>0</span>
            </div>

            <div className="chart-main">
              <div className="chart-horizontal-lines">
                <span />
                <span />
                <span />
                <span />
              </div>

              <svg
                viewBox="0 0 900 300"
                preserveAspectRatio="none"
                className="dashboard-line-chart"
              >
                <defs>
                  <linearGradient
                    id="greenChartFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#4fd9ae" stopOpacity="0.30" />

                    <stop offset="100%" stopColor="#4fd9ae" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* AREA */}

                <path
                  d="
                    M0 270
                    L750 270
                    C780 270 800 220 825 160
                    C850 100 870 25 900 25
                    L900 300
                    L0 300
                    Z
                  "
                  fill="url(#greenChartFill)"
                />

                {/* PLAYGROUND */}

                <path
                  d="
                    M0 270
                    L750 270
                    C780 270 800 220 825 160
                    C850 100 870 25 900 25
                  "
                  fill="none"
                  stroke="#4fd9ae"
                  strokeWidth="4"
                />

                {/* INBOUND */}

                <path
                  d="
                    M0 270
                    L900 270
                  "
                  fill="none"
                  stroke="#8e91e9"
                  strokeWidth="2"
                />

                {/* OUTBOUND */}

                <path
                  d="
                    M0 270
                    L900 270
                  "
                  fill="none"
                  stroke="#bd8585"
                  strokeWidth="2"
                />
              </svg>

              <div className="chart-x-values">
                {calls.map((call) => (
                  <span key={call.date}>{call.date}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="analytics-side">
          {/* CAMPAIGN PERFORMANCE */}

          <div className="dashboard-panel campaign-performance">
            <div className="dashboard-panel-header">
              <h2>Campaign Performance</h2>

              <button type="button">
                <FaChevronDown />
              </button>
            </div>

            <div className="empty-analytics">
              <div className="empty-icon">
                <FaBullhorn />
              </div>

              <strong>No campaign data</strong>

              <p>Create a campaign to see performance analytics.</p>

              <button
                type="button"
                onClick={() => navigate("/dashboard/campaigns")}
              >
                Create Campaign
              </button>
            </div>
          </div>

          {/* SENTIMENT */}

          <div className="dashboard-panel sentiment-panel">
            <div className="dashboard-panel-header">
              <h2>Call Sentiment Analysis</h2>

              <button type="button">
                <FaChevronDown />
              </button>
            </div>

            <div className="empty-analytics">
              <div className="sentiment-placeholder">
                <div className="sentiment-line positive">
                  <span />
                </div>

                <div className="sentiment-line neutral">
                  <span />
                </div>

                <div className="sentiment-line negative">
                  <span />
                </div>
              </div>

              <strong>No sentiment data available</strong>

              <p>Sentiment analysis will appear after calls are processed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LOWER DASHBOARD
      ===================================================== */}

      <section className="dashboard-lower-grid">
        {/* RECENT CALLS */}

        <div className="dashboard-panel recent-calls-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Recent Calls</h2>

              <p>Latest voice conversations</p>
            </div>

            <button
              type="button"
              className="panel-link"
              onClick={() => navigate("/dashboard/call-history")}
            >
              View All
              <FaChevronRight />
            </button>
          </div>

          <div className="recent-calls-list">
            {recentCalls.map((call) => (
              <div className="recent-call-row" key={call.phone}>
                <div className="recent-call-avatar">{call.name.charAt(0)}</div>

                <div className="recent-call-info">
                  <strong>{call.name}</strong>

                  <span>{call.phone}</span>
                </div>

                <div className="recent-call-duration">
                  <FaClock />

                  {call.duration}
                </div>

                <span
                  className={`call-status ${call.status
                    .toLowerCase()
                    .replace("-", "")}`}
                >
                  {call.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="dashboard-panel quick-actions-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Quick Actions</h2>

              <p>Manage your AI voice platform</p>
            </div>
          </div>

          <div className="quick-action-grid">
            <button
              type="button"
              onClick={() => navigate("/dashboard/dialers")}
            >
              <span>
                <FaPhoneAlt />
              </span>

              <strong>Start Dialer</strong>

              <small>Make outbound calls</small>
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard/assistants")}
            >
              <span>
                <FaRobot />
              </span>

              <strong>AI Assistants</strong>

              <small>Manage voice agents</small>
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard/campaigns")}
            >
              <span>
                <FaBullhorn />
              </span>

              <strong>Campaigns</strong>

              <small>Run voice campaigns</small>
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard/call-history")}
            >
              <span>
                <FaHistory />
              </span>

              <strong>Call History</strong>

              <small>Review conversations</small>
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          PLATFORM OVERVIEW
      ===================================================== */}

      <section className="platform-overview">
        {/* TODAY'S CALLS */}

        <div className="overview-card">
          <div className="overview-icon">
            <FaChartLine />
          </div>

          <div>
            <span>Today's Calls</span>

            <strong>2</strong>
          </div>

          <span className="overview-change positive">
            <FaArrowUp />
            100%
          </span>
        </div>

        {/* QUALIFIED LEADS */}

        <div className="overview-card">
          <div className="overview-icon">
            <FaUserCheck />
          </div>

          <div>
            <span>Qualified Leads</span>

            <strong>0</strong>
          </div>

          <span className="overview-change neutral">—</span>
        </div>

        {/* AVG CALL DURATION */}

        <div className="overview-card">
          <div className="overview-icon">
            <FaClock />
          </div>

          <div>
            <span>Avg Call Duration</span>

            <strong>02:17</strong>
          </div>

          <span className="overview-change positive">
            <FaArrowDown />
            4.2%
          </span>
        </div>

        {/* REMAINING MINUTES */}

        <div className="overview-card">
          <div className="overview-icon">
            <FaDatabase />
          </div>

          <div>
            <span>Remaining Minutes</span>

            <strong>10.00</strong>
          </div>

          <span className="overview-change positive">Active</span>
        </div>
      </section>

      {/* =====================================================
          BOTTOM MESSAGE
      ===================================================== */}

      <section className="dashboard-footer-card">
        <div>
          <div className="footer-card-icon">
            <FaHeadset />
          </div>

          <div>
            <strong>Need help with your AI Voice setup?</strong>

            <p>
              Explore the documentation or contact our support team for
              assistance.
            </p>
          </div>
        </div>

        <div className="footer-card-actions">
          <button
            type="button"
            onClick={() => navigate("/dashboard/documentation")}
          >
            Documentation
          </button>

          <button type="button" onClick={() => navigate("/dashboard/support")}>
            Contact Support
          </button>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;

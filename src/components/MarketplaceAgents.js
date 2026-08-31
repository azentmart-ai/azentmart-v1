import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaMicrophone,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaUsers,
  FaHeadset,
  FaShoppingCart,
  FaChartLine,
  FaHeartbeat,
  FaMoneyBillWave,
  FaBalanceScale,
  FaBullhorn,
  FaCogs,
  FaHome,
  FaSearch,
  FaStar
} from "react-icons/fa";

/* ================= AGENTS DATA ================= */

const agents = [
  {
    name: "Voice Agent",
    slug: "voice-agent",
    industry: "Operations",
    desc: "AI-powered voice agent for automated calls and conversations.",
    tier: "Enterprise",
    rating: 4.5,
    icon: <FaMicrophone />
  },
  {
    name: "WhatsApp Agent",
    slug: "whatsapp-ai-agent",
    industry: "Customer Support",
    desc: "Automate WhatsApp chats, lead qualification, and support.",
    tier: "Enterprise",
    rating: 4.6,
    icon: <FaWhatsapp />
  },
  {
    name: "Instagram Agent",
    slug: "instagram-agent",
    industry: "Marketing",
    desc: "Automate DMs, generate leads, and boost engagement.",
    tier: "Enterprise",
    rating: 4.7,
    icon: <FaInstagram />
  },
  {
    name: "Facebook Agent",
    slug: "facebook-agent",
    industry: "Marketing",
    desc: "Messenger automation and campaign interaction AI.",
    tier: "Enterprise",
    rating: 4.4,
    icon: <FaFacebook />
  }
];

/* ================= INDUSTRY ICONS ================= */

const industryIcons = {
  Sales: <FaChartLine />,
  Ecommerce: <FaShoppingCart />,
  Healthcare: <FaHeartbeat />,
  HR: <FaUsers />,
  Finance: <FaMoneyBillWave />,
  Legal: <FaBalanceScale />,
  Marketing: <FaBullhorn />,
  Operations: <FaCogs />,
  "Real Estate": <FaHome />,
  "Customer Support": <FaHeadset />
};

/* ================= COMPONENT ================= */

function MarketplaceAgents() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const agentsPerPage = 9;

  /* SEARCH FILTER */
  const filtered = agents.filter((agent) =>
    agent.name.toLowerCase().includes(search.toLowerCase()) ||
    agent.industry.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */
  const indexLast = currentPage * agentsPerPage;
  const indexFirst = indexLast - agentsPerPage;
  const currentAgents = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / agentsPerPage);

  return (
    <section className="marketplace-section">

      {/* SEARCH */}
      <div className="search-box">
        <FaSearch />
        <input
          type="text"
          placeholder="Search Agents..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* AGENTS GRID */}
      <div className="container">
        <div className="row agents-grid">

          {currentAgents.map((agent, i) => (
            <div className="col-12 col-md-6 col-lg-4 d-flex" key={i}>

              <div
                className="agent-card w-100"
                onClick={() => navigate(`/${agent.slug}`)}
                style={{ cursor: "pointer" }}
              >

                {/* TOP */}
                <div className="agent-top">

                  <div className="agent-icon">
                    {industryIcons[agent.industry] || agent.icon}
                  </div>

                  <div>
                    <h3>{agent.name}</h3>

                    <div className="agent-tags">
                      <span className="tag">{agent.industry}</span>
                      <span className="tier">{agent.tier}</span>
                    </div>
                  </div>

                </div>

                {/* DESCRIPTION */}
                <p className="agent-desc">{agent.desc}</p>

                {/* RATING */}
                <div className="rating">
                  {[...Array(Math.round(agent.rating))].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                  <span>{agent.rating}</span>
                </div>

                {/* BUTTONS */}
                <div className="agent-buttons">

                  <button
                    className="details-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card click
                      navigate(`/${agent.slug}`);
                    }}
                  >
                    View Details
                  </button>

                 <button
                  className="activate-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    navigate("/pricing");
                  }}
                >
                  Activate
                </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      </div>

      {/* PAGINATION */}
      <div className="pagination">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>

      </div>

    </section>
  );
}

export default MarketplaceAgents;
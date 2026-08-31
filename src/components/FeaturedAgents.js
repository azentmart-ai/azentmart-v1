import React from "react";
import { Link } from "react-router-dom";
import {
  FaMicrophone,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaUsers,
  FaDollarSign,
  FaHeadset,
  FaPenNib,
  FaShoppingCart,
  FaBalanceScale
} from "react-icons/fa";

function FeaturedAgents() {

  const agents = [
      {
        name: "Voice Agent",
        slug: "voice-agent",
        category: "Voice AI",
        desc: "AI-powered voice agent for automated calls, conversations, and real-time customer interaction.",
        plan: "Enterprise",
        icon: <FaMicrophone />
      },
      {
        name: "WhatsApp Agent",
        slug: "whatsapp-ai-agent",
        category: "Social Media AI",
        desc: "AI-powered WhatsApp agent for automated chats, lead qualification, and real-time customer support.",
        plan: "Enterprise",
        icon: <FaWhatsapp />
      },
    {
      name: "Instagram Agent",
      slug: "instagram-agent",
      category: "Social Media AI",
      desc: "AI-powered Instagram agent for automated DMs, lead generation, and audience engagement.",
      plan: "Enterprise",
      icon: <FaInstagram />
    },
    {
      name: "Facebook Agent",
      slug: "facebook-agent",
      category: "Social Media AI",
      desc: "AI-powered Facebook agent for Messenger automation, customer support, and campaign interactions.",
      plan: "Enterprise",
      icon: <FaFacebook />
    },
    {
      name: "Legal Agent for Advocates",
      slug: "legal-agent",
      category: "Legal AI",
      desc: "AI-powered legal assistant for advocates to manage client inquiries, schedule consultations, draft legal documents, and provide instant case-related support.",
      plan: "Enterprise",
      icon: <FaBalanceScale />
    },
    // {
    //   name: "TalentScout Pro",
    //   slug: "talentscout-pro",
    //   category: "HR & Recruitment",
    //   desc: "AI-powered talent sourcing and candidate screening for modern recruiters.",
    //   plan: "Enterprise",
    //   icon: <FaUsers />
    // },
    // {
    //   name: "FinanceFlow Agent",
    //   slug: "financeflow-agent",
    //   category: "Finance",
    //   desc: "Streamline financial reporting, forecasting, and budget automation.",
    //   plan: "Basic",
    //   icon: <FaDollarSign />
    // },
    // {
    //   name: "SupportGenius",
    //   slug: "supportgenius",
    //   category: "Customer Support",
    //   desc: "Resolve customer tickets instantly with smart AI support workflows.",
    //   plan: "Free",
    //   icon: <FaHeadset />
    // },
    // {
    //   name: "ContentCraft AI",
    //   slug: "contentcraft-ai",
    //   category: "Marketing & Content",
    //   desc: "Generate high-converting marketing content at scale with AI creativity.",
    //   plan: "Pro",
    //   icon: <FaPenNib />
    // },
    // {
    //   name: "ShopBoost Agent",
    //   slug: "shopboost-agent",
    //   category: "Ecommerce",
    //   desc: "Boost ecommerce conversions with personalized product recommendations.",
    //   plan: "Basic",
    //   icon: <FaShoppingCart />
    // }
  ];

  return (
    <section className="featured-section">

      <div className="featured-badge">Featured Agents</div>

      <h2 className="featured-title">
        Top AI Agents for Every Team
      </h2>

      <p className="featured-desc">
        Explore our handpicked selection of high-impact AI agents trusted by thousands of businesses worldwide.
      </p>

      <div className="container">
        <div className="row g-4">

          {agents.map((agent, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={index}>

              <div className="agent-card">

                <div className="agent-header">

                  <div className="agent-icon">
                    {agent.icon}
                  </div>

                  <div>
                    <h3>{agent.name}</h3>
                    <span className="agent-category">{agent.category}</span>
                  </div>

                </div>

                <p className="agent-desc">
                  {agent.desc}
                </p>

                <div className="agent-footer">

                  <span className="agent-plan">
                    {agent.plan}
                  </span>

                  <Link to={`/${agent.slug}`} className="view-btn">
                    View Agent
                  </Link>

                </div>

              </div>

            </div>
          ))}

        </div>
      </div>

      <Link to="/marketplace" className="explore-btn">
        Explore All Agents
      </Link>

    </section>
  );
}

export default FeaturedAgents;
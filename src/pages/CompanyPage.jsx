import React from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowRight, FaBriefcase, FaEnvelope, FaUsers } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Style/LandingPage.css";

const content = {
  about: {
    kicker: "COMPANY",
    title: "About AzentMart",
    intro: "Building the AI workforce for every business.",
    body: "AzentMart AI is building a practical AI workforce platform where specialized AI employees can support people across sales, customer service, voice, marketing, operations and other business functions. The focus is not simply adding another AI tool—it is connecting capable AI systems to the work businesses already do.",
    detailTitle: "AI that fits the way businesses work.",
    detail: [
      ["A workforce, not just a chatbot", "Specialized AI employees are designed around roles, responsibilities and repeatable workflows."],
      ["Built for real workflows", "AzentMart focuses on the handoffs, tools and processes that turn an AI response into useful business work."],
      ["Human + AI by design", "People can review, approve or take over when context, judgment or accountability matters."],
      ["A growing workforce vision", "The platform is designed around a long-term vision of 10,000+ AI employees across industries and functions."],
    ],
    cards: ["AI workforce platform", "10,000+ AI employee vision", "Every business. Every function."],
  },
  leadership: {
    kicker: "COMPANY",
    title: "Leadership Team",
    intro: "The people shaping the AzentMart AI journey.",
    body: "AzentMart is being built around a clear product vision: make advanced AI useful inside everyday business operations. This section is intentionally structured to introduce official leaders, roles and biographies as they are approved, without inventing names, credentials or claims.",
    detailTitle: "A leadership model built around useful AI.",
    detail: [
      ["Product vision", "Keep the platform focused on practical business outcomes, clear workflows and measurable value."],
      ["Technology & AI", "Build reliable AI systems that can reason about tasks, use connected tools and operate within defined boundaries."],
      ["Business execution", "Turn customer needs into deployable workflows while keeping implementation understandable and accountable."],
      ["Responsible growth", "Expand the AI workforce without losing sight of security, human oversight and customer trust."],
    ],
    cards: ["Product vision", "Technology & AI", "Business execution", "Responsible growth"],
  },
  culture: {
    kicker: "COMPANY",
    title: "Culture",
    intro: "Build boldly. Work thoughtfully. Keep people at the center.",
    body: "We value curiosity, ownership, collaboration and continuous learning. We aim to build with a practical mindset: solve meaningful problems, make AI useful, communicate clearly and keep people involved wherever context, judgment or responsibility matters.",
    detailTitle: "How we want to work together.",
    detail: [
      ["Build with purpose", "Start with a real problem and make every product decision serve a useful outcome."],
      ["Stay curious", "Question assumptions, learn quickly and keep improving the systems we build."],
      ["Own the outcome", "Take responsibility for the quality of the work, not just the task that was assigned."],
      ["Work together", "Share context, give useful feedback and make collaboration part of the product process."],
      ["Human + AI", "Use AI to extend what people can do while respecting human judgment and responsibility."],
    ],
    cards: ["Build with purpose", "Stay curious", "Own the outcome", "Work together", "Human + AI"],
  },
  careers: {
    kicker: "COMPANY",
    title: "Careers",
    intro: "Build the future of work with us.",
    body: "We are interested in people who want to build practical AI products, intelligent workflows and new ways for people and AI systems to work together. As roles become available, opportunities may span engineering, AI and automation, product, design, growth and business operations.",
    detailTitle: "Work on problems that connect AI to real businesses.",
    detail: [
      ["Engineering", "Build dependable web products, platforms, integrations and systems that businesses can use every day."],
      ["AI & Automation", "Design AI workflows, agent behavior, tool use and evaluation around concrete business tasks."],
      ["Product & Growth", "Understand customer problems, shape useful experiences and help turn adoption into measurable value."],
      ["Design", "Create interfaces and workflows that make powerful AI understandable, approachable and easy to use."],
      ["Business Operations", "Help connect product, customers, partnerships and internal processes as the company grows."],
    ],
    cards: ["Engineering", "AI & Automation", "Product & Growth", "Design", "Business Operations"],
  },
  contact: {
    kicker: "COMPANY",
    title: "Contact Us",
    intro: "Let's talk about your AI workforce.",
    body: "Tell us what your business is trying to automate, where your teams need support and which workflows you want to improve. The AzentMart team can help identify a practical starting point.",
    detailTitle: "Start with the workflow you want to improve.",
    detail: [
      ["Sales enquiries", "Explore AI employees and workflows for lead generation, qualification and follow-up."],
      ["Partnerships", "Discuss integrations, channel opportunities and ways to work with AzentMart."],
      ["Support", "Share product, account or technical questions so the right team can help."],
    ],
    cards: ["Sales enquiries", "Partnerships", "Support"],
  },
};

function CompanyPage() {
  const { section = "about" } = useParams();
  const page = content[section] || content.about;

  return (
    <div className="az-site">
      <Navbar />
      <main className="az-company-page">
        <section className="az-company-hero">
          <div className="az-hero-grid" />
          <div className="az-container az-company-hero-inner">
            <div>
              <span className="az-section-kicker">{page.kicker}</span>
              <h1>{page.title}</h1>
              <p className="az-company-intro">{page.intro}</p>
              <p className="az-company-body">{page.body}</p>
              {section === "contact" && <Link className="az-btn az-btn-primary" to="/company/contact">Talk to AzentMart <FaEnvelope /></Link>}
              {section === "careers" && <a className="az-btn az-btn-primary" href="mailto:careers@azentmart.ai">Ask about careers <FaBriefcase /></a>}
            </div>
            <div className="az-company-panel">
              <div className="az-company-panel-mark"><FaUsers /></div>
              <small>AZENTMART AI</small>
              <strong>{page.title}</strong>
              <div className="az-company-panel-lines">{page.cards.map((card) => <span key={card}><i />{card}</span>)}</div>
            </div>
          </div>
        </section>

        <section className="az-company-detail-section">
          <div className="az-container az-company-detail-grid">
            <div>
              <span className="az-section-kicker">{page.title.toUpperCase()}</span>
              <h2>{page.detailTitle}</h2>
            </div>
            <div className="az-company-detail-copy">
              <p>{page.body}</p>
              <div className="az-company-detail-cards">
                {page.detail.map(([title, text]) => (
                  <article className="az-company-detail-card" key={title}>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="az-section az-company-links-section">
          <div className="az-container">
            <div className="az-section-heading"><span className="az-section-kicker">EXPLORE COMPANY</span><h2>Learn more about AzentMart.</h2></div>
            <div className="az-company-link-grid">{Object.entries(content).map(([key, item]) => <Link key={key} to={`/company/${key}`} className={key === section ? "is-active" : ""}><span>{item.kicker}</span><strong>{item.title}</strong><FaArrowRight /></Link>)}</div>
            <Link to="/" className="az-text-link">Back to AzentMart home <FaArrowRight /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default CompanyPage;

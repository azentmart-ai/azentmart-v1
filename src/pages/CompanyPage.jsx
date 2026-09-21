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
    intro: "AzentMart AI is building an AI workforce platform for businesses.",
    body: "Our platform is designed around the idea that every business can use specialized AI employees across sales, support, voice, marketing, operations and other business functions. The goal is to make AI work part of everyday business workflows—not just another standalone tool.",
    cards: ["AI workforce platform", "10,000+ AI employee vision", "Every business. Every function."]
  },
  leadership: {
    kicker: "COMPANY",
    title: "Leadership Team",
    intro: "The people shaping the AzentMart AI journey.",
    body: "This space is designed for the official leadership profiles, roles and biographies supplied by the AzentMart team. Keeping these details editable makes it easy to publish approved leadership information without changing the site structure.",
    cards: ["Leadership", "Vision", "Execution"]
  },
  culture: {
    kicker: "COMPANY",
    title: "Culture",
    intro: "Build boldly. Work thoughtfully. Keep people at the center.",
    body: "AzentMart's culture page can communicate the values, working principles and employee experience that define the company. The layout is ready for your approved culture statements, team stories and visuals.",
    cards: ["Customer first", "Human + AI", "Continuous learning"]
  },
  careers: {
    kicker: "COMPANY",
    title: "Careers",
    intro: "Help build the AI workforce of the future.",
    body: "AzentMart brings together people who want to work on practical AI products, business automation and new ways for people and AI systems to collaborate. Add current openings and role details here as hiring needs are published.",
    cards: ["Engineering", "AI & Automation", "Product & Growth"]
  },
  contact: {
    kicker: "COMPANY",
    title: "Contact Us",
    intro: "Let's talk about your AI workforce.",
    body: "Tell us what your business is trying to automate, where your teams need support and which workflows you want to improve. The AzentMart team can then help identify a practical starting point.",
    cards: ["Sales enquiries", "Partnerships", "Support"]
  }
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
              {section === "contact" && <a className="az-btn az-btn-primary" href="mailto:hello@azentmart.ai">Email AzentMart <FaEnvelope /></a>}
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

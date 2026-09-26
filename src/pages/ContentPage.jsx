import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaArrowRight, FaEnvelope } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  businessFunctions,
  employeePages,
  industries,
  platformPages,
  processPages,
  resources,
  solutionPages,
  whyPages,
} from "../config/siteContent";
import "../Style/LandingPage.css";
import "../Style/ContentPage.css";

const catalog = {
  platform: platformPages,
  solutions: solutionPages,
  "ai-employees": employeePages,
  industries: Object.fromEntries(industries.map((item) => [item.id, item])),
  "business-functions": Object.fromEntries(businessFunctions.map((item) => [item.id, item])),
  "why-azentmart": whyPages,
  "how-it-works": processPages,
  resources,
};

const labels = {
  platform: "Platform",
  solutions: "Solutions",
  "ai-employees": "AI Employees",
  industries: "Industries",
  "business-functions": "Business Functions",
  "why-azentmart": "Why AzentMart",
  "how-it-works": "How It Works",
  resources: "Resources",
};

function ContentPage({ forcedCategory, forcedSlug }) {
  const params = useParams();
  const location = useLocation();
  const category = forcedCategory || params.category || location.pathname.split("/")[1];
  const slug = forcedSlug || params.slug || location.pathname.split("/").filter(Boolean).pop();
  const source = catalog[category] || catalog.platform;
  const page = source[slug] || source[Object.keys(source)[0]];

  const related = Object.entries(source).filter(([key]) => key !== slug).slice(0, 6);

  return (
    <div className="az-site az-content-site">
      <Navbar />
      <main className="az-content-page">
        <section className="az-content-hero">
          <div className="az-content-grid" />
          <div className="az-content-glow" />
          <div className="az-container az-content-hero-inner">
            <div className="az-content-copy">
              <Link className="az-content-breadcrumb" to={category === "resources" ? "/resources/learning" : `/${category}`}>{labels[category] || category}</Link>
              <span className="az-section-kicker">{page.kicker || labels[category]}</span>
              <div className="az-content-icon">{page.icon}</div>
              <h1>{page.title || page.name}</h1>
              <p className="az-content-intro">{page.intro || page.focus}</p>
              <p className="az-content-body">{page.body}</p>
              <div className={`az-content-actions ${category === "ai-employees" ? "az-ai-employees-actions" : ""}`}>
                {category === "ai-employees" ? (
                  <>
                    <Link className="az-btn az-btn-primary az-hero-demo" to="/demo">Get a demo <FaArrowRight /></Link>
                    <Link className="az-btn az-btn-secondary az-hero-explore" to="/ai-employees">Explore AI employees <FaArrowRight /></Link>
                  </>
                ) : (
                  <>
                    <Link className="az-btn az-btn-primary" to="/demo">Discuss this with AzentMart <FaArrowRight /></Link>
                    <Link className="az-btn az-btn-secondary" to="/marketplace">Explore agents <FaArrowRight /></Link>
                  </>
                )}
              </div>
            </div>

            <div className="az-content-panel">
              <span>WORKFLOW SNAPSHOT</span>
              <strong>{page.title || page.name}</strong>
              <div className="az-content-points">
                {(page.cards || [page.focus, "AI-assisted workflows", "Human escalation"]).map((card) => <div key={card}><i />{card}</div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="az-section az-content-detail-section">
          <div className="az-container">
            <div className="az-content-detail-grid">
              <div>
                <span className="az-section-kicker">DESIGNED FOR REAL WORK</span>
                <h2>Connect the workflow to the people, systems and outcomes that matter.</h2>
              </div>
              <div className="az-content-detail-copy">
                <p>{page.body}</p>
                <p>Start with a focused process, define where AI can act, and keep clear escalation points for work that requires human judgment or authorization.</p>
                <Link className="az-text-link" to="/company/contact">Talk to the team <FaArrowRight /></Link>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="az-section az-content-related-section">
            <div className="az-container">
              <div className="az-section-heading">
                <span className="az-section-kicker">EXPLORE MORE</span>
                <h2>Continue exploring AzentMart AI.</h2>
              </div>
              <div className="az-content-related-grid">
                {related.map(([key, item]) => (
                  <Link key={key} to={`/${category}/${key}`} className="az-content-related-card">
                    <span>{item.kicker || labels[category]}</span>
                    <strong>{item.title || item.name}</strong>
                    <p>{item.intro || item.focus}</p>
                    <FaArrowRight />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="az-content-contact-strip">
          <div className="az-container">
            <div>
              <span className="az-section-kicker">NEED A STARTING POINT?</span>
              <h2>Tell us what you want to automate.</h2>
            </div>
            <div className="az-content-contact-actions">
              <Link className="az-btn az-btn-white" to="/demo">Book a demo <FaArrowRight /></Link>
              <a className="az-content-email" href="mailto:hello@azentmart.ai"><FaEnvelope /> hello@azentmart.ai</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ContentPage;

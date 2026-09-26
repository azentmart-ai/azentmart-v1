import React from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { businessFunctions, employeePages, industries, platformPages, processPages, resources, solutionPages, whyPages } from "../config/siteContent";
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

const titles = {
  platform: ["PLATFORM", "One platform for your AI workforce."],
  solutions: ["SOLUTIONS", "AI workflows for the problems your business needs to solve."],
  "ai-employees": ["AI EMPLOYEES", "Specialized AI employees across business functions."],
  industries: ["INDUSTRIES", "Explore AI by industry domain."],
  "business-functions": ["BUSINESS FUNCTIONS", "Explore AI employees by business function."],
  "why-azentmart": ["WHY AZENTMART", "Explore the outcomes the platform is designed to support."],
  "how-it-works": ["HOW IT WORKS", "From workflow discovery to ongoing management."],
  resources: ["RESOURCES", "Practical resources for building with AI."],
};

function CategoryPage() {
  const { category = "platform" } = useParams();
  const source = catalog[category] || catalog.platform;
  const [kicker, title] = titles[category] || titles.platform;

  return (
    <div className="az-site az-content-site">
      <Navbar />
      <main className="az-content-page">
        <section className="az-content-hero">
          <div className="az-content-grid" />
          <div className="az-container">
            <div className="az-content-copy">
              <span className="az-section-kicker">{kicker}</span>
              <h1>{title}</h1>
              <p className="az-content-intro">Choose a topic below to open its dedicated page and explore the workflow in more detail.</p>
            </div>
          </div>
        </section>
        <section className="az-section az-content-related-section">
          <div className="az-container">
            <div className="az-content-related-grid">
              {Object.entries(source).map(([key, item]) => (
                <Link key={key} to={`/${category}/${key}`} className="az-content-related-card">
                  <span>{item.kicker || kicker}</span>
                  <strong>{item.title || item.name}</strong>
                  <p>{item.intro || item.focus}</p>
                  <FaArrowRight />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default CategoryPage;

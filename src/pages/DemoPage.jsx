import React, { useState } from "react";
import { FaArrowRight, FaCheck, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Style/LandingPage.css";
import "../Style/ContentPage.css";

function DemoPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`AzentMart AI demo request - ${form.company || form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\n\nWhat I want to automate:\n${form.message}`);
    window.location.href = `mailto:hello@azentmart.ai?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="az-site az-content-site">
      <Navbar />
      <main className="az-demo-page">
        <section className="az-content-hero az-demo-hero">
          <div className="az-content-grid" />
          <div className="az-container az-demo-shell">
            <div className="az-demo-copy">
              <span className="az-section-kicker">BOOK A DEMO</span>
              <h1>Let's find the right AI workflow for your business.</h1>
              <p>Tell us what your team is trying to automate. The form prepares an email request so the conversation can start with the right context.</p>
              <div className="az-demo-points">
                <span><FaCheck /> Workflow discovery</span>
                <span><FaCheck /> AI employee fit</span>
                <span><FaCheck /> Human + AI handoff</span>
              </div>
              <div className="az-demo-direct"><a href="mailto:hello@azentmart.ai"><FaEnvelope /> hello@azentmart.ai</a><a href="tel:+916364252828"><FaPhoneAlt /> +91 63642 52828</a></div>
            </div>
            <form className="az-demo-form" onSubmit={submit}>
              <label>Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label>
              <label>Work email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" /></label>
              <label>Company<input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" /></label>
              <label>What would you like to automate?<textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Describe the workflow or problem..." /></label>
              {sent && <div className="az-demo-success" role="status">Your email draft is ready. If your mail app did not open, use hello@azentmart.ai directly.</div>}
              <button className="az-btn az-btn-primary" type="submit">Prepare demo request <FaArrowRight /></button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default DemoPage;

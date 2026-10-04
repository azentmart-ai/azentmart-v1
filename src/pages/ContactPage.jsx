import React, { useState } from "react";
import { FaArrowRight, FaHeadset, FaCheckCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Style/ContactPage.css";

const initialForm = {
  firstName: "",
  lastName: "",
  jobTitle: "",
  email: "",
  country: "",
  industry: "",
  reason: "",
  interest: "",
  message: "",
  consent: false,
};

function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    if (submitted) setSubmitted(false);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.consent) return;
    const subject = encodeURIComponent(`AzentMart AI contact request - ${form.firstName + " " + form.lastName}`);
    const body = encodeURIComponent([
      `Name: ${form.firstName} ${form.lastName}`,
      `Job Title: ${form.jobTitle}`,
      `Business Email: ${form.email}`,
      `Country: ${form.country}`,
      `Industry: ${form.industry}`,
      `Reason: ${form.reason}`,
      `Product / Service: ${form.interest}`,
      "",
      `Message: ${form.message}`
    ].join("\n"));
    window.location.href = `mailto:hello@azentmart.ai?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="az-contact-page">
      <Navbar />
      <main className="az-contact-main">
        <section className="az-contact-hero">
          <div className="az-contact-shell">
            <div className="az-contact-intro">
              <span className="az-contact-kicker">CONTACT AZENTMART AI</span>
              <h1>Let's build your <span>AI workforce.</span></h1>
              <p>Tell us what you are trying to automate, improve or scale. Our team can help you explore the right AI employee and workflow for your business.</p>

              <div className="az-contact-support">
                <div className="az-contact-support-icon"><FaHeadset /></div>
                <div>
                  <span>HELP &amp; SUPPORT</span>
                  <h3>Already using AzentMart?</h3>
                  <p>For product support, account questions or technical help, include the details in your message and our team can route your request.</p>
                </div>
              </div>

              <div className="az-contact-note"><FaCheckCircle /> Human guidance where it matters. AI automation where it makes sense.</div>
            </div>

            <div className="az-contact-form-card">
              <div className="az-contact-form-heading">
                <span>GET IN TOUCH</span>
                <h2>Tell us about your business.</h2>
              </div>
              {submitted && <div className="az-contact-success" role="status">Your email draft is ready. If your mail app did not open, use hello@azentmart.ai directly.</div>}
              <form onSubmit={submit}>
                <div className="az-contact-row">
                  <label>First Name<input name="firstName" value={form.firstName} onChange={update} required /></label>
                  <label>Last Name<input name="lastName" value={form.lastName} onChange={update} required /></label>
                </div>
                <div className="az-contact-row">
                  <label>Job Title<input name="jobTitle" value={form.jobTitle} onChange={update} /></label>
                  <label>Business Email<input type="email" name="email" value={form.email} onChange={update} required /></label>
                </div>
                <div className="az-contact-row">
                  <label>Country<select name="country" value={form.country} onChange={update} required><option value="">Select country</option><option>India</option><option>United States</option><option>United Kingdom</option><option>Singapore</option><option>United Arab Emirates</option><option>Other</option></select></label>
                  <label>Industry<select name="industry" value={form.industry} onChange={update} required><option value="">Select industry</option><option>Technology</option><option>Retail &amp; E-commerce</option><option>Healthcare</option><option>Finance</option><option>Education</option><option>Professional Services</option><option>Other</option></select></label>
                </div>
                <div className="az-contact-row">
                  <label>Reason for Contacting<select name="reason" value={form.reason} onChange={update} required><option value="">Select a reason</option><option>Book a demo</option><option>Explore AI employees</option><option>Automation consultation</option><option>Partnership</option><option>Product support</option></select></label>
                  <label>Product / Service of Interest<select name="interest" value={form.interest} onChange={update}><option value="">Select an option</option><option>AI Workforce Platform</option><option>AI HR Employee</option>
    <option>AI Recruitment Employee</option>
    <option>AI Finance Employee</option>
    <option>AI Banking Employee</option>
    <option>AI Legal Employee</option>
    <option>AI Marketing Employee</option>
    <option>AI Sales Employee</option>
    <option>AI Customer Support Employee</option>
    <option>AI Operations Employee</option><option>WhatsApp Agent</option><option>Instagram Agent</option><option>Interview Agent</option><option>Voice Agent</option><option>Custom Workflow</option></select></label>
                </div>
                <label>How can we help?<textarea name="message" value={form.message} onChange={update} rows="4" placeholder="Tell us about your workflow, goals or challenge..." /></label>
                <label className="az-contact-consent"><input type="checkbox" name="consent" checked={form.consent} onChange={update} required /><span>I agree to be contacted by AzentMart AI regarding my enquiry.</span></label>
                <button className="az-contact-submit" type="submit">Submit enquiry <FaArrowRight /></button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ContactPage;

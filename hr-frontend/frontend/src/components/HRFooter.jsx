import React from "react";
import { Link } from "react-router-dom";
import "./HRFooter.css";
import logo from "../assets/logo.png";

export default function HRFooter() {
  return (
    <footer className="hr-platform-footer">
      <div className="hr-platform-footer-inner">
        <div className="hr-footer-brand">
          <Link to="/" className="hr-footer-logo">
            <span className="hr-footer-logo-surface">
              <img src={logo} alt="AzentMart AI" />
            </span>
          </Link>
          <p>Intelligent people operations for modern organizations.</p>
        </div>
        <div className="hr-footer-column"><h4>PLATFORM</h4><Link to="/dashboard">Dashboard</Link><Link to="/employees">Employees</Link><Link to="/attendance">Attendance</Link><Link to="/leave">Leave</Link></div>
        <div className="hr-footer-column"><h4>PEOPLE</h4><Link to="/onboarding">Onboarding</Link><Link to="/documents">Documents</Link><Link to="/benefits">Benefits</Link><Link to="/policies">Policies</Link></div>
        <div className="hr-footer-column"><h4>INTELLIGENCE</h4><Link to="/support">AI HR Support</Link><Link to="/reports">Analytics & Reports</Link><Link to="/payroll">AI Payroll</Link><Link to="/onboarding/ai">AI Onboarding</Link></div>
        <div className="hr-footer-column"><h4>COMPANY</h4><Link to="/">About</Link><Link to="/">Contact</Link><Link to="/login">Sign in</Link><Link to="/signup">Get started</Link></div>
      </div>
      <div className="hr-footer-bottom"><span>© {new Date().getFullYear()} AzentMart. All rights reserved.</span><div><Link to="/">Privacy</Link><Link to="/">Terms</Link><Link to="/">Security</Link></div></div>
    </footer>
  );
}

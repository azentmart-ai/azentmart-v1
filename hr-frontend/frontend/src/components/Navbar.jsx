import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="public-nav">
      <Link to="/" className="public-brand">
        <img className="public-brand-logo" src="/agent-apps/hr/assets/logo.svg" style={{ width: 180, height: 52, objectFit: "contain", objectPosition: "left center", display: "block" }} alt="AzentMart AI" />
      </Link>

      <div className="public-nav-links">
        <Link to="/login">Login</Link>
        <Link to="/signup" className="btn btn-primary">
          Get started
        </Link>
      </div>
    </nav>
  );
}

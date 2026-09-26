import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/azentmart-logo.png";

function Navbar({ showMarketplace = true }) {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid navbar-container">

        <Link to="/" className="logo-link" aria-label="AzentMart AI home"><img src={logo} alt="AzentMart AI" className="logo" /></Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <ul className="nav-links navbar-nav">

            {/* <li className="nav-item">
              <Link className="nav-link" to="/agents/whatsapp/">Solutions</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/agents/whatsapp/">Products</Link>
            </li> */}
            <li className="nav-item">
              <Link className="nav-link" to="/agents/whatsapp/whatsapp-ai-agent">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/agents/whatsapp/pricing">Pricing</Link>
            </li>


            {showMarketplace && (
              <li className="nav-item">
                <Link className="nav-link" to="/marketplace">Marketplace</Link>
              </li>
            )}


            <li className="nav-item">
              <Link to="/agents/whatsapp/signin" className="login-btn">Login</Link>
            </li>
            <li className="nav-item">
                <Link to="/agents/whatsapp/signin" className="signin-btn">Book a Demo</Link>
            </li>
            {/* <li className="nav-item">
              <Link to="/agents/whatsapp/login" className="login-btn">Free Trial</Link>
            </li> */}

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
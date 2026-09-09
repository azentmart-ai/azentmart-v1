import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";

function Navbar({ showMarketplace = true }) {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid navbar-container">

        <img src={logo} alt="logo" className="logo" />

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

            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {showMarketplace && (
              <li className="nav-item">
                <Link className="nav-link" to="/marketplace">Marketplace</Link>
              </li>
            )}

            <li className="nav-item">
              <Link to="/signin" className="signin-btn">Sign In</Link>
            </li>

            <li className="nav-item">
              <Link to="/login" className="login-btn">Login</Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
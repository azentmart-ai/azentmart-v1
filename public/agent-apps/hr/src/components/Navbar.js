const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/components/Navbar.jsx";import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    React.createElement('nav', { className: "public-nav", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6}}
      , React.createElement(Link, { to: "/", className: "public-brand", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7}}
        , React.createElement('img', { className: "public-brand-logo", src: "/agent-apps/hr/assets/logo.svg", style: { width: 180, height: 52, objectFit: "contain", objectPosition: "left center", display: "block" }, alt: "AzentMart AI" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8}} )
      )

      , React.createElement('div', { className: "public-nav-links", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}
        , React.createElement(Link, { to: "/login", __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}, "Login")
        , React.createElement(Link, { to: "/signup", className: "btn btn-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}, "Get started"

        )
      )
    )
  );
}

const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/components/AppShell.jsx";import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar.js";
import Header from "./Header.js";
import HRFooter from "./HRFooter.js";
import HRChatbot from "./HRChatbot.js";

export default function AppShell() {
  const location = useLocation();

  // Footer should NOT appear on protected HR pages.
  // Home page has its own footer.
  const showFooter = false;

  return (
    React.createElement('div', { className: "min-h-screen bg-slate-50 text-slate-900 lg:flex"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
      , React.createElement(Sidebar, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 18}} )

      , React.createElement('div', { className: "min-w-0 flex-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
        , React.createElement(Header, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 21}} )

        , React.createElement('main', { className: "px-4 py-5 sm:px-6 lg:px-8 lg:py-7"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}
          , React.createElement(Outlet, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 24}} )
        )

        , showFooter && React.createElement(HRFooter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 27}} )
      )

      , React.createElement(HRChatbot, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 30}} )
    )
  );
}
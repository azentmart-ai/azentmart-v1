import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import HRFooter from "./HRFooter";
import HRChatbot from "./HRChatbot";

export default function AppShell() {
  const location = useLocation();

  // Footer should NOT appear on protected HR pages.
  // Home page has its own footer.
  const showFooter = false;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <Outlet />
        </main>

        {showFooter && <HRFooter />}
      </div>

      <HRChatbot />
    </div>
  );
}
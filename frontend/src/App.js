import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// =====================================================
// LANDING
// =====================================================

import VoiceHome from "./components/VoiceHome";

// =====================================================
// AUTHENTICATION
// =====================================================

import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

// =====================================================
// DASHBOARD
// =====================================================

import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import Assistant from "./pages/Assistant";
import AssistantConfiguration from "./pages/AssistantConfiguration";
import Playground from "./pages/Playground";

// =====================================================
// AI CAMPAIGNS
// =====================================================

import Campaigns from "./pages/Campaigns";

// =====================================================
// BOOK A DEMO
// =====================================================

import BookDemo from "./pages/BookDemo";

// =====================================================
// CONTACTS
// =====================================================

import Contacts from "./pages/Contacts";

// =====================================================
// CALL HISTORY
// =====================================================

import CallHistory from "./pages/CallHistory";

// =====================================================
// SETTINGS
// =====================================================

import ProfileSettings from "./pages/Settings/ProfileSettings";
import SetPassword from "./pages/Settings/SetPassword";

import ManualSettings from "./pages/Settings/ManualSettings";


// Billing page will now be opened through Upgrade
import BillingPlage from "./pages/Settings/BillingPage";

import Support from "./pages/Settings/Support";

// =====================================================
// LAYOUT
// =====================================================

import DashboardLayout from "./components/DashboardLayout";

import "./style.css";

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <Routes>

      {/* =====================================================
          LANDING
      ===================================================== */}

      <Route
        path="/"
        element={<VoiceHome />}
      />


      {/* =====================================================
          AUTHENTICATION
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* =====================================================
          DASHBOARD LAYOUT
      ===================================================== */}

      <Route
        path="/dashboard"
        element={<DashboardLayout />}
      >

        {/* =================================================
            DASHBOARD HOME
        ================================================= */}

        <Route
          index
          element={<Dashboard />}
        />


        {/* =================================================
            AI CHAT
        ================================================= */}

        <Route
          path="ai-chat"
          element={<AIChat />}
        />


        {/* =================================================
            AI ASSISTANT
        ================================================= */}

        <Route
          path="ai-assistant"
          element={<Assistant />}
        />


        {/* =================================================
            ASSISTANT CONFIGURATION
        ================================================= */}

        <Route
          path="assistant-configuration"
          element={<AssistantConfiguration />}
        />


        {/* =================================================
            PLAYGROUND
        ================================================= */}

        <Route
          path="playground"
          element={<Playground />}
        />


        {/* =================================================
            AI CAMPAIGNS
        ================================================= */}

        <Route
          path="campaigns"
          element={<Campaigns />}
        />


        {/* =================================================
            BOOK A DEMO
        ================================================= */}

        <Route
          path="demo"
          element={<BookDemo />}
        />


        {/* =================================================
            CONTACTS
        ================================================= */}

        <Route
          path="contacts"
          element={<Contacts />}
        />


        {/* =================================================
            CALL HISTORY
        ================================================= */}

        <Route
          path="call-history"
          element={<CallHistory />}
        />


        {/* =================================================
            UPGRADE
            Opens Billing & Credits page
        ================================================= */}

        <Route
          path="upgrade"
          element={<BillingPlage />}
        />


        {/* =================================================
            SETTINGS
        ================================================= */}

        <Route
          path="settings/profile"
          element={<ProfileSettings />}
        />

        <Route
          path="settings/password"
          element={<SetPassword />}
        />

        <Route
          path="settings/manual"
          element={<ManualSettings />}
        />

        

        <Route
          path="settings/support"
          element={<Support />}
        />

      </Route>


      {/* =====================================================
          UNKNOWN ROUTES
      ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;
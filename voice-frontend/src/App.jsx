import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import VoiceHome from "./components/VoiceHome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AIChat from "./pages/AIChat";
import Assistant from "./pages/Assistant";
import AssistantConfiguration from "./pages/AssistantConfiguration";
import Playground from "./pages/Playground";
import Campaigns from "./pages/Campaigns";
import Contacts from "./pages/Contacts";
import CallHistory from "./pages/CallHistory";
import BookDemo from "./pages/BookDemo";
import ProfileSettings from "./pages/Settings/ProfileSettings";
import SetPassword from "./pages/Settings/SetPassword";
import ManualSettings from "./pages/Settings/ManualSettings";
import BillingPlage from "./pages/Settings/BillingPage";
import Support from "./pages/Settings/Support";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VoiceHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="ai-chat" element={<AIChat />} />
        <Route path="ai-assistant" element={<Assistant />} />
        <Route path="assistant-configuration" element={<AssistantConfiguration />} />
        <Route path="playground" element={<Playground />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="call-history" element={<CallHistory />} />
        <Route path="demo" element={<BookDemo />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="set-password" element={<SetPassword />} />
        <Route path="settings" element={<ManualSettings />} />
        <Route path="upgrade" element={<BillingPlage />} />
        <Route path="support" element={<Support />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

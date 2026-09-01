import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import Marketplace from "./pages/Marketplace";
import VoiceAgent from "./pages/VoiceAgent";
import AgentDashboard from "./pages/AgentDashboard";

import WhatsappAgent from "./components/WhatsappAgent";
import Wapricing from "./pages/WaPricing";
import WhatsappDashboard from "./pages/WhatsappDashboard";

import InstagramAgent from "./pages/InstagramAgent";
import ConnectInstagram from "./components/ConnectInstagram";
import InstaDashboard from "./components/InstaDashboard";

import FacebookAgent from "./pages/FacebookAgent";
import FacebookDashboard from "./components/FacebookDashboard";
import ConnectFacebook from "./components/ConnectFacebook";

import LegalAgent from "./pages/LegalAgent";
import LegalAgentDashboard from "./components/LegalAgentDashboard";

import YourAIAssistant from "./pages/YourAIAssistant";
import YourAIAuth from "./components/YourAIAuth";

import InterviewDashboard from "./pages/InterviewDashboard";


function App() {
  return (
    <Routes>

      {/* Landing Page */}
      <Route
        path="/"
        element={<LandingPage />}
      />
      
      {/* Privacy Policy */}
      <Route
         path="/privacy-policy"
          element={<PrivacyPolicy />}
      />
      {/* Marketplace */}
      <Route
        path="/marketplace"
        element={<Marketplace />}
      />

      {/* Voice Agent */}
      <Route
        path="/voice-agent"
        element={<VoiceAgent />}
      />

      <Route
        path="/voice-agent-dashboard"
        element={<AgentDashboard />}
      />

      {/* WhatsApp Agent */}
      <Route
        path="/whatsapp-ai-agent"
        element={<WhatsappAgent />}
      />

      <Route
        path="/pricing"
        element={<Wapricing />}
      />

      <Route
        path="/whatsapp-ai-agent/whatsapp-agent-dashboard"
        element={<WhatsappDashboard />}
      />

      {/* Instagram Agent */}
      <Route
        path="/instagram-agent"
        element={<InstagramAgent />}
      />

      <Route
        path="/connect-instagram"
        element={<ConnectInstagram />}
      />

      <Route
        path="/instagram-dashboard"
        element={<InstaDashboard />}
      />

      {/* Facebook Agent */}
      <Route
        path="/facebook-agent"
        element={<FacebookAgent />}
      />

      <Route
        path="/facebook-dashboard"
        element={<FacebookDashboard />}
      />

      <Route
        path="/connect-facebook"
        element={<ConnectFacebook />}
      />

      {/* Legal Agent */}
      <Route
        path="/legal-agent"
        element={<LegalAgent />}
      />

      <Route
        path="/legal-agent/dashboard"
        element={<LegalAgentDashboard />}
      />

      {/* Your AI */}
      <Route
        path="/your-ai-assistant"
        element={<YourAIAssistant />}
      />

      <Route
        path="/auth"
        element={<YourAIAuth />}
      />

      {/* Interview */}
      <Route
        path="/interview-dashboard"
        element={<InterviewDashboard />}
      />
         {/*Privacy Policy*/}

    </Routes>
  );
}

export default App;
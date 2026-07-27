import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import FeaturedAgents from "./components/FeaturedAgents";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

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
import LegalAgent from "./pages/LegalAgent"
import LegalAgentDashboard from "./components/LegalAgentDashboard";



function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <FeaturedAgents />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>

      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Marketplace */}
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/voice-agent" element={<VoiceAgent />} />
      <Route path="/voice-agent-dashboard" element={<AgentDashboard />} />
      <Route path="/whatsapp-ai-agent" element={<WhatsappAgent />} />
      <Route path="/pricing" element={<Wapricing />} />
      <Route path="/whatsapp-ai-agent/whatsapp-agent-dashboard" element={<WhatsappDashboard />} />
      <Route path="/instagram-agent" element={<InstagramAgent />} />
      <Route path="/connect-instagram" element={<ConnectInstagram />} />
      <Route path="/instagram-dashboard" element={<InstaDashboard />} />
      <Route path="/facebook-agent" element={<FacebookAgent />} />
      <Route path="/facebook-dashboard" element={<FacebookDashboard />} />
      <Route path="/connect-facebook" element={<ConnectFacebook />} />
      <Route path="/legal-agent" element={<LegalAgent />} />
      <Route path="/legal-agent/dashboard" element={<LegalAgentDashboard />} />





    </Routes>
  );
}

export default App;


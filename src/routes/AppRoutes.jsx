import { Navigate, Route, Routes } from "react-router-dom";

// Each imported agent was originally a standalone React app. Its global
// stylesheet was loaded from its former index.js, so load it once here.
import "../agents/InstagramAgent/style.css";
import "../agents/InterviewAgent/style.css";
import "../agents/WhatsappAgent/style.css";

import LandingPage from "../pages/LandingPage";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Marketplace from "../pages/Marketplace";
import FacebookAgent from "../pages/FacebookAgent";
import LegalAgent from "../pages/LegalAgent";
import LegalAgentDashboard from "../components/LegalAgentDashboard";

import InstagramAgent from "../agents/InstagramAgent/pages/InstagramAgent";
import InstagramSignin from "../agents/InstagramAgent/pages/Signin";
import InstagramSignup from "../agents/InstagramAgent/pages/Signup";
import ConnectInstagram from "../agents/InstagramAgent/components/ConnectInstagram";
import InstagramDashboard from "../agents/InstagramAgent/components/InstaDashboard";

import InterviewHome from "../agents/InterviewAgent/pages/YourAIAssistant";
import InterviewAuth from "../agents/InterviewAgent/components/YourAIAuth";
import InterviewDashboard from "../agents/InterviewAgent/pages/InterviewDashboard";

import WhatsappHome from "../agents/WhatsappAgent/components/WhatsappAgent";
import WhatsappSignin from "../agents/WhatsappAgent/pages/Signin";
import WhatsappSignup from "../agents/WhatsappAgent/pages/Signup";
import WhatsappPricing from "../agents/WhatsappAgent/pages/WaPricing";
import WhatsappDashboard from "../agents/WhatsappAgent/pages/WhatsappDashboard";

import VoiceHome from "../agents/VoiceAgent/components/VoiceHome";
import VoiceLogin from "../agents/VoiceAgent/components/Login";
import VoiceSignup from "../agents/VoiceAgent/components/Signup";
import VoiceForgotPassword from "../agents/VoiceAgent/components/ForgotPassword";
import VoiceResetPassword from "../agents/VoiceAgent/components/ResetPassword";
import VoiceDashboardLayout from "../agents/VoiceAgent/components/DashboardLayout";
import VoiceDashboard from "../agents/VoiceAgent/pages/Dashboard";
import VoiceAIChat from "../agents/VoiceAgent/pages/AIChat";
import VoiceAssistant from "../agents/VoiceAgent/pages/Assistant";
import VoiceAssistantConfiguration from "../agents/VoiceAgent/pages/AssistantConfiguration";
import VoicePlayground from "../agents/VoiceAgent/pages/Playground";
import VoiceCampaigns from "../agents/VoiceAgent/pages/Campaigns";
import VoiceBookDemo from "../agents/VoiceAgent/pages/BookDemo";
import VoiceContacts from "../agents/VoiceAgent/pages/Contacts";
import VoiceCallHistory from "../agents/VoiceAgent/pages/CallHistory";
import VoiceBilling from "../agents/VoiceAgent/pages/Settings/BillingPage";
import VoiceProfileSettings from "../agents/VoiceAgent/pages/Settings/ProfileSettings";
import VoiceSetPassword from "../agents/VoiceAgent/pages/Settings/SetPassword";
import VoiceManualSettings from "../agents/VoiceAgent/pages/Settings/ManualSettings";
import VoiceSupport from "../agents/VoiceAgent/pages/Settings/Support";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/facebook-agent" element={<FacebookAgent />} />
      <Route path="/legal-agent" element={<LegalAgent />} />
      <Route path="/legal-agent/dashboard" element={<LegalAgentDashboard />} />

      <Route path="/voice-agent" element={<Navigate to="/agents/voice" replace />} />
      <Route path="/whatsapp-ai-agent" element={<Navigate to="/agents/whatsapp" replace />} />
      <Route path="/instagram-agent" element={<Navigate to="/agents/instagram" replace />} />
      <Route path="/your-ai-assistant" element={<Navigate to="/agents/interview" replace />} />

      <Route path="/agents/instagram" element={<InstagramAgent />} />
      <Route path="/agents/instagram/connect" element={<ConnectInstagram />} />
      <Route path="/agents/instagram/signin" element={<InstagramSignin />} />
      <Route path="/agents/instagram/signup" element={<InstagramSignup />} />
      <Route path="/agents/instagram/dashboard" element={<InstagramDashboard />} />

      <Route path="/agents/interview" element={<InterviewHome />} />
      <Route path="/agents/interview/auth" element={<InterviewAuth />} />
      <Route path="/agents/interview/dashboard" element={<InterviewDashboard />} />

      <Route path="/agents/whatsapp" element={<WhatsappHome />} />
      <Route path="/agents/whatsapp/signin" element={<WhatsappSignin />} />
      <Route path="/agents/whatsapp/signup" element={<WhatsappSignup />} />
      <Route path="/agents/whatsapp/pricing" element={<WhatsappPricing />} />
      <Route path="/agents/whatsapp/dashboard" element={<WhatsappDashboard />} />

      <Route path="/agents/voice" element={<VoiceHome />} />
      <Route path="/agents/voice/login" element={<VoiceLogin />} />
      <Route path="/agents/voice/signup" element={<VoiceSignup />} />
      <Route path="/agents/voice/forgot-password" element={<VoiceForgotPassword />} />
      <Route path="/agents/voice/reset-password" element={<VoiceResetPassword />} />
      <Route path="/agents/voice/dashboard" element={<VoiceDashboardLayout />}>
        <Route index element={<VoiceDashboard />} />
        <Route path="ai-chat" element={<VoiceAIChat />} />
        <Route path="ai-assistant" element={<VoiceAssistant />} />
        <Route path="assistant-configuration" element={<VoiceAssistantConfiguration />} />
        <Route path="playground" element={<VoicePlayground />} />
        <Route path="campaigns" element={<VoiceCampaigns />} />
        <Route path="demo" element={<VoiceBookDemo />} />
        <Route path="contacts" element={<VoiceContacts />} />
        <Route path="call-history" element={<VoiceCallHistory />} />
        <Route path="upgrade" element={<VoiceBilling />} />
        <Route path="settings/profile" element={<VoiceProfileSettings />} />
        <Route path="settings/password" element={<VoiceSetPassword />} />
        <Route path="settings/manual" element={<VoiceManualSettings />} />
        <Route path="settings/support" element={<VoiceSupport />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;

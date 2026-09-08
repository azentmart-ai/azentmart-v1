import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import WhatsappAgent from "./components/WhatsappAgent";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Wapricing from "./pages/WaPricing";
import WhatsappDashboard from "./pages/WhatsappDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WhatsappAgent />} />
      <Route path="/whatsapp-ai-agent" element={<WhatsappAgent />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Signin />} />
      <Route path="/pricing" element={<Wapricing />} />
      <Route path="/dashboard" element={<WhatsappDashboard />} />
      <Route path="/whatsapp-ai-agent/whatsapp-agent-dashboard" element={<WhatsappDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

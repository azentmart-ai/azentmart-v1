import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import YourAIAssistant from "./pages/YourAIAssistant";
import YourAIAuth from "./components/YourAIAuth";
import InterviewDashboard from "./pages/InterviewDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<YourAIAssistant />} />
      <Route path="/your-ai-assistant" element={<YourAIAssistant />} />
      <Route path="/auth" element={<YourAIAuth />} />
      <Route path="/dashboard" element={<InterviewDashboard />} />
      <Route path="/interview-dashboard" element={<InterviewDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

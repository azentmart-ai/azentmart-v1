import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import InstagramAgent from "./pages/InstagramAgent";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ConnectInstagram from "./components/ConnectInstagram";
import InstaDashboard from "./components/InstaDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<InstagramAgent />} />
      <Route path="/instagram-agent" element={<InstagramAgent />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/instagram-signin" element={<Signin />} />
      <Route path="/instagram-signup" element={<Signup />} />
      <Route path="/connect-instagram" element={<ConnectInstagram />} />
      <Route path="/instagram-dashboard" element={<InstaDashboard />} />
      <Route path="/dashboard" element={<InstaDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Marketplace from "../pages/Marketplace";
import SignIn from "../pages/SignIn";
import CreateAccount from "../pages/CreateAccount";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;

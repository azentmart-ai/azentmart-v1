import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Marketplace from "../pages/Marketplace";
import SignIn from "../pages/SignIn";
import CreateAccount from "../pages/CreateAccount";
import CompanyPage from "../pages/CompanyPage";
import ContentPage from "../pages/ContentPage";
import CategoryPage from "../pages/CategoryPage";
import DemoPage from "../pages/DemoPage";
import ContactPage from "../pages/ContactPage";
import IntegratedWhatsappApp from "../agents/whatsapp/IntegratedWhatsappApp";
import IntegratedInstagramApp from "../agents/instagram/IntegratedInstagramApp";
import IntegratedInterviewApp from "../agents/interview/IntegratedInterviewApp";
import IntegratedVoiceApp from "../agents/voice/IntegratedVoiceApp";

const categories = ["platform", "solutions", "ai-employees", "industries", "business-functions", "why-azentmart", "how-it-works", "resources"];

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/company/contact" element={<ContactPage />} />
      <Route path="/agents/whatsapp/*" element={<IntegratedWhatsappApp />} />
      <Route path="/agents/instagram/*" element={<IntegratedInstagramApp />} />
      <Route path="/agents/interview/*" element={<IntegratedInterviewApp />} />
      <Route path="/agents/voice/*" element={<IntegratedVoiceApp />} />
      <Route path="/company/:section" element={<CompanyPage />} />
      {categories.map((category) => <Route key={category} path={`/${category}`} element={<CategoryPage />} />)}
      {categories.map((category) => <Route key={`${category}-detail`} path={`/${category}/:slug`} element={<ContentPage />} />)}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;

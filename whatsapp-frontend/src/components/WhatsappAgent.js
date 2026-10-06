import React from "react";
import AgentNavbar from "../components/AgentNavbar";
import WhatsAppHero from "./WhatsAppHero";
import SalesFeatureSection from "./SalesFeatureSection";
import AppointmentSection from "./AppointmentSection";
import AutomationFlowSection from "./AutomationFlowSection";
import IntegrationsSection from "./IntegrationNetwork";
import FlexibilitySection from "./FlexibilitySection";
import BenefitsSection from "./BenefitsSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

function WhatsappAgent() {
  return (
    <>
      {/* Navbar at top */}
      <AgentNavbar />
      <WhatsAppHero />
      <SalesFeatureSection />
      <AppointmentSection />
      <AutomationFlowSection />
      <IntegrationsSection />
      <FlexibilitySection />
      <BenefitsSection />
      <CTASection />
      <Footer />

    </>
  );
}

export default WhatsappAgent;
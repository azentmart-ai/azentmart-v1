import React from "react";
import VoiceNavbar from "../components/VoiceNavbar";
import VoiceAgentHero from "../components/VoiceAgentHero";
// import SalesFeatureSection from "./SalesFeatureSection";
import VoiceAgentBooking from "../components/VoiceAgentBooking";
import AutomationFlowSection from "../components/AutomationFlowSection";
import IntegrationsSection from "../components/IntegrationNetwork";
import FlexibilitySection from "../components/FlexibilitySection";
import BenefitsSection from "../components/BenefitsSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

function VoiceAgent() {
  return (
    <>
      {/* Navbar at top */}
      <VoiceNavbar />
      <VoiceAgentHero />
      <VoiceAgentBooking />
      {/* <AppointmentSection /> */}
      <AutomationFlowSection />
      <IntegrationsSection />
      <FlexibilitySection />
      <BenefitsSection />
      <CTASection />
      <Footer />

    </>
  );
}

export default VoiceAgent;
import React from "react";
import "../Style/Instagram.css"

import InstaNavbar from "../components/InstaNavbar";
import InstagramHero from "../components/InstagramHero";
import InstagramDemo from "../components/InstagramDemo";
import HowInstaWorks from "../components/HowInstaWorks";
import InstaFeatures from "../components/InstaFeatures";
import InstaFAQ from "../components/InstaFAQ";
import InstaTestimonials from "../components/InstaTestimonials";
import BenefitsSection from "../components/BenefitsSection";
// import CTASection from "../components/CTASection";
import AgentFooter from "../../../components/AgentFooter";

function InstagramAgent() {
  return (
    <>
      {/* Navbar at top */}
      <InstaNavbar />
      <InstagramHero />
      <InstagramDemo />
      <HowInstaWorks />
      <InstaFeatures />
      <InstaFAQ />
      <BenefitsSection />
      <InstaTestimonials />
     
      <AgentFooter theme="instagram" />

    </>
  );
}

export default InstagramAgent;
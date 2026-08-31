import React from "react";
import "../Style/Facebook.css"

import FBNavbar from "../components/FBNavbar";
import FacebookHero from "../components/FacebookHero";
import FacebookDemo from "../components/FacebookDemo";
import HowFacebookWorks from "../components/HowFacebookWorks";
import FacebookFeatures from "../components/FacebookFeatures";
import FacebookFAQ from "../components/FacebookFAQ";
import FBTestimonials from "../components/FBTestimonials";
// import FlexibilitySection from "../components/FlexibilitySection";
import BenefitsSection from "../components/BenefitsSection";
// import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

function FacebookAgent() {
  return (
    <>
      {/* Navbar at top */}
      <FBNavbar />
      <FacebookHero />
      <FacebookDemo />
      <HowFacebookWorks />
      <FacebookFeatures />
      <FacebookFAQ />
      <BenefitsSection />
      <FBTestimonials />
     
      <Footer />

    </>
  );
}

export default FacebookAgent;
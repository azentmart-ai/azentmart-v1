import React from "react";
import AgentNavbar from "../components/AgentNavbar";
import PricingPage from "../components/PricingPage";
import CustomPricingCTA from "../components/CustomPricingCTA";
import Footer from "../components/Footer";

function Wapricing() {
  return (
    <>
      {/* Navbar at top */}
      <AgentNavbar />
      <PricingPage />
      {/* <Wapricing /> */}
      <CustomPricingCTA />
      <Footer />

    </>
  );
}

export default Wapricing;
import React from "react";
import AgentNavbar from "../components/AgentNavbar";
import PricingPage from "../components/PricingPage";
import CustomPricingCTA from "../components/CustomPricingCTA";
import AgentFooter from "../../../components/AgentFooter";

function Wapricing() {
  return (
    <>
      {/* Navbar at top */}
      <AgentNavbar />
      <PricingPage />
      {/* <Wapricing /> */}
      <CustomPricingCTA />
      <AgentFooter theme="whatsapp" />

    </>
  );
}

export default Wapricing;
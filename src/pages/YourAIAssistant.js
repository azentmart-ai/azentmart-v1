import React from "react";
import "../Style/YourAIAssistant.css";

import YourAINavbar from "../components/YourAINavbar";
import YourAIHero from "../components/YourAIHero";
import YourAIPlatforms from "../components/YourAIPlatforms";
import YourAIFeatures from "../components/YourAIFeatures";
import YourAIHowItWorks from "../components/YourAIHowItWorks";
import YourAIInAction from "../components/YourAIInAction";
import WhyChooseAzentMart from "../components/WhyChooseAzentMart";
// import YouraiTestimonialsSection from "../components/YouraiTestimonialsSection"
import YourAIPricing from "../components/YourAIPricing";
import YourAIFAQ from "../components/YourAIFAQ";
import Footer from "../components/Footer";

const YourAIAssistant = () => {
  return (
    <div className="your-ai-page">
      <YourAINavbar />
      <YourAIHero />
      <YourAIPlatforms />
      <YourAIFeatures />
      {/* <YourAIWhyChooseUs /> */}
      <YourAIHowItWorks />
      <YourAIInAction />
      <WhyChooseAzentMart />
      {/* <YouraiTestimonialsSection /> */}
      <YourAIPricing />
      <YourAIFAQ />
      <Footer />
    </div>
  );
};

export default YourAIAssistant;
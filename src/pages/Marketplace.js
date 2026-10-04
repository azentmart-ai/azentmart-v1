import Navbar from "../components/Navbar";
import MarketplaceHero from "../components/MarketplaceHero";
import MarketplaceAgents from "../components/MarketplaceAgents";
import Footer from "../components/Footer";

function Marketplace(){

  return(
    <>
      <Navbar />
      <MarketplaceHero />
      <MarketplaceAgents />
      <Footer />
    </>
  )
}

export default Marketplace;
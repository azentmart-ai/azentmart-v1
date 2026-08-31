import React from "react";

function IntegrationNetwork() {
  return (
    <section className="integration-network py-5">
      <div className="container text-center">

        {/* HEADING */}
        <h2 className="fw-bold mb-3">
          Integrate with your favorite tools
        </h2>
        <p className="text-muted mb-5">
          Connect your CRM, marketing tools, and platforms seamlessly to automate workflows and scale faster.
        </p>

        {/* NETWORK WRAPPER */}
        <div className="network-wrapper position-relative mx-auto">

          {/* CENTER */}
          <div className="center-node">
            Azentmart
          </div>

          {/* NODES */}
          <div className="node node-top">HubSpot</div>
          <div className="node node-top-right">Zapier</div>
          <div className="node node-right">Shopify</div>
          <div className="node node-bottom-right">Salesforce</div>
          <div className="node node-bottom">Zoho</div>
          <div className="node node-bottom-left">Pabbly</div>
          <div className="node node-left">Facebook</div>
          <div className="node node-top-left">Klaviyo</div>

        </div>

      </div>
    </section>
  );
}

export default IntegrationNetwork;
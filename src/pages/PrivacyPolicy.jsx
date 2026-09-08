import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PrivacyPolicy() {
  return (
    <>
      <Navbar />

      <main className="privacy-page">

        {/* =====================================================
            HEADER
           ===================================================== */}

        <section className="privacy-hero">
          <div className="privacy-container">

            <div className="privacy-badge">
              <span className="privacy-badge-dot"></span>
              LEGAL &amp; PRIVACY
            </div>

            <h1 className="privacy-title">
              Privacy Policy
            </h1>

            <p className="privacy-updated">
              Last Updated: August 28, 2026
            </p>

            <p className="privacy-intro">
              At Azentmart AI, we respect your privacy and are committed to
              protecting the personal information you provide to us.
            </p>

            <p className="privacy-intro">
              This Privacy Policy explains how Azentmart AI (“Azentmart AI,”
              “we,” “us,” or “our”) collects, uses, stores, shares, and protects
              information when you visit our website, create an account, use
              our AI agents, access our marketplace, or otherwise interact with
              our services.
            </p>

            <p className="privacy-intro">
              By using our website or services, you acknowledge that you have
              read and understood this Privacy Policy.
            </p>

          </div>
        </section>


        {/* =====================================================
            PRIVACY POLICY CONTENT
           ===================================================== */}

        <section className="privacy-content">
          <div className="privacy-container">


            {/* =================================================
                1. ABOUT AZENTMART AI
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">01</div>

              <div className="privacy-section-body">
                <h2>About Azentmart AI</h2>

                <p>
                  Azentmart AI is an AI-agent marketplace and platform that
                  enables businesses and individuals to discover, access,
                  deploy, and use AI agents and AI-powered automation solutions.
                </p>

                <p>
                  Our services may include AI agents, automation workflows,
                  software integrations, dashboards, APIs, and other technology
                  services.
                </p>
              </div>
            </article>


            {/* =================================================
                2. INFORMATION WE COLLECT
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">02</div>

              <div className="privacy-section-body">
                <h2>Information We Collect</h2>

                <p>
                  We may collect different categories of information depending
                  on how you interact with Azentmart AI.
                </p>


                <h3>2.1 Information You Provide</h3>

                <p>
                  When you create an account, contact us, purchase a service,
                  or use our platform, we may collect:
                </p>

                <ul>
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Company name</li>
                  <li>Job title</li>
                  <li>Business information</li>
                  <li>Account credentials</li>
                  <li>Billing and transaction information</li>
                  <li>Information provided through contact forms</li>
                  <li>Support requests and communications</li>
                  <li>
                    Information you voluntarily provide while using our
                    services
                  </li>
                </ul>

                <p>
                  We only request information that is reasonably necessary for
                  the relevant purpose.
                </p>


                <h3>2.2 Account Information</h3>

                <p>
                  If you create an Azentmart AI account, we may collect
                  information associated with your account, such as:
                </p>

                <ul>
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Account ID</li>
                  <li>Login information</li>
                  <li>Subscription information</li>
                  <li>Agent usage information</li>
                  <li>Account preferences</li>
                  <li>Organization information</li>
                </ul>


                <h3>2.3 AI Agent and User Input Data</h3>

                <p>
                  When you interact with an AI agent through our platform, you
                  may provide prompts, instructions, documents, files, messages,
                  business information, or other content.
                </p>

                <p>
                  Depending on the particular AI agent or integration you use,
                  this information may be processed to provide the requested
                  service.
                </p>

                <div className="privacy-notice">
                  <strong>Important:</strong>
                  <span>
                    You should not submit sensitive personal information,
                    confidential information, passwords, financial credentials,
                    or other information that you do not want processed unless
                    the relevant service specifically requires it and
                    appropriate safeguards are in place.
                  </span>
                </div>


                <h3>2.4 Automatically Collected Information</h3>

                <p>
                  When you access our website or platform, certain technical
                  information may automatically be collected, including:
                </p>

                <ul>
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device type</li>
                  <li>Operating system</li>
                  <li>Approximate location derived from IP address</li>
                  <li>Pages visited</li>
                  <li>Referring URLs</li>
                  <li>Date and time of access</li>
                  <li>Website interactions</li>
                  <li>Log and diagnostic information</li>
                  <li>Performance and security information</li>
                </ul>

                <p>
                  This information may be used to operate, secure, maintain,
                  and improve our services.
                </p>
              </div>
            </article>


            {/* =================================================
                3. COOKIES
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">03</div>

              <div className="privacy-section-body">
                <h2>Cookies and Similar Technologies</h2>

                <p>
                  Azentmart AI may use cookies, pixels, local storage,
                  analytics technologies, and similar technologies.
                </p>

                <p>We may use these technologies to:</p>

                <ul>
                  <li>Keep users signed in</li>
                  <li>Remember preferences</li>
                  <li>Understand website usage</li>
                  <li>Improve website performance</li>
                  <li>Detect security issues</li>
                  <li>Measure marketing effectiveness</li>
                  <li>Analyze traffic and user behavior</li>
                  <li>Improve our products and services</li>
                </ul>

                <p>
                  Where required by applicable law, we will request consent
                  before using non-essential cookies or similar technologies.
                </p>

                <p>
                  You can manage cookies through your browser settings and,
                  where available, our cookie preference tools.
                </p>
              </div>
            </article>


            {/* =================================================
                4. HOW WE USE INFORMATION
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">04</div>

              <div className="privacy-section-body">
                <h2>How We Use Your Information</h2>

                <p>
                  We may use information we collect for purposes including:
                </p>


                <h3>Providing Services</h3>

                <p>To:</p>

                <ul>
                  <li>Create and manage accounts</li>
                  <li>Provide access to AI agents</li>
                  <li>Process requests and instructions</li>
                  <li>Execute automation workflows</li>
                  <li>Provide customer support</li>
                  <li>Process subscriptions and payments</li>
                  <li>Deliver products and services</li>
                </ul>


                <h3>Improving Our Platform</h3>

                <p>To:</p>

                <ul>
                  <li>Improve our AI agents</li>
                  <li>Improve platform functionality</li>
                  <li>Analyze performance</li>
                  <li>Troubleshoot problems</li>
                  <li>Develop new features</li>
                  <li>Understand user requirements</li>
                  <li>Improve reliability and user experience</li>
                </ul>


                <h3>Security and Fraud Prevention</h3>

                <p>To:</p>

                <ul>
                  <li>Detect unauthorized access</li>
                  <li>Prevent fraud and abuse</li>
                  <li>Protect our systems</li>
                  <li>Monitor suspicious activity</li>
                  <li>Maintain platform security</li>
                  <li>Enforce our Terms of Service</li>
                </ul>


                <h3>Communications</h3>

                <p>We may use your contact information to:</p>

                <ul>
                  <li>Respond to inquiries</li>
                  <li>Send service-related communications</li>
                  <li>Provide account notifications</li>
                  <li>Send security notifications</li>
                  <li>Provide product updates</li>
                  <li>
                    Send marketing communications where permitted by law
                  </li>
                </ul>

                <p>
                  You may unsubscribe from marketing communications at any
                  time.
                </p>


                <h3>Legal and Compliance</h3>

                <p>We may process information when necessary to:</p>

                <ul>
                  <li>Comply with applicable laws</li>
                  <li>Respond to lawful requests</li>
                  <li>Protect our legal rights</li>
                  <li>Prevent fraud or abuse</li>
                  <li>Resolve disputes</li>
                  <li>Enforce our agreements</li>
                </ul>
              </div>
            </article>


            {/* =================================================
                5. AI AND THIRD-PARTY PROVIDERS
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">05</div>

              <div className="privacy-section-body">
                <h2>AI and Third-Party AI Providers</h2>

                <p>
                  Azentmart AI may use third-party artificial intelligence and
                  technology providers to provide certain services.
                </p>

                <p>
                  Depending on the AI agent or service you use, information may
                  be processed by third-party providers such as:
                </p>

                <ul>
                  <li>Large language model providers</li>
                  <li>Cloud infrastructure providers</li>
                  <li>Database providers</li>
                  <li>Analytics providers</li>
                  <li>Authentication providers</li>
                  <li>Payment providers</li>
                  <li>Communication providers</li>
                  <li>Automation and integration providers</li>
                </ul>

                <p>
                  The specific providers involved may vary depending on the AI
                  agent or service.
                </p>

                <p>
                  Where applicable, third-party providers may process
                  information only for the purposes necessary to provide their
                  services to us or to you.
                </p>

                <p>
                  We encourage users to review the privacy policies of
                  third-party services they choose to connect to Azentmart AI.
                </p>
              </div>
            </article>


            {/* =================================================
                6. AI AGENT DATA
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">06</div>

              <div className="privacy-section-body">
                <h2>AI Agent Data</h2>

                <p>
                  Azentmart AI is designed to enable users to interact with AI
                  agents and automation systems.
                </p>

                <p>Depending on the agent, your information may be:</p>

                <ul>
                  <li>Sent to an AI model for processing</li>
                  <li>Stored temporarily or persistently</li>
                  <li>Used to maintain conversation context</li>
                  <li>Used to execute requested workflows</li>
                  <li>Transferred to connected third-party services</li>
                  <li>Processed through APIs or integrations</li>
                </ul>

                <p>
                  Different AI agents may have different data-processing
                  practices.
                </p>

                <p>
                  Before using an AI agent, users should review the applicable
                  agent description, terms, and privacy information where
                  provided.
                </p>
              </div>
            </article>


            {/* =================================================
                7. SHARING
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">07</div>

              <div className="privacy-section-body">
                <h2>How We Share Information</h2>

                <p>
                  We do not sell your personal information as a standalone
                  product.
                </p>

                <p>
                  We may share information with trusted third parties when
                  reasonably necessary to operate our business and provide our
                  services.
                </p>

                <p>These parties may include:</p>

                <ul>
                  <li>Cloud hosting providers</li>
                  <li>AI model providers</li>
                  <li>Payment processors</li>
                  <li>Authentication providers</li>
                  <li>Analytics providers</li>
                  <li>Customer-support providers</li>
                  <li>Communication providers</li>
                  <li>Security providers</li>
                  <li>Professional advisors</li>
                  <li>Business partners</li>
                  <li>Service providers working on our behalf</li>
                </ul>

                <p>We may also disclose information:</p>

                <ul>
                  <li>When required by law</li>
                  <li>In response to valid legal requests</li>
                  <li>To protect our rights, users, or property</li>
                  <li>To investigate fraud or security incidents</li>
                  <li>
                    During a merger, acquisition, financing, restructuring, or
                    sale of assets
                  </li>
                </ul>

                <p>
                  Third parties receiving information may be subject to
                  contractual, legal, or organizational obligations regarding
                  its protection.
                </p>
              </div>
            </article>


            {/* =================================================
                8. BUSINESS DATA
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">08</div>

              <div className="privacy-section-body">
                <h2>Your Business Data</h2>

                <p>
                  If you use Azentmart AI for business purposes, you may provide
                  business documents, customer information, internal
                  information, or other organizational data to an AI agent.
                </p>

                <p>
                  You are responsible for ensuring that you have the appropriate
                  rights and permissions to provide such information to
                  Azentmart AI and to any connected services.
                </p>

                <p>
                  You should not provide personal information belonging to
                  another individual unless you have an appropriate legal basis
                  or authorization to do so.
                </p>
              </div>
            </article>


            {/* =================================================
                9. SECURITY
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">09</div>

              <div className="privacy-section-body">
                <h2>Data Security</h2>

                <p>
                  We use reasonable technical and organizational measures
                  designed to protect information against:
                </p>

                <ul>
                  <li>Unauthorized access</li>
                  <li>Unauthorized disclosure</li>
                  <li>Accidental loss</li>
                  <li>Destruction</li>
                  <li>Alteration</li>
                  <li>Misuse</li>
                </ul>

                <p>
                  Security measures may include access controls,
                  authentication mechanisms, encryption where appropriate,
                  monitoring, logging, backups, and other safeguards.
                </p>

                <p>
                  However, no internet-based service can guarantee absolute
                  security.
                </p>

                <p>
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for notifying us if you believe
                  your account has been compromised.
                </p>
              </div>
            </article>


            {/* =================================================
                10. RETENTION
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">10</div>

              <div className="privacy-section-body">
                <h2>Data Retention</h2>

                <p>
                  We retain personal information only for as long as reasonably
                  necessary for the purposes described in this Privacy Policy,
                  including:
                </p>

                <ul>
                  <li>Providing our services</li>
                  <li>Maintaining business records</li>
                  <li>Meeting legal obligations</li>
                  <li>Resolving disputes</li>
                  <li>Preventing fraud</li>
                  <li>Enforcing agreements</li>
                  <li>Maintaining security</li>
                </ul>

                <p>
                  Retention periods may vary depending on the type of
                  information and the purpose for which it was collected.
                </p>

                <p>
                  When information is no longer required, we may delete,
                  anonymize, or securely dispose of it, subject to applicable
                  legal and operational requirements.
                </p>
              </div>
            </article>


            {/* =================================================
                11. INTERNATIONAL TRANSFERS
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">11</div>

              <div className="privacy-section-body">
                <h2>International Data Transfers</h2>

                <p>
                  Azentmart AI may use service providers located in countries
                  other than the country in which you reside.
                </p>

                <p>
                  As a result, your information may be processed or stored
                  internationally.
                </p>

                <p>
                  Where applicable, we will take reasonable measures to ensure
                  that international transfers of personal information are
                  conducted in accordance with applicable data protection laws.
                </p>
              </div>
            </article>


            {/* =================================================
                12. PRIVACY RIGHTS
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">12</div>

              <div className="privacy-section-body">
                <h2>Your Privacy Rights</h2>

                <p>
                  Depending on your location and applicable law, you may have
                  rights regarding your personal information.
                </p>

                <p>These may include the right to:</p>

                <ul>
                  <li>Request access to your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of personal information</li>
                  <li>Request restriction of certain processing</li>
                  <li>Object to certain processing</li>
                  <li>
                    Withdraw consent where processing is based on consent
                  </li>
                  <li>Request a copy of certain personal information</li>
                  <li>Opt out of marketing communications</li>
                  <li>
                    Request information about how your data is processed
                  </li>
                </ul>

                <p>
                  Certain rights may be subject to legal limitations or
                  exceptions.
                </p>

                <p>
                  To exercise your rights, contact us using the information
                  provided below.
                </p>
              </div>
            </article>


            {/* =================================================
                13. MARKETING
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">13</div>

              <div className="privacy-section-body">
                <h2>Marketing Communications</h2>

                <p>
                  We may occasionally send information about:
                </p>

                <ul>
                  <li>Azentmart AI products</li>
                  <li>AI agents</li>
                  <li>New features</li>
                  <li>Offers</li>
                  <li>Events</li>
                  <li>Educational content</li>
                  <li>Business updates</li>
                </ul>

                <p>
                  Where required, we will obtain appropriate consent.
                </p>

                <p>
                  You can unsubscribe from marketing emails by using the
                  unsubscribe option included in the communication or by
                  contacting us.
                </p>

                <p>
                  Service-related communications may still be sent when
                  necessary to operate your account or provide requested
                  services.
                </p>
              </div>
            </article>


            {/* =================================================
                14. CHILDREN
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">14</div>

              <div className="privacy-section-body">
                <h2>Children's Privacy</h2>

                <p>
                  Our services are not intended for children who are below the
                  minimum age required to use online services under applicable
                  law.
                </p>

                <p>
                  We do not knowingly collect personal information from
                  children in violation of applicable laws.
                </p>

                <p>
                  If you believe that a child has provided personal information
                  to us improperly, please contact us so that we can investigate
                  and take appropriate action.
                </p>
              </div>
            </article>


            {/* =================================================
                15. THIRD-PARTY LINKS
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">15</div>

              <div className="privacy-section-body">
                <h2>Third-Party Links and Services</h2>

                <p>
                  Our website or AI agents may contain links to third-party
                  websites, applications, APIs, or services.
                </p>

                <p>
                  We are not responsible for the privacy practices, security,
                  or content of third-party services.
                </p>

                <p>
                  We recommend reviewing the privacy policies of third-party
                  services before providing them with personal information.
                </p>
              </div>
            </article>


            {/* =================================================
                16. PAYMENTS
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">16</div>

              <div className="privacy-section-body">
                <h2>Payments</h2>

                <p>
                  Payments may be processed through third-party payment
                  providers.
                </p>

                <p>
                  Azentmart AI may receive limited transaction information
                  necessary to confirm and manage payments, such as transaction
                  status, subscription information, or payment reference
                  information.
                </p>

                <p>
                  We generally do not need to store your complete payment card
                  details when those details are processed directly by our
                  payment provider.
                </p>

                <p>
                  Payment providers may have their own privacy policies and
                  terms.
                </p>
              </div>
            </article>


            {/* =================================================
                17. SECURITY INCIDENTS
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">17</div>

              <div className="privacy-section-body">
                <h2>Data Breaches and Security Incidents</h2>

                <p>
                  If we become aware of a security incident involving personal
                  information, we will assess the incident and take reasonable
                  steps to contain, investigate, and remediate it.
                </p>

                <p>
                  Where required by applicable law, we will provide
                  notifications to affected individuals and/or relevant
                  authorities.
                </p>
              </div>
            </article>


            {/* =================================================
                18. CHANGES
               ================================================= */}

            <article className="privacy-section">
              <div className="privacy-section-number">18</div>

              <div className="privacy-section-body">
                <h2>Changes to This Privacy Policy</h2>

                <p>
                  We may update this Privacy Policy from time to time.
                </p>

                <p>
                  When we make changes, we will update the “Last Updated” date
                  at the top of this page.
                </p>

                <p>
                  If we make material changes, we may provide additional notice
                  where required by applicable law.
                </p>

                <p>
                  We encourage you to review this Privacy Policy periodically.
                </p>
              </div>
            </article>


            {/* =================================================
                19. CONTACT
               ================================================= */}

            <article className="privacy-section privacy-contact-section">
              <div className="privacy-section-number">19</div>

              <div className="privacy-section-body">
                <h2>Contact Us</h2>

                <p>
                  If you have questions about this Privacy Policy, want to
                  exercise your privacy rights, or have concerns about how your
                  information is handled, please contact us.
                </p>

                <div className="privacy-contact-card">

                  <div className="privacy-contact-row">
                    <span>Azentmart AI</span>
                  </div>

                  <div className="privacy-contact-row">
                    <span>Website</span>
                    <a
                      href="https://azentmart.ai"
                      target="_blank"
                      rel="noreferrer"
                    >
                      https://azentmart.ai
                    </a>
                  </div>

                  <div className="privacy-contact-row">
                    <span>Privacy Contact Email</span>
                    <a href="mailto:privacy@azentmart.ai">
                      privacy@azentmart.ai
                    </a>
                  </div>

                  <div className="privacy-contact-row">
                    <span>General Contact Email</span>
                    <span>[your official company email]</span>
                  </div>

                  <div className="privacy-contact-row">
                    <span>Registered Company Name</span>
                    <span>[Insert legal entity name]</span>
                  </div>

                  <div className="privacy-contact-row">
                    <span>Registered Address</span>
                    <span>[Insert registered business address]</span>
                  </div>

                  <div className="privacy-contact-row">
                    <span>Country</span>
                    <span>India</span>
                  </div>

                </div>
              </div>
            </article>


            {/* =================================================
                20. CONSENT
               ================================================= */}

            <article className="privacy-section privacy-final-section">
              <div className="privacy-section-number">20</div>

              <div className="privacy-section-body">
                <h2>Consent and Acknowledgement</h2>

                <p>
                  By using Azentmart AI's website and services, you acknowledge
                  that you have read this Privacy Policy.
                </p>

                <p>
                  Where applicable law requires consent for specific processing
                  activities, we will request that consent separately.
                </p>

                <p>
                  You may withdraw consent where permitted by applicable law
                  and where processing is based on consent.
                </p>
              </div>
            </article>


            {/* =================================================
                BACK TO HOME
               ================================================= */}

            <div className="privacy-back">
              <Link to="/">
                ← Back to Azentmart AI
              </Link>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default PrivacyPolicy;
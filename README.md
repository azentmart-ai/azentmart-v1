# AzentMart AI — Final Agents

## Current update

This version keeps the existing AzentMart AI visual language and turns the website navigation into a complete page-based experience.

### Navigation

Platform → Solutions → AI Employees → Company → Resources → Agents

### Dedicated pages added

- Platform: AI Workforce, How It Works, Agent Marketplace, Trust & Control
- Solutions: Industry Solutions, Automate Repetitive Work, Customer & Revenue, Operations, Human + AI, Custom Workflows
- AI Employees: Sales, Marketing, Customer Support, HR & Recruitment, Finance, Legal, Operations, plus the 10,000+ catalog vision page
- Industries: Healthcare, Retail & E-commerce, Manufacturing, Real Estate, Hospitality & Food, Education, Finance & BFSI, Legal, IT & SaaS, Logistics & Supply Chain, Travel & Tourism
- Business Functions: Sales, Marketing, Customer Support, HR & Recruitment, Finance, Legal, Operations
- Resources: Learning
- Company: About, Leadership, Culture, Careers, Contact
- Demo request page
- Existing Agent Marketplace and four agent applications

### Landing-page actions

Landing-page cards and primary calls-to-action now lead to dedicated routes instead of inactive section-only anchors. Industry cards, business-function cards, AI employee cards, workflow steps, Why AzentMart cards, demo CTAs and contact CTAs all have destinations.

### Development

```bash
npm install
npm start
```

Build the main application:

```bash
npm run build:main
```

Build the single main application for deployment:

```bash
npm run build
```

The original four agent application folders remain in the repository as source backups. The deployed/local main application integrates the four agent experiences under the same React Router host. Agent landing navigation keeps its existing agent-specific structure, while the approved AzentMart logo and shared footer branding are used consistently.

## Integrated local and production routing

The main AzentMart application is the single host for the landing site and all four agent experiences.

- Local development: `http://localhost:3001`
- WhatsApp Agent: `/agents/whatsapp`
- Instagram Agent: `/agents/instagram`
- Interview Agent: `/agents/interview`
- Voice Agent: `/agents/voice`

Run the main project with `npm start`. The separate agent folders are retained as source backups, but the main build integrates their routes into the single application.

For production SPA hosting, configure the host to rewrite unknown application routes to `index.html`. `_redirects`, `web.config`, and a `404.html` fallback are included for common static-hosting setups.

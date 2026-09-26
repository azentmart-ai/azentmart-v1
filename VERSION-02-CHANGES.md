# AzentMart AI — Version 02

## Scope
This package updates the main AzentMart landing website only. The four existing agent applications were preserved unchanged.

## Main landing updates
- Navbar order: Platform → Solutions → AI Employees → Company → Sign in → Get a demo
- Removed Why AzentMart from the navbar; kept it as a landing-page section.
- Added Company dropdown: About AzentMart, Leadership Team, Culture, Careers, Contact Us.
- Added Company routes under `/company/:section`.
- Added Platform mega-menu with AI Workforce, How It Works, Marketplace, Trust & Control, Industries and Business Functions.
- Updated Solutions and AI Employees menus.
- Replaced the Hero chatbot/workspace visual with a five-card AI workforce deck animation.
- Deck rotates horizontally right-to-left by changing card positions; the active card remains prominent and cycles approximately every 3.2 seconds.
- Hero uses the boss-provided 10,000+ AI employee positioning.
- Updated industry domains to the supplied list: Healthcare; Retail & E-commerce; Manufacturing; Real Estate; Hospitality & Food; Education; Finance & BFSI; Legal; IT & SaaS; Logistics & Supply Chain; Travel & Tourism.
- Expanded AI workforce presentation with Sales, Marketing, Customer Support, HR & Recruitment and Finance cards, plus Legal, Operations and thousands more.
- Added/updated Trust, Problem, Solution, How It Works, Why AzentMart, Results, Pricing, FAQ and Final CTA presentation.
- Updated footer navigation for the new Company structure.

## Protected
The following folders were not modified:
- `instagram-frontend/`
- `interview-frontend/`
- `whatsapp-frontend/`
- `voice-frontend/`

## Local use
Run `npm install` and `npm start` from the project root. Production build/deployment is intentionally not part of this version.

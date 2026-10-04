# AZ Project 03 — Update 06

## Included updates

### Main website
- Updated the landing-page right-side navbar spacing so **Sign in** and **Get a demo** sit slightly farther right without changing the overall navigation structure.
- Updated hero CTA hierarchy so **Explore AI employees** is the secondary action and **Get a demo** is the larger highlighted primary action.
- Kept the two hero CTAs aligned on the same row/baseline and added responsive stacking for small screens.
- Applied the same CTA hierarchy to the AI Employees content hero.
- Kept the existing animated workflow/dotted-direction section already present in the landing page.
- Expanded the Company section content for About AzentMart, Leadership Team, Culture and Careers. Contact Us remains the existing Kore.ai-inspired contact form.

### Voice Agent replacement
- Replaced the previous integrated Voice Agent source with the Voice Agent supplied in `frontend.zip`.
- Kept the Voice Agent inside the main AzentMart application at `/agents/voice`.
- Added the missing integration wrapper required by the main router.
- Kept the new Voice Agent's own navigation structure and dark/purple theme.
- Updated internal Voice Agent routes so authentication/dashboard navigation stays under `/agents/voice` rather than escaping to the main site's root routes.
- Replaced the Voice Agent's standalone footer with the shared AzentMart footer structure, using the Voice theme.
- Replaced the Voice Agent's old text/letter brand mark with the exact approved AzentMart logo asset used by the main landing page.
- Voice Agent functionality/source was otherwise preserved from the supplied frontend.

### Agent preservation
- WhatsApp, Instagram and Interview agent source was not replaced.
- Existing main-site routes, shared footer, company/contact routing and other important project areas were preserved.
- The four agents remain accessible from the single main application and do not require separate local development servers.

## Validation
- Relative import/path validation: 0 missing relative imports after integration.
- Production build could not be executed in this environment because the npm dependency installation timed out and the resulting local dependency tree did not contain `react-scripts`. No successful build is claimed.

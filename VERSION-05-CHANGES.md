# Version 05 — Agent Branding & Shared Footer

Implemented after START.

## Agent branding
- All four integrated agents use the exact approved AzentMart landing-page logo asset (`src/assets/azentmart-logo.png`).
- Agent landing navigation structures remain agent-specific rather than copying the main landing navbar.
- Agent logos link to the main AzentMart landing page.
- Existing agent navigation functions/routes are preserved.

## Shared footer
- All agent landing pages now use the same AzentMart footer structure/content as the main landing page.
- Footer styling is adapted to each agent's existing visual theme rather than forcing the main-site theme onto the agents.
- Footer links continue to use the main application's routes.

## Voice agent
- Replaced the voice landing-page's custom footer with the shared AzentMart footer.
- Replaced the voice landing-page brand mark with the approved full AzentMart logo.
- Voice agent navigation remains its existing section-based navigation.

## Single application architecture
- The four agents remain integrated under the main React Router application and continue to use `localhost:3001`.
- Existing agent routes and source functionality are retained.

## Validation
- Static local-import/path validation completed with no missing relative imports in `src`.
- A production build could not be completed in this environment because npm dependency installation could not finish due to registry/network timeout; no claim of a successful production build is made.

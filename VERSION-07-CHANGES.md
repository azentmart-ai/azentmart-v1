# AZ Project 04 — Update Notes

## Main website
- Restored the main AzentMart navigation to a three-zone layout: logo left, six navigation groups centered, Sign in/Get a demo right.
- Kept the existing dropdown content and navigation functions.
- Moved the primary hero CTA ahead of Explore AI employees and made Get a demo visually larger.
- Applied the same CTA hierarchy to AI Employee content pages.
- Replaced the main-site Manrope/mono-style typography treatment with a readable DM Sans system while leaving individual agent themes independent.
- Added an animated workflow explainer with moving dotted directional paths.
- Expanded Company pages with real explanatory content for About, Leadership, Culture and Careers without inventing leadership identities or credentials.
- Kept the existing contact workflow/form and styled it closer to the supplied Kore.ai reference: warm page background, dark form panel and readable fields.
- Updated the main project development proxy to localhost:3001; the project already uses integrated agent routes so agent pages remain under the same main origin.

## Agents
- Applied the supplied exact AzentMart AI logo asset to the shared/main asset and agent-local logo copies.
- Preserved existing agent-specific navigation structures and functions rather than duplicating the landing navbar.
- Updated the Voice Agent landing header to use the exact logo and the supplied light navigation reference while preserving Home/Solutions/How It Works/Features/Industries/Sign up/Login behavior.
- Improved Voice Agent CTA/footer alignment and retained the floating Talk to AI control.
- Did not intentionally alter agent business logic or dashboard functions.

## Validation
- Parsed all edited JSX/JS files successfully with Babel parser.
- A full production build could not be completed in this environment because the provided project archive does not contain all npm dependencies and external npm registry access was unavailable. No temporary dependency stubs are included in the final ZIP.

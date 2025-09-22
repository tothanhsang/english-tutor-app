# English Q&A Tutor – Figma-first workflow

This project is scaffolded with Next.js (App Router), Tailwind CSS, Playwright, and a Figma-first design process.

## Figma as Single Source of Truth

1. Create a Figma file
   - Pages: `Sitemap & Flows`, `Wireframes`, `UI Kit`, `Hi-Fi Screens`.
   - Enable Auto Layout everywhere. Use Variables for color, spacing, typography.

2. Recommended plugins
   - Relume AI – generate sitemap/wireframes from prompts.
   - Diagram Genius or Magician – generate layouts/components.
   - Tokens Studio (optional) – manage/export design tokens.

3. Prompt template (paste into Figma plugin prompt)
   - See `spec.md`. Use sections: IA & Pages, Design Guidelines, Acceptance Criteria.

4. Design tokens → Code
   - Export variables/tokens → map to Tailwind (`tailwind.config.js`) + CSS variables.
   - Components should map to shadcn/ui primitives (Button, Card, Tabs, Dialog).

## App routes (placeholders)
- `/` Landing
- `/auth/sign-in`
- `/onboarding`
- `/dashboard`
- `/lesson`
- `/question-bank`
- `/progress`
- `/settings`

These pages are placeholders; replace markup according to Figma.

## Development
- Start dev: `npm run dev`
- Lint: `npm run lint`

## Testing
- E2E (Playwright): `npm run test:e2e`
- Update playwright.config if the port or dev command changes.

## Next steps
- Build Figma wireframes/hi-fi using `spec.md`.
- Export tokens → Tailwind.
- Integrate shadcn/ui for consistent components.
- Replace placeholder pages with Figma-accurate components.

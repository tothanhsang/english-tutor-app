# Figma-first workflow: prompts and setup

Use this guide to create your Figma file as the single source of truth and drive UI → code.

## Create the Figma file

1) Create a new Figma design file
- Pages:
  - `Sitemap & Flows`
  - `Wireframes`
  - `UI Kit`
  - `Hi-Fi Screens`

2) Enable Auto Layout
- All frames and components should use Auto Layout with consistent spacing.

3) Create Variables
- Collections: `Color`, `Spacing`, `Typography`.
- Map tokens to the values in `spec.md`:
  - Color: primary `#2563EB`, accent `#F59E0B`, foreground, background, muted.
  - Spacing scale: 4, 8, 12, 16, 24, 32...
  - Typography: Inter for headings, system sans for body.

4) Components (UI Kit)
- Button (primary, accent, ghost)
- Card
- Input + Label + Helper text
- Tabs
- Dialog/Modal
- Toast

## Prompts to generate wireframes

Paste into Relume AI / Diagram plugin prompt:

```
Build a sitemap and wireframes for "English Q&A Tutor" with the following pages:
- Landing (hero, features x3, CTA)
- Auth (sign in, sign up)
- Onboarding (select level A1–B2, goals, schedule)
- Dashboard (progress summary, recommended lessons as cards)
- Lesson Player (chat layout for Q&A, prompt suggestions, hints, submit answer)
- Question Bank (search, filter by topic/level, list, pagination)
- Progress (weekly and monthly charts)
- Settings (profile, notifications, language)
Design guidelines:
- Brand: clean, friendly, educational
- Colors: primary #2563EB, accent #F59E0B, neutral grays
- Typography: Inter for headings, Sans for body
- Accessibility: WCAG AA, focus visible, color contrast
Constraints:
- Use Auto Layout and Variables for colors/spacing/typography
- Components should be reusable with variants
```

## From Figma → Code

- Use Tokens Studio (optional) or Figma Variables export to capture:
  - `--primary`, `--accent`, `--foreground`, `--background`, `--muted`.
- Update `src/app/globals.css` variables to match exported values.
- Ensure spacing and typography scale match Tailwind config. This project uses Tailwind v4 with `@theme inline`. If your linter flags `@theme` unknown, you can ignore it or configure your CSS linter for Tailwind v4.

## Mapping components

- Buttons → `src/components/Button.tsx` variants: `primary`, `accent`, `ghost`.
- Replace placeholder pages under `src/app/.../page.tsx` with real markup matching Figma.

## Acceptance criteria → tests

Translate the Acceptance Criteria in `spec.md` into:
- Playwright E2E (flows: login, onboarding, start lesson, chat submit, progress increment)
- Vitest + RTL for components (Button, Card, LessonCard)
- a11y: use `@testing-library/jest-dom` and consider `axe` for unit-level checks
- Performance: Lighthouse CI for Landing

## When design changes

- Update Figma Variables → export → update CSS variables in `globals.css`.
- Regenerate code from Locofy/Anima if you use plugin export, or manually update components/pages to match Figma.

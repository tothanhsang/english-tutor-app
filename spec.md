# Product Brief
- Name: English Q&A Tutor
- Goal: Học tiếng Anh bằng hỏi-đáp theo chủ đề, theo dõi tiến độ.
- Target users: Beginner–Intermediate learners.

# IA & Pages
- Landing: hero, features(3), CTA
- Auth: sign in, sign up
- Onboarding: select level(A1–B2), goals, schedule
- Dashboard: progress summary, recommended lessons (cards)
- Lesson Player: Q&A panel (chat layout), prompt suggestions, hints, submit answer
- Question Bank: search, filters (topic/level), list, pagination
- Progress: charts (weekly, monthly), streaks
- Settings: profile, notifications, language
- Admin (optional): content CRUD

# Design Guidelines
- Brand keywords: clean, friendly, educational
- Color palette: primary #2563EB, accent #F59E0B, gray scale neutral
- Typography: Inter (heading), Sans (body)
- Components: navbar, sidebar, card, button, input, tabs, modal, toast
- Spacing scale: 4px base, 8/12/16/24/32…
- Breakpoints: mobile-first, sm 640px, md 768px, lg 1024px, xl 1280px
- Accessibility: WCAG AA, focus visible, color contrast

# Data & States
- User: level, goals, schedule
- Lesson: id, title, topic, level, content blocks (question, hint, example)
- Progress: completed lessons, scores, streak
- Chat: messages[], roles(user/assistant), attachments (audio/text)

# User Flows
- New user → onboarding → dashboard → start lesson → Q&A → submit → feedback → progress increment
- Returning user → dashboard → continue lesson
- Search in Question Bank → open lesson

# Acceptance Criteria (UI/UX)
- Navbar: sticky, keyboard navigable
- Lesson Player: chat layout, submit by Enter, loading state, error state
- Cards: responsive 2/3/4 columns (sm/md/lg)
- Charts: shows weekly and monthly stats

# Design-to-Code Constraints
- Use Figma Auto Layout and Variables for color/space/typography
- Export design tokens → Tailwind config
- Map to shadcn/ui where phù hợp (Button, Card, Tabs, Dialog)

# Test Plan (E2E + Unit)
- E2E: login, onboarding, start lesson, send/receive message, check progress increment
- Unit: components Button, Card, LessonCard; utils scoreCalc
- A11y: all interactive elements focusable; contrast > 4.5:1
- Performance: Lighthouse Performance > 90 on Landing

# Deliverables
- Figma file: sitemap + wireframes + hi-fi screens (key pages)
- Code: Next.js 14, Tailwind, shadcn/ui
- Tests: Playwright, Jest/RTL, Storybook + a11y
- CI: Playwright, Lighthouse CI

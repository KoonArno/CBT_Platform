# Thera — CBT Supervision Platform

Next.js 15 (App Router) + TypeScript + TailwindCSS scaffold for an AI-augmented CBT supervision platform built around the **Cognitive Therapy Scale – Revised (CTS-R)**.

This scaffold combines two role-based portals (no authentication in this prototype):

- **Supervisor portal** (`/supervisor/*`) — score sessions, validate AI ratings, track caseload, generate reports
- **Therapist portal** (`/therapist/*`) — view CTS-R progress, complete self-reviews, prepare for supervision, practise skills

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000 → choose a role → explore.

## Folder structure

```
app/
  layout.tsx                 # Root layout · loads Outfit font + global styles
  page.tsx                   # Landing / role selector
  globals.css                # Tailwind directives + base styles
  supervisor/
    layout.tsx               # Sidebar + nav for supervisor role
    dashboard/page.tsx       # KPIs · pending validations · therapists
    therapists/page.tsx      # Caseload management
    session/page.tsx         # New session config + transcript paste
    scoring/page.tsx         # CTS-R 12-item scoring + AI validation
    tapescript/page.tsx      # Audio player + diarized transcript + annotations
    progress/page.tsx        # Trajectory · radar · feedback timeline
    reports/page.tsx         # Printable A4-style report
    metalogs/page.tsx        # AI reliability · Cohen's κ · token logs
    skills/page.tsx          # 4 AI exercises · assignable to therapists
  therapist/
    layout.tsx               # Sidebar + nav for therapist role
    home/page.tsx            # Hero · upcoming supervision · feedback preview
    sessions/page.tsx        # CTS-R history · supervisor vs self per item
    feedback/page.tsx        # Filterable strengths / development / goals / peer
    progress/page.tsx        # Progress chart · radar · 12-item breakdown
    self-review/page.tsx     # 12 items × 7-point self rating + 7 reflections
    prep/page.tsx            # Pre-supervision checklist + questions
    skills/page.tsx          # Assigned exercises · explore lab
    journal/page.tsx         # Mood-tagged reflective journal

components/
  ui/                        # Generic primitives (Button, Card, Pill, Input, ...)
  cts-r/                     # Domain components (CTSRScoreCard, RubricModal, AudioPlayer)
  charts/                    # Recharts wrappers (ProgressLineChart, CompetencyRadar)
  layout/                    # AppShell, Sidebar

lib/
  cts-r.ts                   # 12 items, rubrics, score colors / labels
  cbt-segments.ts            # Standard 9-phase CBT session structure
  mock-data.ts               # Therapists, feedback, sessions, etc.
  types.ts                   # TypeScript types
  utils.ts                   # cn(), date helpers, kappa interpretation
```

## Design tokens (Tailwind extended in `tailwind.config.ts`)

- **Brand:** `#3B75E8` (blue) · accent `#E8923A` (orange)
- **Ink:** heading `#1A2340` · muted `#6B7A9A` · faint `#9BABC4`
- **State:** good · warn · bad · purple
- **Font:** Outfit (Google) via `next/font`

## Key patterns

- **Server Components by default**; `"use client"` only where state/interaction is needed (scoring, tapescript, self-review, journal, skills, sessions, feedback)
- **Static data hoisted** to `lib/*` modules (Vercel best practice: `server-hoist-static-io`)
- **Recharts** lazy-loaded inside client components (`/charts/*`)
- **No barrel imports** — direct imports throughout (`bundle-barrel-imports`)
- **Inline component definitions avoided** (`rerender-no-inline-components`)

## What's not in scope (future work)

- Authentication / RBAC
- Backend API routes / persistence (currently in-memory state only)
- Whisper / ASR integration for audio
- Real Anthropic API wiring (UI is scaffolded, but no API calls)
- Peer-review submission flow
- i18n / Thai localisation

## Scripts

| Command            | Purpose              |
| ------------------ | -------------------- |
| `npm run dev`      | Dev server (Turbopack) |
| `npm run build`    | Production build     |
| `npm start`        | Run production build |
| `npm run typecheck`| `tsc --noEmit`       |
| `npm run lint`     | Next ESLint          |

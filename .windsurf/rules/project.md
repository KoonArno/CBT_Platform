---
trigger: always_on
description: Thera — Supervisor-only CTS-R review platform (migrating to cts-r-insight design system)
---

# Thera — Project Rules (Supervisor-only)

## Scope & Pivot
- **Single-role app**: **Supervisor only**. The therapist/trainee side has been removed.
- **No authentication**, no role switcher, no landing page role selector.
- App entry `/` goes directly to the supervisor workflow (Upload / Home).
- Reference design system & UX is `c:\Users\Nattakarn\Desktop\cbt\cts-r-insight` ("CBT Supinsight"). All supervisor pages should be migrated to match its look-and-feel.

## Domain
- AI-assisted **CTS-R** (Cognitive Therapy Scale – Revised) review of CBT session transcripts.
- 12 items × 0–6 = max 72. Items have category (Structure / Technique / Relationship) and a per-item color token (`cts-1` … `cts-12`).
- AI proposes scores + evidence; supervisor validates, edits, and signs off. Reliability: Cohen's kappa.

## Supervisor Workflow (6 steps)
Mirrors `cts-r-insight` `WorkflowStepper`:

| # | Route          | Label           | Purpose |
|---|----------------|-----------------|---------|
| 1 | `/`            | Upload          | Upload DOCX transcript / start session |
| 2 | `/review`      | Review Evidence | Read transcript, highlight evidence per CTS-R item |
| 3 | `/scoring`     | Scoring         | Per-item score + rubric + rationale |
| 4 | `/summary`     | Summary         | Aggregate scores, kappa, charts |
| 5 | `/report`      | Report          | Printable supervision report |
| 6 | `/final`       | Final Review    | Sign-off, save to history |

Plus: `/sessions` (history list) and `/settings`.

## Tech Stack
- **Next.js 15** (App Router) + **React 19** + **TypeScript** strict.
- **TailwindCSS** — migrating to **v4 with `@theme inline` + OKLCH tokens** (matching `cts-r-insight/src/styles.css`).
- **shadcn/ui-style primitives** (Card, Button, Tabs, Dialog, etc.) — adopt the patterns from `cts-r-insight/src/components/ui/`.
- **Lucide React** for icons (replace emoji icons in nav/brand).
- **Recharts** for charts.
- Path alias `@/*` → project root.

## Design System (target — from `cts-r-insight`)

### Color tokens (CSS variables, OKLCH)
- **Surface**: `--background`, `--surface`, `--surface-muted`, `--card`, `--popover`
- **Foreground**: `--foreground`, `--muted-foreground`, `--card-foreground`
- **Brand**: `--primary` (navy), `--primary-foreground`, `--secondary`, `--accent` (light blue), `--accent-foreground`
- **Status**: `--destructive`, `--success`, `--warning` (+ matching `-foreground`)
- **Form**: `--border`, `--input`, `--ring`
- **Sidebar**: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`
- **CTS-R item tints**: `--cts-1` … `--cts-12` (one per item, hue-rotated highlight color)

Use Tailwind utility names (`bg-primary`, `text-muted-foreground`, `border-border`, `bg-card`, etc.). **Never** hardcode hex / arbitrary OKLCH inline.

### Typography & spacing
- Font stack: `ui-sans-serif, system-ui, "Segoe UI", "Noto Sans Thai", sans-serif` (supports Thai labels).
- Radius: `--radius: 0.625rem` with `sm/md/lg/xl/2xl` derivatives.
- Page header pattern: bordered, `bg-card/50 backdrop-blur`, title `text-xl font-semibold`, subtitle `text-sm text-muted-foreground`, optional `WorkflowStepper` below.

### Layout
- Sidebar: 240px (`w-60`), collapsible to 0 with floating expand button on `md+`. Brand block (Stethoscope icon + "CTS-R Review · Assistant"). Bilingual nav labels (Thai primary + English subtitle). Footer card showing supervisor identity (e.g. "Supervisor Mode · Dr. Wattana · CBT Lab").
- On mobile (`< md`): sidebar hidden, drawer/sheet pattern (use shadcn `sheet`).
- Main: `flex-1 min-w-0`, page-level padding `px-6 py-5 lg:px-8`.

### Components to mirror
- `AppSidebar` — collapsible left nav with bilingual labels
- `PageHeader` — title + subtitle + right slot + WorkflowStepper
- `WorkflowStepper` — 6-step pill chain with done/current/upcoming states
- `CtsBadge` — pill with item number + name, tinted with `--cts-N`
- shadcn primitives: `card`, `button`, `tabs`, `dialog`, `tooltip`, `progress`, `badge`, `separator`, `scroll-area`, `sonner` (toasts)

## Coding Conventions (strict)
- **Server components by default**; `"use client"` only when state/effects/handlers are needed (most workflow pages will be client).
- **No barrel imports** — direct file paths (`@/components/ui/Button`).
- **Static data hoisted** to module scope, `UPPER_SNAKE_CASE`.
- **No inline component definitions** inside other components.
- Tailwind utilities only; use `cn()` from `@/lib/utils`.
- Don't add comments unless asked.
- Don't add emojis to source files (lucide icons replace emoji nav icons).

## Migration Plan (current → target)
The current scaffold uses an older custom palette (`brand`, `accent-orange`, `ink`, `canvas`, etc., Tailwind v3). Migrate incrementally:

1. **Delete** `app/therapist/`, `app/page.tsx` role selector, `components/layout/RoleSwitcher.tsx`.
2. Replace `app/page.tsx` with the Upload step (or redirect `/` → supervisor home).
3. Adopt `cts-r-insight` `styles.css` token system (or port to `tailwind.config.ts` if staying on v3).
4. Replace `components/layout/AppShell` + `Sidebar` with the `cts-r-insight`-style `AppSidebar` + bilingual labels + collapse behavior.
5. Add `WorkflowStepper` component and use it inside `PageHeader`.
6. Port shadcn-style primitives one by one (start with Card, Button, Tabs).
7. Migrate the 6 supervisor pages to match `cts-r-insight` routes (`upload`, `review`, `scoring`, `summary`, `report`, `final`) + `sessions` + `settings`.

Until migration completes, **new components must use the target design system**, not the legacy one.

## Skills to Consult Before Major UI Work
- `frontend-design` — aesthetic + UI guidelines
- `vercel-react-best-practices` — React 19 / Next.js 15 patterns
- `vercel-composition-patterns` — composition over boolean prop proliferation
- `web-design-guidelines` — accessibility / responsive

## Don'ts
- ❌ No therapist routes / components / mock data.
- ❌ No authentication, no role concepts.
- ❌ No backend / API routes (mock data only via `lib/mock-data.ts`).
- ❌ No new top-level dependencies without checking `package.json` first.
- ❌ Don't reintroduce the old `brand`/`ink`/`canvas` token names in new code.

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- IDE TS feedback often shows false positives about React types — verify with `npm run build` if unsure.

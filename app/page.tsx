import Link from "next/link";

const ROLES = [
  {
    href: "/supervisor/dashboard",
    title: "I'm a Supervisor",
    desc: "Score therapy sessions, validate AI ratings, manage caseload, generate reports.",
    icon: "🧠",
    accent: "from-brand to-brand-dark",
  },
  {
    href: "/therapist/home",
    title: "I'm a Therapist / Trainee",
    desc: "Track CTS-R progress, complete self-reviews, prepare for supervision, practise skills.",
    icon: "📔",
    accent: "from-accent-orange to-amber-600",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-8">
      <div className="w-full max-w-3xl">
        <div className="mb-10 text-center">
          <div className="eyebrow mb-3">CBT Supervision Platform</div>
          <h1 className="text-4xl font-black tracking-tight text-ink md:text-5xl">
            Welcome to <span className="text-brand">Thera</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-ink-muted">
            AI-augmented supervision built around the Cognitive Therapy Scale –
            Revised. Choose your role to continue.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {ROLES.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group rounded-card bg-screen p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover sm:p-7"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${r.accent} text-2xl text-white`}
              >
                {r.icon}
              </div>
              <div className="mb-2 text-lg font-extrabold text-ink">
                {r.title}
              </div>
              <p className="text-[13px] leading-relaxed text-ink-muted">
                {r.desc}
              </p>
              <div className="mt-5 text-[12px] font-bold text-brand transition group-hover:translate-x-1">
                Continue →
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center text-[11px] text-ink-faint">
          No authentication in this prototype · roles are switchable freely
        </div>
      </div>
    </div>
  );
}

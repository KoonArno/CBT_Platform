import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { META_LOGS } from "@/lib/mock-data";
import { kappaInterpretation } from "@/lib/utils";

const KAPPA_REF = [
  ["< 0.20",     "Slight",         "#dc2626"],
  ["0.21–0.40", "Fair",           "#E8923A"],
  ["0.41–0.60", "Moderate",       "#d97706"],
  ["0.61–0.80", "Substantial",    "#16a34a"],
  ["0.81–1.00", "Almost Perfect", "#3B75E8"],
] as const;

export default function MetaLogsPage() {
  const valid = META_LOGS.filter((l) => l.agree !== null);
  const avgAgree =
    valid.length > 0
      ? (valid.reduce((a, l) => a + (l.agree ?? 0), 0) / valid.length).toFixed(1)
      : "—";
  const avgKappa =
    valid.length > 0
      ? (valid.reduce((a, l) => a + (l.kappa ?? 0), 0) / valid.length).toFixed(2)
      : "—";
  const avgRT = (META_LOGS.reduce((a, l) => a + l.rt, 0) / META_LOGS.length).toFixed(1);
  const totalTok = META_LOGS.reduce((a, l) => a + l.pTok + l.cTok, 0);

  const KPIS = [
    ["Avg Agreement",  `${avgAgree}%`,             "AI vs Supervisor",     "#16a34a"],
    ["Avg Cohen's κ",  avgKappa,                   "Inter-rater reliability", "#3B75E8"],
    ["Avg Response",   `${avgRT}s`,                "Per AI session",       "#7c3aed"],
    ["Total Tokens",   totalTok.toLocaleString(),  "All AI sessions",      "#E8923A"],
  ] as const;

  return (
    <div>
      <PageHeader
        title="Meta Logs & Analytics"
        subtitle="AI reliability, token usage, inter-rater agreement"
      />

      <div className="mb-5 grid grid-cols-2 gap-3.5 md:grid-cols-4">
        {KPIS.map(([l, v, s, col]) => (
          <Card key={l} className="text-center">
            <div
              className="text-2xl font-black tracking-tight"
              style={{ color: col }}
            >
              {v}
            </div>
            <div className="mt-1 text-[13px] font-bold text-ink">{l}</div>
            <div className="text-[11px] text-ink-muted">{s}</div>
          </Card>
        ))}
      </div>

      <Card className="mb-4 overflow-x-auto">
        <div className="mb-3.5 text-sm font-extrabold text-ink">
          AI Scoring Session Log
        </div>
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr>
              {[
                "Timestamp",
                "Session",
                "Model",
                "Prompt Tok",
                "Completion Tok",
                "RT",
                "AI Total",
                "Sup Total",
                "Agreement",
                "κ",
                "Reliability",
              ].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap border-b border-rule px-2.5 py-2 text-left text-[10px] uppercase text-ink-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {META_LOGS.map((log) => {
              const k = kappaInterpretation(log.kappa);
              return (
                <tr key={log.id}>
                  <td className="whitespace-nowrap border-b border-rule px-2.5 py-2.5 text-[11px] text-ink-muted">
                    {log.ts}
                  </td>
                  <td className="border-b border-rule px-2.5 py-2.5 text-xs font-bold text-ink">
                    {log.session}
                  </td>
                  <td className="border-b border-rule px-2.5 py-2.5 text-[11px] text-accent-purple">
                    {log.model}
                  </td>
                  <td className="border-b border-rule px-2.5 py-2.5 text-xs text-ink-muted">
                    {log.pTok.toLocaleString()}
                  </td>
                  <td className="border-b border-rule px-2.5 py-2.5 text-xs text-ink-muted">
                    {log.cTok.toLocaleString()}
                  </td>
                  <td className="border-b border-rule px-2.5 py-2.5 text-xs font-bold text-brand">
                    {log.rt}s
                  </td>
                  <td className="border-b border-rule px-2.5 py-2.5 text-[13px]">
                    {log.aiTotal}
                  </td>
                  <td className="border-b border-rule px-2.5 py-2.5 text-[13px]">
                    {log.supTotal ?? <span className="text-rule">Pending</span>}
                  </td>
                  <td className="border-b border-rule px-2.5 py-2.5">
                    {log.agree !== null ? (
                      <span
                        className="font-extrabold"
                        style={{
                          color:
                            log.agree >= 90
                              ? "#16a34a"
                              : log.agree >= 75
                                ? "#d97706"
                                : "#dc2626",
                        }}
                      >
                        {log.agree}%
                      </span>
                    ) : (
                      <span className="text-[11px] text-rule">Pending</span>
                    )}
                  </td>
                  <td className="border-b border-rule px-2.5 py-2.5">
                    {log.kappa !== null ? (
                      <span className="font-extrabold" style={{ color: k.color }}>
                        {log.kappa.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-rule">—</span>
                    )}
                  </td>
                  <td className="border-b border-rule px-2.5 py-2.5">
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: k.color }}
                    >
                      {k.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Card>
        <div className="mb-3 text-sm font-extrabold text-ink">
          Cohen&apos;s κ Reference
        </div>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-5">
          {KAPPA_REF.map(([range, label, col]) => (
            <div
              key={range}
              className="rounded-xl border bg-canvas p-2.5 text-center"
              style={{ borderColor: `${col}30` }}
            >
              <div className="text-[13px] font-extrabold" style={{ color: col }}>
                κ {range}
              </div>
              <div className="mt-1 text-[11px] text-ink-muted">{label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

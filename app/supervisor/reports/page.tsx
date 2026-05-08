import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { CTS_R, SCORE_LABELS, scoreColor } from "@/lib/cts-r";

const FALLBACK = [3, 4, 4, 3, 4, 3, 5, 4, 4, 3, 4, 4];

export default function ReportsPage() {
  const items = CTS_R.map((item, i) => ({ ...item, score: FALLBACK[i] }));
  const total = items.reduce((acc, it) => acc + it.score, 0);
  const totalLevel = Math.min(6, Math.round(total / 12));

  return (
    <div>
      <PageHeader
        title="Supervision Report"
        subtitle="Preview and export"
        right={
          <div className="flex gap-2.5">
            <Button variant="muted">🖨 Print</Button>
            <Button variant="primary">📄 Export PDF</Button>
          </div>
        }
      />

      <Card className="mx-auto max-w-3xl">
        <div className="mb-6 border-b-2 border-brand pb-5 text-center">
          <div className="eyebrow">CBT Supervision Report · CTS-R Assessment</div>
          <div className="mt-2 text-[22px] font-black text-ink">
            Dr. Sarah Chen
          </div>
          <div className="mt-1 text-[13px] text-ink-muted">
            2026-03-08 · CBT Therapist
          </div>
        </div>

        <div className="mb-6 flex justify-center gap-10">
          {[
            ["CTS-R Total", `${total}/72`, scoreColor(totalLevel)],
            ["Mean Item", `${(total / 12).toFixed(1)}/6`, "#3B75E8"],
            ["Level", SCORE_LABELS[totalLevel], "#E8923A"],
          ].map(([l, v, col]) => (
            <div key={l} className="text-center">
              <div
                className="text-3xl font-black leading-none"
                style={{ color: col }}
              >
                {v}
              </div>
              <div className="mt-1 text-[11px] text-ink-muted">{l}</div>
            </div>
          ))}
        </div>

        <table className="mb-6 w-full border-collapse">
          <thead>
            <tr className="bg-canvas">
              {["#", "CTS-R Item", "Score", "Level"].map((h) => (
                <th
                  key={h}
                  className="border-b border-rule px-2.5 py-2 text-left text-[10px] uppercase text-ink-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border-b border-rule px-2.5 py-2 text-[11px] text-ink-muted">
                  {item.id}
                </td>
                <td className="border-b border-rule px-2.5 py-2 text-[13px] font-semibold text-ink">
                  {item.name}
                </td>
                <td className="border-b border-rule px-2.5 py-2">
                  <span
                    className="text-lg font-black"
                    style={{ color: scoreColor(item.score) }}
                  >
                    {item.score}
                  </span>
                </td>
                <td className="border-b border-rule px-2.5 py-2 text-xs text-ink-muted">
                  {SCORE_LABELS[item.score]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {[
          ["Key Strengths", "To be completed."],
          ["Areas for Development", "To be completed."],
          ["Goals for Next Session", "To be agreed with therapist."],
        ].map(([l, v]) => (
          <div key={l} className="mb-4">
            <div className="eyebrow text-brand">{l}</div>
            <div className="mt-1.5 min-h-[52px] rounded-lg border border-rule bg-canvas p-3 text-[13px] leading-relaxed text-ink">
              {v}
            </div>
          </div>
        ))}

        <div className="mt-5 flex justify-between border-t border-rule pt-3.5 text-[11px] text-ink-muted">
          <span>CBT Supervisor Platform · AI: claude-sonnet-4-20250514</span>
          <span>{new Date().toLocaleDateString("en-GB")}</span>
        </div>
      </Card>
    </div>
  );
}

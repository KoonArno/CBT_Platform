"use client";

import { CTS_R, RUBRICS, SCORE_LABELS, scoreColor } from "@/lib/cts-r";
import { Button } from "@/components/ui/Button";

interface RubricModalProps {
  itemId: number | null;
  onClose: () => void;
}

export function RubricModal({ itemId, onClose }: RubricModalProps) {
  if (itemId === null) return null;
  const item = CTS_R.find((i) => i.id === itemId);
  if (!item) return null;
  const rubric = RUBRICS[itemId];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 p-5"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-rule px-6 py-5">
          <div className="eyebrow">Item {item.id} · CTS-R Rubric</div>
          <div className="mt-1 text-lg font-extrabold text-ink">{item.name}</div>
        </div>

        <div className="px-6 py-4">
          {rubric.levels.map((level, i) => (
            <div
              key={i}
              className={`flex gap-3 py-2.5 ${i < 6 ? "border-b border-rule" : ""}`}
            >
              <div
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-black"
                style={{
                  borderColor: scoreColor(i),
                  background: `${scoreColor(i)}18`,
                  color: scoreColor(i),
                }}
              >
                {i}
              </div>
              <div>
                <div className="text-xs font-bold text-ink">
                  {SCORE_LABELS[i]}
                </div>
                <div className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                  {level}
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 rounded-xl bg-brand-tint p-3.5">
            <div className="mb-1 text-[11px] font-bold text-brand">
              💡 Supervisor Tips
            </div>
            <div className="text-xs leading-relaxed text-ink-muted">
              {rubric.tips}
            </div>
          </div>
        </div>

        <div className="border-t border-rule px-6 py-3.5">
          <Button variant="muted" full onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

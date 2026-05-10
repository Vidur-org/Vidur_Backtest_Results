"use client";

import { useMemo, useState } from "react";

import type { ScenarioBundle } from "@/lib/types";

function excerpt(text: string, max = 280) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

export function ModelResponses({ bundle }: { bundle: ScenarioBundle }) {
  const models = useMemo(
    () => Object.keys(bundle.responses ?? {}).sort(),
    [bundle.responses],
  );
  const winner = bundle.judge?.winner ?? null;
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const m of models) initial[m] = winner === m;
    return initial;
  });

  return (
    <div className="space-y-3">
      {models.map((m) => {
        const r = bundle.responses[m];
        const isWinner = winner === m;
        const expanded = !!open[m];
        return (
          <div
            key={m}
            className={`rounded-2xl border shadow-sm ${
              isWinner
                ? "border-teal-300 bg-teal-50/40 ring-1 ring-teal-700/10"
                : "border-stone-200 bg-white"
            }`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
              onClick={() => setOpen((s) => ({ ...s, [m]: !expanded }))}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-stone-900">{m}</span>
                  {isWinner ? (
                    <span className="rounded-full bg-teal-700 px-2 py-0.5 text-[11px] font-semibold text-white">
                      Winner
                    </span>
                  ) : null}
                  {r?.elapsed_s != null ? (
                    <span className="text-xs text-stone-500">{r.elapsed_s.toFixed(1)}s</span>
                  ) : null}
                  {r?.tokens_used != null ? (
                    <span className="text-xs text-stone-500">{r.tokens_used.toLocaleString()} tok</span>
                  ) : null}
                </div>
                {!expanded ? (
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{excerpt(r?.raw_text ?? "")}</p>
                ) : null}
              </div>
              <span className="shrink-0 text-xs font-semibold text-stone-500">
                {expanded ? "Hide" : "Expand"}
              </span>
            </button>
            {expanded ? (
              <div className="border-t border-stone-200/70 px-4 py-4">
                <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-stone-800">
                  {r?.raw_text ?? ""}
                </pre>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { CatalogEntry } from "@/lib/types";
import { metricRange, metricValue, type ScoreMetric } from "@/lib/matrix";

function mix(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

/** Background + foreground for numeric score cell (teal scale). */
function cellColors(value: number, min: number, max: number): { bg: string; fg: string } {
  if (!Number.isFinite(value)) {
    return { bg: "#f5f5f4", fg: "#78716c" };
  }
  const t = max <= min ? 0.55 : (value - min) / (max - min);
  const r = mix(241, 15, t);
  const g = mix(245, 118, t);
  const b = mix(249, 110, t);
  const fg = t > 0.55 ? "#fafaf9" : "#0c0a09";
  return { bg: `rgb(${r},${g},${b})`, fg };
}

const METRICS: { id: ScoreMetric; label: string }[] = [
  { id: "total", label: "Total" },
  { id: "depth", label: "Depth" },
  { id: "maths", label: "Maths" },
  { id: "analysis", label: "Analysis" },
];

export function ScoreHeatmap({
  entries,
  models,
}: {
  entries: CatalogEntry[];
  models: string[];
}) {
  const [metric, setMetric] = useState<ScoreMetric>("total");

  const range = useMemo(() => metricRange(entries, models, metric), [entries, models, metric]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-600">
          Rows are scenarios; columns are models. Color reflects adjudicated scores (missing runs read
          as empty).
        </p>
        <div className="flex flex-wrap gap-2">
          {METRICS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMetric(m.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                metric === m.id
                  ? "bg-stone-900 text-white ring-stone-900"
                  : "bg-white text-stone-700 ring-stone-200 hover:bg-stone-50"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="min-w-max border-collapse text-xs">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th className="sticky left-0 z-20 border-r border-stone-200 bg-stone-50 px-3 py-2 text-left font-semibold text-stone-700">
                Scenario
              </th>
              {models.map((m) => (
                <th
                  key={m}
                  className="min-w-[4.5rem] px-2 py-2 text-center font-semibold capitalize text-stone-600"
                >
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.slug} className="border-b border-stone-100 last:border-b-0">
                <th className="sticky left-0 z-10 border-r border-stone-200 bg-white px-3 py-2 text-left align-middle shadow-[2px_0_8px_-2px_rgba(0,0,0,0.06)]">
                  <Link
                    href={`/scenarios/${e.slug}`}
                    className="font-semibold text-teal-900 hover:text-teal-950 hover:underline"
                  >
                    {e.stock}
                  </Link>
                  <div className="mt-0.5 text-[11px] font-normal text-stone-500">
                    {e.window} · {e.kind}
                  </div>
                </th>
                {models.map((m) => {
                  const v = e.scores ? metricValue(e.scores[m], metric) : null;
                  const colors =
                    v == null ? { bg: "#fafaf9", fg: "#a8a29e" } : cellColors(v, range.min, range.max);
                  return (
                    <td
                      key={m}
                      className="px-0 py-0 text-center align-middle"
                      title={
                        v == null
                          ? `${e.stock} — ${m}: no score`
                          : `${e.stock} — ${m}: ${v} (${metric})`
                      }
                    >
                      <div
                        className="mx-auto flex min-h-10 min-w-[3.5rem] items-center justify-center px-1 py-1 font-semibold tabular-nums"
                        style={{ backgroundColor: colors.bg, color: colors.fg }}
                      >
                        {v == null ? "—" : v}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
        <span className="font-medium text-stone-600">Scale</span>
        <span>
          Low <span className="mx-1 inline-block h-3 w-16 rounded-sm bg-gradient-to-r from-[rgb(241,245,249)] to-[rgb(15,118,110)] align-middle" />{" "}
          High ({metric})
        </span>
        <span className="tabular-nums">
          min {range.min} · max {range.max}
        </span>
      </div>
    </div>
  );
}

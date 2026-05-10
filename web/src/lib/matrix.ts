import type { CatalogEntry, ScoreDetail } from "@/lib/types";

export type ScoreMetric = "total" | "depth" | "maths" | "analysis";

/** Union of models that appear in adjudication scores, with optional preferred ordering first. */
export function modelsForMatrix(
  entries: CatalogEntry[],
  preferred?: string[],
): string[] {
  const set = new Set<string>();
  for (const e of entries) {
    if (e.scores) {
      for (const m of Object.keys(e.scores)) set.add(m);
    }
  }
  const rest = [...set].sort((a, b) => a.localeCompare(b));
  if (!preferred?.length) return rest;
  const pref = preferred.filter((m) => set.has(m));
  const tail = rest.filter((m) => !pref.includes(m));
  return [...pref, ...tail];
}

export function metricValue(s: ScoreDetail | undefined, metric: ScoreMetric): number | null {
  if (!s) return null;
  return s[metric];
}

export function metricRange(
  entries: CatalogEntry[],
  models: string[],
  metric: ScoreMetric,
): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (const e of entries) {
    if (!e.scores) continue;
    for (const m of models) {
      const v = metricValue(e.scores[m], metric);
      if (v == null) continue;
      min = Math.min(min, v);
      max = Math.max(max, v);
    }
  }
  if (!Number.isFinite(min)) min = 0;
  if (!Number.isFinite(max)) max = 0;
  return { min, max };
}

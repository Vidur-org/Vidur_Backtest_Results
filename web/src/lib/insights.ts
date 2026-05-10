import type { CatalogEntry } from "@/lib/types";

export function aggregateWinners(entries: CatalogEntry[]) {
  const counts = new Map<string, number>();
  for (const e of entries) {
    const w = e.judgeWinner;
    if (!w) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([model, count]) => ({ model, count }))
    .sort((a, b) => b.count - a.count);
}

export function aggregateModelAvgScores(entries: CatalogEntry[]) {
  const sums = new Map<
    string,
    { total: number; depth: number; maths: number; analysis: number; n: number }
  >();

  for (const e of entries) {
    if (!e.scores) continue;
    for (const [model, s] of Object.entries(e.scores)) {
      const cur = sums.get(model) ?? { total: 0, depth: 0, maths: 0, analysis: 0, n: 0 };
      cur.total += s.total;
      cur.depth += s.depth;
      cur.maths += s.maths;
      cur.analysis += s.analysis;
      cur.n += 1;
      sums.set(model, cur);
    }
  }

  return [...sums.entries()]
    .map(([model, v]) => ({
      model,
      scenarios: v.n,
      avgTotal: v.total / v.n,
      avgDepth: v.depth / v.n,
      avgMaths: v.maths / v.n,
      avgAnalysis: v.analysis / v.n,
    }))
    .sort((a, b) => b.avgTotal - a.avgTotal);
}

export function aggregateTags(entries: CatalogEntry[], limit = 18) {
  const counts = new Map<string, number>();
  for (const e of entries) for (const t of e.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

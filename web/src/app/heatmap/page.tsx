import type { Metadata } from "next";

import { ScoreHeatmap } from "@/components/ScoreHeatmap";
import { loadCatalog } from "@/lib/catalog";
import { modelsForMatrix } from "@/lib/matrix";

export const metadata: Metadata = {
  title: "Score heatmap",
  description: "Scenario × model adjudication scores across the library.",
};

export default async function HeatmapPage() {
  const catalog = await loadCatalog();
  const preferred = catalog.summaryMeta?.batchModels;
  const models = modelsForMatrix(catalog.entries, preferred);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Score heatmap</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Scan adjudication strength across scenarios and models. Switch metrics to inspect depth,
          mathematical rigor, and analytic usefulness—besides headline totals.
        </p>
      </div>

      <div className="mt-10">
        <ScoreHeatmap entries={catalog.entries} models={models} />
      </div>
    </main>
  );
}

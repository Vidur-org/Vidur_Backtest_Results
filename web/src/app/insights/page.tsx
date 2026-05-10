import type { Metadata } from "next";

import { InsightsCharts } from "@/components/InsightsCharts";
import { loadCatalog } from "@/lib/catalog";
import { aggregateModelAvgScores, aggregateTags, aggregateWinners } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights",
  description: "Aggregate statistics across scenarios, models, and themes.",
};

export default async function InsightsPage() {
  const catalog = await loadCatalog();
  const winnerRows = aggregateWinners(catalog.entries);
  const modelAvgRows = aggregateModelAvgScores(catalog.entries);
  const tagRows = aggregateTags(catalog.entries, 16);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Portfolio insights</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Cross-scenario aggregates help investors understand model behavior and thematic coverage—
          complementary to individual thesis pages.
        </p>
      </div>

      <div className="mt-10">
        <InsightsCharts winnerRows={winnerRows} modelAvgRows={modelAvgRows} tagRows={tagRows} />
      </div>
    </main>
  );
}

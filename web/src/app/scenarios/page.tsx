import type { Metadata } from "next";

import { ScenarioExplorer } from "@/components/ScenarioExplorer";
import { loadCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Scenarios",
  description: "Search and filter adjudicated equity research scenarios.",
};

export default async function ScenariosPage() {
  const catalog = await loadCatalog();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Scenario library</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Filter by symbol, theme tags, or winning model. Open any row for judge rationale and full
          model narratives.
        </p>
      </div>

      <div className="mt-10">
        <ScenarioExplorer entries={catalog.entries} />
      </div>
    </main>
  );
}

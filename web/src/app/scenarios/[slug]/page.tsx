import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ModelResponses } from "@/components/ModelResponses";
import { entryBySlug, loadCatalog, loadScenarioRaw } from "@/lib/catalog";
import type { CatalogEntry, ScenarioBundle } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const catalog = await loadCatalog();
  return catalog.entries.map((e) => ({ slug: e.slug }));
}

function ScoreTable({ entry }: { entry: CatalogEntry }) {
  if (!entry.scores) {
    return (
      <p className="text-sm text-stone-600">
        No adjudication scores are attached to this export yet.
      </p>
    );
  }

  const rows = Object.entries(entry.scores).sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-stone-200 text-sm">
        <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
          <tr>
            <th className="px-4 py-3">Model</th>
            <th className="px-4 py-3">Depth</th>
            <th className="px-4 py-3">Maths</th>
            <th className="px-4 py-3">Analysis</th>
            <th className="px-4 py-3">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {rows.map(([model, s]) => {
            const isWinner = entry.judgeWinner === model;
            return (
              <tr
                key={model}
                className={isWinner ? "bg-teal-50/50" : "hover:bg-stone-50/70"}
              >
                <td className="px-4 py-3 font-semibold text-stone-900">
                  <span className="inline-flex items-center gap-2">
                    {model}
                    {isWinner ? (
                      <span className="rounded-full bg-teal-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Winner
                      </span>
                    ) : null}
                  </span>
                </td>
                <td className="px-4 py-3 tabular-nums text-stone-700">{s.depth}</td>
                <td className="px-4 py-3 tabular-nums text-stone-700">{s.maths}</td>
                <td className="px-4 py-3 tabular-nums text-stone-700">{s.analysis}</td>
                <td className="px-4 py-3 tabular-nums font-semibold text-stone-900">{s.total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const catalog = await loadCatalog();
  const entry = entryBySlug(catalog.entries, slug);
  if (!entry) return { title: "Scenario" };
  return {
    title: `${entry.stock}`,
    description: entry.judgeSummary ?? `Scenario detail for ${entry.stock}.`,
  };
}

export default async function ScenarioDetailPage(props: Props) {
  const { slug } = await props.params;

  const catalog = await loadCatalog();
  const entry = entryBySlug(catalog.entries, slug);
  if (!entry) notFound();

  let bundle: ScenarioBundle;
  try {
    bundle = (await loadScenarioRaw(slug)) as ScenarioBundle;
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/scenarios"
            className="text-sm font-semibold text-teal-800 hover:text-teal-950"
          >
            ← Back to library
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">
            {entry.stock}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 ring-1 ring-stone-200/70">
              {entry.window}
            </span>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 ring-1 ring-stone-200/70">
              {entry.kind}
            </span>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 ring-1 ring-stone-200/70">
              id: {entry.id}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700 ring-1 ring-stone-200"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Research brief
        </h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-stone-800">
          {entry.query}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-stone-900">Judge summary</h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-700">
          {entry.judgeSummary ?? "No judge summary was included in this export."}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-stone-900">Score breakdown</h2>
        <div className="mt-4">
          <ScoreTable entry={entry} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-stone-900">Model outputs</h2>
        <p className="mt-2 text-sm text-stone-600">
          Expand any model to read the full narrative. The winning model is highlighted.
        </p>
        <div className="mt-6">
          <ModelResponses bundle={bundle} />
        </div>
      </section>
    </main>
  );
}

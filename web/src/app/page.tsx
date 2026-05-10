import Link from "next/link";

import { loadCatalog } from "@/lib/catalog";

export default async function Home() {
  const catalog = await loadCatalog();
  const n = catalog.entries.length;
  const models =
    catalog.summaryMeta?.batchModels?.length
      ? catalog.summaryMeta.batchModels.length
      : new Set(catalog.entries.flatMap((e) => e.models)).size;

  return (
    <main>
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold tracking-wide text-teal-800">Scenario library</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            A calm, investor-ready view of multi-model research outputs.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
            Explore adjudicated scenarios across names and themes, compare model scores, and drill
            into full responses—structured for diligence conversations, not dashboard noise.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/scenarios"
              className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-700"
            >
              Browse scenarios
            </Link>
            <Link
              href="/insights"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-stone-400"
            >
              View portfolio insights
            </Link>
            <Link
              href="/heatmap"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-stone-400"
            >
              Score heatmap
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-stone-400"
            >
              Compare scenarios
            </Link>
          </div>

          <dl className="mt-14 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Scenarios indexed
              </dt>
              <dd className="mt-2 text-3xl font-semibold tabular-nums text-stone-900">{n}</dd>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Models compared
              </dt>
              <dd className="mt-2 text-3xl font-semibold tabular-nums text-stone-900">{models}</dd>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Last catalog build
              </dt>
              <dd className="mt-2 text-sm font-semibold leading-snug text-stone-900">
                {new Date(catalog.generatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-stone-900">Structured adjudication</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Each scenario carries transparent scoring dimensions—depth, mathematical rigor, and
              analytic usefulness—plus an overall winner selected by your judging layer.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-stone-900">Built for conversation</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Summaries surface first; full model narratives stay one click away. Ideal for live
              meetings and asynchronous investor follow-ups.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-stone-900">Portfolio lenses</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Tag-driven exposure and aggregate score curves highlight how models behave across the
              library—not just on a single ticker.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

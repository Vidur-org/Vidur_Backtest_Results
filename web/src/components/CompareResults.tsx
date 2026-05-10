import Link from "next/link";

import type { CatalogEntry } from "@/lib/types";

function MiniScores({ entry }: { entry: CatalogEntry }) {
  if (!entry.scores) {
    return <p className="text-sm text-stone-500">No scores in export.</p>;
  }
  const rows = Object.entries(entry.scores).sort((a, b) => b[1].total - a[1].total);
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200">
      <table className="w-full text-xs">
        <thead className="bg-stone-50 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
          <tr>
            <th className="px-2 py-2 text-left">Model</th>
            <th className="px-2 py-2 tabular-nums">D</th>
            <th className="px-2 py-2 tabular-nums">M</th>
            <th className="px-2 py-2 tabular-nums">A</th>
            <th className="px-2 py-2 tabular-nums">Σ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {rows.map(([model, s]) => {
            const win = entry.judgeWinner === model;
            return (
              <tr key={model} className={win ? "bg-teal-50/60" : ""}>
                <td className="px-2 py-2 font-semibold text-stone-900">
                  <span className="flex flex-wrap items-center gap-1">
                    {model}
                    {win ? (
                      <span className="rounded bg-teal-700 px-1 py-0.5 text-[9px] font-bold uppercase text-white">
                        win
                      </span>
                    ) : null}
                  </span>
                </td>
                <td className="px-2 py-2 tabular-nums text-stone-700">{s.depth}</td>
                <td className="px-2 py-2 tabular-nums text-stone-700">{s.maths}</td>
                <td className="px-2 py-2 tabular-nums text-stone-700">{s.analysis}</td>
                <td className="px-2 py-2 tabular-nums font-semibold text-stone-900">{s.total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function compareGridClass(n: number) {
  if (n <= 1) return "mx-auto grid max-w-2xl grid-cols-1 gap-6";
  if (n === 2) return "grid grid-cols-1 gap-6 lg:grid-cols-2";
  return "grid grid-cols-1 gap-6 lg:grid-cols-3";
}

export function CompareResults({ entries }: { entries: CatalogEntry[] }) {
  return (
    <div className={compareGridClass(entries.length)}>
      {entries.map((e) => (
        <section
          key={e.slug}
          className="flex min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">{e.stock}</h2>
              <p className="mt-1 text-xs font-medium text-stone-500">
                {e.window} · {e.kind}
              </p>
            </div>
            <Link
              href={`/scenarios/${e.slug}`}
              className="shrink-0 text-xs font-semibold text-teal-800 hover:underline"
            >
              Full detail
            </Link>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {e.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-700"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              Judge winner
            </p>
            <p className="mt-1 text-sm font-semibold text-teal-900">{e.judgeWinner ?? "—"}</p>
          </div>

          <div className="mt-4 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              Judge summary
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-700">
              {e.judgeSummary ?? "No summary attached."}
            </p>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              Scores
            </p>
            <div className="mt-2">
              <MiniScores entry={e} />
            </div>
          </div>

          <details className="mt-4 rounded-xl border border-stone-100 bg-stone-50/80 px-3 py-2">
            <summary className="cursor-pointer text-xs font-semibold text-stone-700">
              Research brief
            </summary>
            <p className="mt-2 text-xs leading-relaxed text-stone-600">{e.query}</p>
          </details>
        </section>
      ))}
    </div>
  );
}

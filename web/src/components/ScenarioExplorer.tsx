"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { CatalogEntry } from "@/lib/types";

function winnerScore(entry: CatalogEntry): number | null {
  const w = entry.judgeWinner;
  if (!w || !entry.scores?.[w]) return null;
  return entry.scores[w].total;
}

export function ScenarioExplorer({ entries }: { entries: CatalogEntry[] }) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string>("");
  const [winner, setWinner] = useState<string>("");

  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const e of entries) for (const t of e.tags) s.add(t);
    return [...s].sort((a, b) => a.localeCompare(b));
  }, [entries]);

  const winners = useMemo(() => {
    const s = new Set<string>();
    for (const e of entries) if (e.judgeWinner) s.add(e.judgeWinner);
    return [...s].sort((a, b) => a.localeCompare(b));
  }, [entries]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return entries.filter((e) => {
      if (winner && e.judgeWinner !== winner) return false;
      if (tag && !e.tags.includes(tag)) return false;
      if (!needle) return true;
      const hay = [
        e.stock,
        e.id,
        e.window,
        e.kind,
        ...e.tags,
        e.query.slice(0, 400),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [entries, q, tag, winner]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-stone-700">
          Search
          <input
            value={q}
            onChange={(ev) => setQ(ev.target.value)}
            placeholder="Symbol, tag, thesis keywords…"
            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-stone-900 outline-none ring-teal-700/30 placeholder:text-stone-400 focus:border-teal-700 focus:bg-white focus:ring-4"
          />
        </label>
        <label className="flex w-full flex-col gap-2 text-sm font-medium text-stone-700 sm:w-44">
          Tag
          <select
            value={tag}
            onChange={(ev) => setTag(ev.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/25"
          >
            <option value="">All tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex w-full flex-col gap-2 text-sm font-medium text-stone-700 sm:w-44">
          Winner
          <select
            value={winner}
            onChange={(ev) => setWinner(ev.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/25"
          >
            <option value="">Any model</option>
            {winners.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between text-sm text-stone-600">
        <span>
          Showing <span className="font-semibold text-stone-900">{filtered.length}</span> of{" "}
          {entries.length} scenarios
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-stone-200 text-sm">
          <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Stock</th>
              <th className="hidden px-4 py-3 md:table-cell">Horizon</th>
              <th className="hidden px-4 py-3 lg:table-cell">Kind</th>
              <th className="px-4 py-3">Winner</th>
              <th className="hidden px-4 py-3 sm:table-cell">Score</th>
              <th className="px-4 py-3 text-right"> </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((e) => (
              <tr key={e.slug} className="transition-colors hover:bg-stone-50/80">
                <td className="px-4 py-3">
                  <div className="font-semibold text-stone-900">{e.stock}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {e.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600"
                      >
                        {t}
                      </span>
                    ))}
                    {e.tags.length > 4 ? (
                      <span className="text-[11px] text-stone-400">+{e.tags.length - 4}</span>
                    ) : null}
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-stone-700 md:table-cell">{e.window}</td>
                <td className="hidden px-4 py-3 text-stone-600 lg:table-cell">{e.kind}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-900 ring-1 ring-teal-700/15">
                    {e.judgeWinner ?? "—"}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-stone-700 sm:table-cell">
                  {winnerScore(e) ?? "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/scenarios/${e.slug}`}
                    className="inline-flex rounded-full bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-stone-700"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

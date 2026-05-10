"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type { CatalogEntry } from "@/lib/types";

const MAX = 3;

export function ComparePicker({
  entries,
  initialSelected = [],
}: {
  entries: CatalogEntry[];
  initialSelected?: string[];
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>(() =>
    initialSelected.filter((slug) => entries.some((e) => e.slug === slug)).slice(0, MAX),
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((e) => {
      const hay = [e.stock, e.id, e.window, ...e.tags].join(" ").toLowerCase();
      return hay.includes(needle);
    });
  }, [entries, q]);

  function toggle(slug: string) {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX) return prev;
      return [...prev, slug];
    });
  }

  function runCompare() {
    if (selected.length < 2) return;
    router.push(`/compare?compare=${encodeURIComponent(selected.join(","))}`);
  }

  return (
    <div className="space-y-6">
      <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
        Search scenarios
        <input
          value={q}
          onChange={(ev) => setQ(ev.target.value)}
          placeholder="Symbol or tag…"
          className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-900 outline-none ring-teal-700/25 placeholder:text-stone-400 focus:border-teal-700 focus:ring-4"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-600">
          Choose <span className="font-semibold text-stone-900">2–{MAX}</span> scenarios. Selected:{" "}
          <span className="tabular-nums font-semibold text-stone-900">{selected.length}</span>
        </p>
        <button
          type="button"
          disabled={selected.length < 2}
          onClick={runCompare}
          className="rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition enabled:hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
        >
          Compare selected
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <ul className="max-h-[min(28rem,60vh)] divide-y divide-stone-100 overflow-y-auto">
          {filtered.map((e) => {
            const on = selected.includes(e.slug);
            const disabled = !on && selected.length >= MAX;
            return (
              <li key={e.slug}>
                <label
                  className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition hover:bg-stone-50 ${
                    disabled ? "opacity-50 hover:bg-transparent" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    disabled={disabled}
                    onChange={() => toggle(e.slug)}
                    className="mt-1 size-4 rounded border-stone-300 text-teal-700 focus:ring-teal-700"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="font-semibold text-stone-900">{e.stock}</span>
                    <span className="ml-2 text-xs font-medium text-stone-500">
                      {e.window} · {e.kind}
                    </span>
                    {e.judgeWinner ? (
                      <span className="ml-2 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-900 ring-1 ring-teal-700/15">
                        winner: {e.judgeWinner}
                      </span>
                    ) : null}
                    <div className="mt-1 flex flex-wrap gap-1">
                      {e.tags.slice(0, 6).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] text-stone-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </span>
                  <Link
                    href={`/scenarios/${e.slug}`}
                    className="shrink-0 text-xs font-semibold text-teal-800 hover:underline"
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    Open
                  </Link>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

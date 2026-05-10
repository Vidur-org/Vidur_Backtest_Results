import type { Metadata } from "next";
import Link from "next/link";

import { ComparePicker } from "@/components/ComparePicker";
import { CompareResults } from "@/components/CompareResults";
import { entryBySlug, loadCatalog } from "@/lib/catalog";
import type { CatalogEntry } from "@/lib/types";

export const metadata: Metadata = {
  title: "Compare",
  description: "Place scenarios side-by-side for diligence conversations.",
};

const MAX_COMPARE = 3;

type Props = {
  searchParams: Promise<{ compare?: string | string[] }>;
};

function rawCompareParam(sp: { compare?: string | string[] }): string | undefined {
  const c = sp.compare;
  if (Array.isArray(c)) return c[0];
  return c;
}

function parseCompareSlugs(raw?: string): string[] {
  if (!raw) return [];
  try {
    return raw
      .split(",")
      .map((s) => decodeURIComponent(s.trim()))
      .filter(Boolean)
      .slice(0, MAX_COMPARE);
  } catch {
    return [];
  }
}

export default async function ComparePage(props: Props) {
  const sp = await props.searchParams;
  const catalog = await loadCatalog();

  const requested = parseCompareSlugs(rawCompareParam(sp));
  const resolved: CatalogEntry[] = [];
  for (const slug of requested) {
    const e = entryBySlug(catalog.entries, slug);
    if (e) resolved.push(e);
  }
  const invalid = requested.filter((slug) => !entryBySlug(catalog.entries, slug));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Compare scenarios</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Select two or three scenarios to view judge summaries and score tables side-by-side—helpful
          for sector drifts, horizon contrasts, or reruns.
        </p>
      </div>

      {invalid.length ? (
        <div
          className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="status"
        >
          <span className="font-semibold">Unknown slug(s):</span> {invalid.join(", ")}
        </div>
      ) : null}

      <div className="mt-10">
        {resolved.length >= 2 ? (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/compare"
                className="text-sm font-semibold text-teal-800 hover:text-teal-950 hover:underline"
              >
                ← Choose different scenarios
              </Link>
              <p className="text-xs text-stone-500">
                Comparing{" "}
                <span className="font-semibold text-stone-800">{resolved.length}</span> scenarios
              </p>
            </div>
            <CompareResults entries={resolved} />
          </div>
        ) : (
          <div className="space-y-4">
            {resolved.length === 1 ? (
              <p className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm">
                One scenario matched your link. Select at least{" "}
                <span className="font-semibold">one more</span> below to run a comparison.
              </p>
            ) : null}
            <ComparePicker
              entries={catalog.entries}
              initialSelected={resolved.length === 1 ? [resolved[0].slug] : []}
            />
          </div>
        )}
      </div>
    </main>
  );
}

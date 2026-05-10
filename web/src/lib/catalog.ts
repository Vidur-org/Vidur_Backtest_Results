import fs from "fs/promises";
import path from "path";

import type { CatalogEntry, CatalogFile } from "@/lib/types";

export async function loadCatalog(): Promise<CatalogFile> {
  const p = path.join(process.cwd(), "public", "data", "catalog.json");
  const raw = await fs.readFile(p, "utf8");
  return JSON.parse(raw) as CatalogFile;
}

export async function loadScenarioRaw(slug: string): Promise<unknown> {
  const safe = path.basename(slug);
  if (safe !== slug) {
    throw new Error("Invalid scenario slug");
  }
  const p = path.join(process.cwd(), "public", "data", "raw", `${safe}.json`);
  const raw = await fs.readFile(p, "utf8");
  return JSON.parse(raw);
}

export function entryBySlug(entries: CatalogEntry[], slug: string): CatalogEntry | undefined {
  return entries.find((e) => e.slug === slug);
}

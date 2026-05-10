import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const OUT_DIR = path.resolve(__dirname, "..", "public", "data");
const RAW_DIR = path.join(OUT_DIR, "raw");

/** Repo-root JSON that must never be treated as scenario exports */
const SKIP_ROOT_JSON = new Set([
  "summary.json",
  "package.json",
  "package-lock.json",
  "vercel.json",
  "tsconfig.json",
  "jsconfig.json",
  "components.json",
]);

function readSummaryMeta(root) {
  try {
    const p = path.join(root, "summary.json");
    const raw = fs.readFileSync(p, "utf8");
    const j = JSON.parse(raw);
    return {
      batchElapsed_s: typeof j.elapsed_s === "number" ? j.elapsed_s : null,
      batchModels: Array.isArray(j.models) ? j.models : [],
      summaryScenarioRows: Array.isArray(j.scenarios) ? j.scenarios.length : 0,
    };
  } catch {
    return null;
  }
}

function buildEntry(file, data) {
  const scenario = data?.scenario;
  if (!scenario?.id) {
    return null;
  }

  const responses = data?.responses && typeof data.responses === "object" ? data.responses : {};
  const models = Object.keys(responses).sort();

  const modelMetrics = {};
  for (const m of models) {
    const r = responses[m];
    modelMetrics[m] = {
      elapsed_s: typeof r?.elapsed_s === "number" ? r.elapsed_s : null,
      tokens_used: typeof r?.tokens_used === "number" ? r.tokens_used : null,
      error: r?.error ?? null,
    };
  }

  const judge = data?.judge;
  const scores =
    judge?.scores && typeof judge.scores === "object"
      ? Object.fromEntries(
          Object.entries(judge.scores).map(([k, v]) => [
            k,
            {
              depth: Number(v?.depth ?? 0),
              maths: Number(v?.maths ?? 0),
              analysis: Number(v?.analysis ?? 0),
              total: Number(v?.total ?? 0),
              rationale: typeof v?.rationale === "string" ? v.rationale : undefined,
            },
          ]),
        )
      : null;

  const slug = path.basename(file, ".json");

  return {
    slug,
    sourceFile: file,
    id: scenario.id,
    stock: scenario.stock ?? scenario.id,
    window: scenario.window ?? "",
    kind: scenario.kind ?? "",
    tags: Array.isArray(scenario.tags) ? scenario.tags : [],
    query: typeof scenario.query === "string" ? scenario.query : "",
    models,
    modelMetrics,
    judgeWinner: typeof judge?.winner === "string" ? judge.winner : null,
    judgeSummary: typeof judge?.summary === "string" ? judge.summary : null,
    scores,
  };
}

function main() {
  const names = fs.readdirSync(REPO_ROOT).filter((n) => n.endsWith(".json"));
  const scenarioFiles = names.filter((n) => !SKIP_ROOT_JSON.has(n)).sort();

  fs.mkdirSync(RAW_DIR, { recursive: true });

  const entries = [];
  const idCounts = new Map();

  for (const file of scenarioFiles) {
    const full = path.join(REPO_ROOT, file);
    const data = JSON.parse(fs.readFileSync(full, "utf8"));
    const entry = buildEntry(file, data);
    if (!entry) {
      console.warn(`[catalog] Skipping ${file}: not a scenario export (missing scenario.id)`);
      continue;
    }
    entries.push(entry);
    idCounts.set(entry.id, (idCounts.get(entry.id) ?? 0) + 1);

    const dest = path.join(RAW_DIR, file);
    fs.copyFileSync(full, dest);
  }

  const duplicates = [...idCounts.entries()].filter(([, c]) => c > 1).map(([id]) => id);
  if (duplicates.length) {
    console.warn(
      "[catalog] Warning: duplicate scenario.id values across files — slugs remain unique:",
      duplicates.join(", "),
    );
  }

  const catalog = {
    generatedAt: new Date().toISOString(),
    repoRoot: REPO_ROOT,
    summaryMeta: readSummaryMeta(REPO_ROOT),
    entries: entries.sort((a, b) => a.stock.localeCompare(b.stock)),
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "catalog.json"), JSON.stringify(catalog, null, 2), "utf8");

  console.log(
    `[catalog] Wrote ${entries.length} scenarios → public/data/catalog.json + public/data/raw/*.json`,
  );
}

main();

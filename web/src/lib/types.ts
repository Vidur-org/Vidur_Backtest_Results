export type ModelMetrics = {
  elapsed_s: number | null;
  tokens_used: number | null;
  error: string | null;
};

export type ScoreDetail = {
  depth: number;
  maths: number;
  analysis: number;
  total: number;
  rationale?: string;
};

export type CatalogEntry = {
  slug: string;
  sourceFile: string;
  id: string;
  stock: string;
  window: string;
  kind: string;
  tags: string[];
  query: string;
  models: string[];
  modelMetrics: Record<string, ModelMetrics>;
  judgeWinner: string | null;
  judgeSummary: string | null;
  scores: Record<string, ScoreDetail> | null;
};

export type SummaryMeta = {
  batchElapsed_s: number | null;
  batchModels: string[];
  summaryScenarioRows: number;
};

export type CatalogFile = {
  generatedAt: string;
  repoRoot: string;
  summaryMeta: SummaryMeta | null;
  entries: CatalogEntry[];
};

export type ScenarioBundle = {
  scenario: {
    id: string;
    stock: string;
    window: string;
    kind: string;
    tags: string[];
    query: string;
  };
  responses: Record<
    string,
    {
      model_id: string;
      raw_text: string;
      elapsed_s?: number;
      error?: string | null;
      tokens_used?: number;
      timestamp?: string;
    }
  >;
  judge?: {
    winner: string;
    summary: string;
    scores: Record<string, ScoreDetail & { rationale?: string }>;
  };
};

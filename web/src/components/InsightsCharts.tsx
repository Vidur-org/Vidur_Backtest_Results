"use client";

import { useSyncExternalStore } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const teal = "#0f766e";
const tealMid = "#14b8a6";

export type WinnerRow = { model: string; count: number };
export type ModelAvgRow = {
  model: string;
  avgTotal: number;
  avgDepth: number;
  avgMaths: number;
  avgAnalysis: number;
  scenarios: number;
};
export type TagRow = { tag: string; count: number };

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-stone-900">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-stone-600">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

function BarTooltipStyles() {
  return {
    cursor: { fill: "rgba(15, 118, 110, 0.06)" },
    contentStyle: {
      borderRadius: 12,
      border: "1px solid #e7e5e4",
      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    },
  };
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function InsightsCharts({
  winnerRows,
  modelAvgRows,
  tagRows,
}: {
  winnerRows: WinnerRow[];
  modelAvgRows: ModelAvgRow[];
  tagRows: TagRow[];
}) {
  const mounted = useIsClient();

  const slate = "#64748b";
  const tooltip = BarTooltipStyles();
  const tagColors = tagRows.map((_, i) => `hsl(${165 + (i % 10) * 9}, 42%, ${44 - (i % 5) * 2}%)`);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-[320px] rounded-2xl border border-stone-200 bg-white shadow-sm" />
          <div className="h-[320px] rounded-2xl border border-stone-200 bg-white shadow-sm" />
        </div>
        <div className="h-[380px] rounded-2xl border border-stone-200 bg-white shadow-sm" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Judge selections"
          subtitle="How often each model was ranked first across scenarios."
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={winnerRows} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis type="number" stroke={slate} tick={{ fill: slate, fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="model"
                  width={78}
                  stroke={slate}
                  tick={{ fill: slate, fontSize: 12 }}
                  interval={0}
                />
                <Tooltip {...tooltip} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {winnerRows.map((_, idx) => (
                    <Cell key={idx} fill={idx === 0 ? teal : tealMid} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Average judge totals"
          subtitle="Mean overall score by model (when scored on a scenario)."
        >
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelAvgRows} layout="vertical" margin={{ left: 4, right: 14 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis type="number" stroke={slate} tick={{ fill: slate, fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="model"
                  width={96}
                  stroke={slate}
                  tick={{ fill: slate, fontSize: 11 }}
                  interval={0}
                />
                <Tooltip {...tooltip} />
                <Bar dataKey="avgTotal" fill={teal} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Theme exposure" subtitle="Most frequent scenario tags in this library.">
        <div className="h-[380px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tagRows} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis type="number" stroke={slate} tick={{ fill: slate, fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="tag"
                width={132}
                stroke={slate}
                tick={{ fill: slate, fontSize: 11 }}
                interval={0}
              />
              <Tooltip {...tooltip} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {tagRows.map((_, idx) => (
                  <Cell key={idx} fill={tagColors[idx % tagColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}

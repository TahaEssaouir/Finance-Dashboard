"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface ExpenseChartDatum {
  name: string;
  value: number;
}

interface ExpenseChartProps {
  data: ExpenseChartDatum[];
}

function TooltipContent({ payload, active }: { payload?: any; active?: boolean }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white shadow-lg">
      <div className="font-semibold">{name}</div>
      <div className="text-emerald-400">{currency.format(value ?? 0)}</div>
    </div>
  );
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} tickFormatter={(v) => currency.format(v).replace("$", "")} />
        <Tooltip cursor={{ fill: "#18181b" }} content={<TooltipContent />} />
        <Bar dataKey="value" radius={10} fill="#f43f5e" />
      </BarChart>
    </ResponsiveContainer>
  );
}

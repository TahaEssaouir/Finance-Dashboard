"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usePreferences } from "@/providers/PreferencesProvider";

const currencyFormatters = {
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
  MAD: new Intl.NumberFormat("ar-MA", { style: "currency", currency: "MAD" }),
  EUR: new Intl.NumberFormat("en-EU", { style: "currency", currency: "EUR" }),
};

export interface ExpenseChartDatum {
  name: string;
  value: number;
}

interface ExpenseChartProps {
  data: ExpenseChartDatum[];
}

function TooltipContent({ payload, active, currency }: { payload?: any; active?: boolean; currency: string }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  const formatter = currencyFormatters[currency as keyof typeof currencyFormatters];
  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white shadow-lg">
      <div className="font-semibold">{name}</div>
      <div className="text-emerald-400">{formatter.format(value ?? 0)}</div>
    </div>
  );
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  const { currency } = usePreferences();
  const formatter = currencyFormatters[currency as keyof typeof currencyFormatters];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} tickFormatter={(v) => formatter.format(v).replace(/[$€DH]/, "")} />
        <Tooltip cursor={{ fill: "#18181b" }} content={<TooltipContent currency={currency} />} />
        <Bar dataKey="value" radius={10} fill="#f43f5e" />
      </BarChart>
    </ResponsiveContainer>
  );
}

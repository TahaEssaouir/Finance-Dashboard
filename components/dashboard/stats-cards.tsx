"use client";

import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { usePreferences } from "@/providers/PreferencesProvider";

interface StatsCardsProps {
  balance: number;
  income: number;
  expenses: number;
}

const currencyFormatters = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function StatsCards({ balance, income, expenses }: StatsCardsProps) {
  const { t } = usePreferences();
  const formatter = currencyFormatters;

  return (
    <div className="w-full max-w-sm mx-auto md:max-w-none">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
        {/* Total Balance */}
        <div className="rounded-3xl bg-zinc-900 p-4 md:p-6 border border-zinc-800">
        <div className="flex items-start justify-between mb-4 md:mb-6">
          <h3 className="text-sm md:text-lg text-zinc-400">{t.totalBalance}</h3>
          <div className="rounded-xl bg-emerald-950 p-3">
            <Wallet className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
        <p className="text-2xl md:text-4xl font-bold text-white">{formatter.format(balance)}</p>
      </div>

      {/* Monthly Income */}
      <div className="rounded-3xl bg-zinc-900 p-4 md:p-6 border border-zinc-800">
        <div className="flex items-start justify-between mb-4 md:mb-6">
          <h3 className="text-sm md:text-lg text-zinc-400">{t.monthlyIncome}</h3>
          <div className="rounded-xl bg-emerald-950 p-3">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
        <p className="text-2xl md:text-4xl font-bold text-emerald-500">{formatter.format(income)}</p>
      </div>

      {/* Monthly Expenses */}
      <div className="rounded-3xl bg-zinc-900 p-4 md:p-6 border border-zinc-800">
        <div className="flex items-start justify-between mb-4 md:mb-6">
          <h3 className="text-sm md:text-lg text-zinc-400">{t.monthlyExpenses}</h3>
          <div className="rounded-xl bg-rose-950 p-3">
            <TrendingDown className="h-6 w-6 text-rose-500" />
          </div>
        </div>
        <p className="text-2xl md:text-4xl font-bold text-rose-500">{formatter.format(expenses)}</p>
      </div>
      </div>
    </div>
  );
}

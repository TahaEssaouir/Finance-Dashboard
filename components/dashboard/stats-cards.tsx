import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardsProps {
  balance: number;
  income: number;
  expenses: number;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function StatsCards({ balance, income, expenses }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-6 mb-12">
      {/* Total Balance */}
      <div className="rounded-3xl bg-zinc-900 p-8 border border-zinc-800">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg text-zinc-400">Total Balance</h3>
          <div className="rounded-xl bg-emerald-950 p-3">
            <Wallet className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
        <p className="text-5xl font-bold text-white">{currency.format(balance)}</p>
      </div>

      {/* Monthly Income */}
      <div className="rounded-3xl bg-zinc-900 p-8 border border-zinc-800">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg text-zinc-400">Monthly Income</h3>
          <div className="rounded-xl bg-emerald-950 p-3">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
        <p className="text-5xl font-bold text-emerald-500">{currency.format(income)}</p>
      </div>

      {/* Monthly Expenses */}
      <div className="rounded-3xl bg-zinc-900 p-8 border border-zinc-800">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg text-zinc-400">Monthly Expenses</h3>
          <div className="rounded-xl bg-rose-950 p-3">
            <TrendingDown className="h-6 w-6 text-rose-500" />
          </div>
        </div>
        <p className="text-5xl font-bold text-rose-500">{currency.format(expenses)}</p>
      </div>
    </div>
  );
}

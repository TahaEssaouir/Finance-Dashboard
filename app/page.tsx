"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { usePreferences } from "@/providers/PreferencesProvider";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";

type Transaction = {
  amount: number | null;
  type: "income" | "expense";
  category: string | null;
};

export default function Home() {
  const { t } = usePreferences();
  const [data, setData] = useState<{
    balance: number;
    income: number;
    expenses: number;
    chartData: { name: string; value: number }[];
    hasTransactions: boolean;
  } | null>(null);

  useEffect(() => {
    // Fetch data
    fetch('/api/transactions')
      .then(res => res.json())
      .then(transactions => {
        const incomeTotal = transactions.reduce((sum: number, tx: any) => {
          if (tx.type === "income") {
            return sum + Number(tx.amount || 0);
          }
          return sum;
        }, 0);

        const expenseTotal = transactions.reduce((sum: number, tx: any) => {
          if (tx.type === "expense") {
            return sum + Number(tx.amount || 0);
          }
          return sum;
        }, 0);

        const balance = incomeTotal - expenseTotal;

        const expenseByCategory = transactions.reduce((acc: Record<string, number>, tx: any) => {
          if (tx.type !== "expense") return acc;
          const category = tx.category || "Other";
          acc[category] = (acc[category] || 0) + Number(tx.amount || 0);
          return acc;
        }, {});

        const chartData = Object.entries(expenseByCategory).map(([name, value]) => ({
          name,
          value: value as number,
        }));

        setData({
          balance,
          income: incomeTotal,
          expenses: expenseTotal,
          chartData,
          hasTransactions: transactions.length > 0,
        });
      });
  }, []);

  if (!data) {
    return <Loader />;
  }

  return (
    <DashboardLayout>
        <div className="p-4 lg:p-12 space-y-6 lg:space-y-12">
          {/* Header */}
          <header className="mb-6 lg:mb-16">
            <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  {t.navDashboard}
                </h1>
                <p className="text-zinc-400 mt-2 text-sm lg:text-base">{t.welcomeMessage}</p>
              </div>
            </div>
          </header>

          {/* Stats Cards */}
          <StatsCards balance={data.balance} income={data.income} expenses={data.expenses} />

          {/* Expenses by Category */}
          <div className="rounded-3xl bg-zinc-900 p-8 border border-zinc-800">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">{t.expensesByCategory}</h2>
              <p className="text-lg text-zinc-400">{t.spendingBreakdown}</p>
            </div>
            <div className="h-64">
              {data.hasTransactions ? (
                <ExpenseChart data={data.chartData} />
              ) : (
                <p className="text-zinc-400">{t.noTransactions}</p>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
  );
}

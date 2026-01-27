"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { TransactionActions } from "@/components/transactions/transaction-actions";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { usePreferences } from "@/providers/PreferencesProvider";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Transaction = {
  id: string;
  title: string | null;
  amount: number | null;
  type: "income" | "expense";
  category: string | null;
  date: Date | null;
  createdAt: Date | null;
};

export default function TransactionsPage() {
  const { language, t } = usePreferences();
  const searchParams = useSearchParams();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const locale = language === 'fr' ? 'fr-FR' : 'en-US';
  const currencyCode = language === 'fr' ? 'MAD' : 'USD';

  const currency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  });

  function formatDate(date: Date | null) {
    if (!date) return "N/A";
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getMonthYear(date: Date | null) {
    if (!date) return "Unknown";
    return date.toLocaleString(locale, { month: "long", year: "numeric" });
  }

  function groupTransactionsByMonth(transactions: Transaction[]) {
    const grouped: Record<string, Transaction[]> = {};

    transactions.forEach((tx) => {
      const monthYear = getMonthYear(tx.date);
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(tx);
    });

    return grouped;
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const params = new URLSearchParams(searchParams.toString());
        const response = await fetch(`/api/transactions?${params}`);
        if (response.ok) {
          const data = await response.json();
          const formattedTransactions: Transaction[] = data.map((tx: any) => ({
            id: tx.id,
            title: tx.title,
            amount: tx.amount,
            type: tx.type.toLowerCase() as "income" | "expense",
            category: tx.category,
            date: tx.date ? new Date(tx.date) : null,
            createdAt: tx.createdAt ? new Date(tx.createdAt) : null,
          }));
          setTransactions(formattedTransactions);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [searchParams]);

  const groupedTransactions = groupTransactionsByMonth(transactions);
  const months = Object.keys(groupedTransactions);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-12 space-y-3 md:space-y-6">
          <div className="text-center text-zinc-400">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-12 space-y-3 md:space-y-6">
        {/* Header */}
        <header className="mb-6 lg:mb-16">
          <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                {t.historyTitle}
              </h1>
              <p className="text-zinc-400 mt-2 text-sm lg:text-base">
                {t.historySubtitle}
              </p>
            </div>
            <div className="w-full lg:w-auto">
              <AddTransactionDialog />
            </div>
          </div>
        </header>

        {/* Filters */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-4 lg:p-8">
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4">
            {t.refineResults}
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-6">
            <div className="flex-1">
              <TransactionFilters currentYear={new Date().getFullYear()} />
            </div>
          </div>
        </section>

        <div className="relative my-15 py-4"></div>

        {/* Transactions Grouped by Month */}
        {transactions.length === 0 ? (
          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 lg:p-12 text-center">
            <p className="text-zinc-400 text-base lg:text-lg">{t.noTransactionsYet}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {months.map((month) => (
              <div key={month}>
                {/* Month Heading */}
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">{month}</h2>

                {/* Desktop: Table View */}
                <div className="hidden lg:block rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-800/50">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                            {t.colDate}
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                            {t.colTitle}
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                            {t.colCategory}
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                            {t.colType}
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">
                            {t.colAmount}
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">
                            {t.colActions}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {groupedTransactions[month].map((tx) => (
                          <tr
                            key={tx.id}
                            className="hover:bg-zinc-800/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm text-zinc-300">
                              {formatDate(tx.date)}
                            </td>
                            <td className="px-6 py-4 text-sm text-white font-medium">
                              {tx.title || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-300">
                              {tx.category || t.otherCategory}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={cn("px-2 py-1 text-xs font-medium rounded-full", tx.type === "income" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
                                {tx.type === "income" ? t.typeIncome : t.typeExpense}
                              </span>
                            </td>
                            <td
                              className={cn(
                                "px-6 py-4 text-sm font-semibold text-right",
                                tx.type === "income"
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              )}
                            >
                              {tx.type === "income" ? "+" : "-"}
                              {currency.format(Math.abs(Number(tx.amount || 0)))}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <TransactionActions transaction={tx} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile: Card View */}
                <div className="lg:hidden grid gap-4">
                  {groupedTransactions[month].map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex flex-col gap-3"
                    >
                      {/* Row 1: Header (Title & Actions) */}
                      <div className="flex justify-between items-start">
                        <p className="text-white font-medium truncate flex-1">{tx.title || "N/A"}</p>
                        <TransactionActions transaction={tx} />
                      </div>
                      {/* Row 2: Financials (Amount & Type) */}
                      <div className="flex justify-between items-center">
                        <p className={cn("text-lg font-semibold", tx.type === "income" ? "text-emerald-400" : "text-rose-400")}>
                          {tx.type === "income" ? "+" : "-"}
                          {currency.format(Math.abs(Number(tx.amount || 0)))}
                        </p>
                        <span className={cn("px-2 py-1 text-xs font-medium rounded-full", tx.type === "income" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
                          {tx.type === "income" ? t.typeIncome : t.typeExpense}
                        </span>
                      </div>
                      {/* Row 3: Metadata (Date & Category) */}
                      <div className="flex justify-between items-center text-sm text-zinc-500">
                        <span>{formatDate(tx.date)}</span>
                        <span>{tx.category || t.otherCategory}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
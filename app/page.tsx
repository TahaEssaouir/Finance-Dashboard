import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { supabase } from "@/lib/supabase";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type Transaction = {
  amount: number | null;
  type: "income" | "expense";
  category: string | null;
};

export default async function Home() {
  // Get current month date range
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const monthStart = firstDay.toISOString().split('T')[0];
  const monthEnd = lastDay.toISOString().split('T')[0];

  // Fetch transactions for current month
  const { data, error } = await supabase
    .from("transactions")
    .select("amount, type, category")
    .gte("created_at", monthStart)
    .lte("created_at", monthEnd);

  if (error) {
    throw new Error(error.message);
  }

  const transactions: Transaction[] = data ?? [];

  const incomeTotal = transactions.reduce((sum, tx) => {
    if (tx.type === "income") {
      return sum + Number(tx.amount || 0);
    }
    return sum;
  }, 0);

  const expenseTotal = transactions.reduce((sum, tx) => {
    if (tx.type === "expense") {
      return sum + Number(tx.amount || 0);
    }
    return sum;
  }, 0);

  const balance = incomeTotal - expenseTotal;

  const expenseByCategory = transactions.reduce<Record<string, number>>(
    (acc, tx) => {
      if (tx.type !== "expense") return acc;
      const category = tx.category || "Other";
      acc[category] = (acc[category] || 0) + Number(tx.amount || 0);
      return acc;
    },
    {}
  );

  const chartData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <DashboardLayout>
      <div className="p-4 md:p-12 space-y-6 md:space-y-12">
        {/* Header */}
        <header className="mb-6 md:mb-16">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-zinc-400 mt-2 text-sm md:text-base">Welcome back! Here&apos;s your financial overview.</p>
            </div>
            <div className="w-full md:w-auto">
              <AddTransactionDialog />
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <StatsCards balance={balance} income={incomeTotal} expenses={expenseTotal} />

        {/* Expenses by Category */}
        <div className="rounded-3xl bg-zinc-900 p-8 border border-zinc-800">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Expenses by Category</h2>
            <p className="text-lg text-zinc-400">Monthly spending breakdown</p>
          </div>
          <div className="h-64">
            <ExpenseChart data={chartData} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

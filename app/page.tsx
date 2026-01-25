import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { prisma } from "@/lib/prisma";
import { currentUser } from '@clerk/nextjs/server';

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
  const user = await currentUser()
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Welcome to Finance Dashboard</h1>
          <p className="text-zinc-400 mb-6">Please sign in to access your financial data.</p>
          <a href="/sign-in" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  const userId = user.id

  // Fetch transactions for the current user
  const fetchedTransactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' }
  });

  const transactions: Transaction[] = fetchedTransactions.map(tx => ({
    amount: tx.amount,
    type: tx.type.toLowerCase() as "income" | "expense",
    category: tx.category
  }));

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
        <div className="p-4 lg:p-12 space-y-6 lg:space-y-12">
          {/* Header */}
          <header className="mb-6 lg:mb-16">
            <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-zinc-400 mt-2 text-sm lg:text-base">Welcome back! Here&apos;s your financial overview.</p>
              </div>
              <div className="flex items-center gap-4 w-full lg:w-auto">
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
              <p className="text-lg text-zinc-400">Spending breakdown</p>
            </div>
            <div className="h-64">
              {transactions.length === 0 ? (
                <p className="text-zinc-400">No transactions found</p>
              ) : (
                <ExpenseChart data={chartData} />
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
  );
}

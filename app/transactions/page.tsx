import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { TransactionActions } from "@/components/transactions/transaction-actions";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import { currentUser } from '@clerk/nextjs/server'; 

type Transaction = {
  id: string;
  title: string | null;
  amount: number | null;
  type: "income" | "expense";
  category: string | null;
  date: Date | null;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatDate(date: Date | null) {
  if (!date) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getMonthYear(date: Date | null) {
  if (!date) return "Unknown";
  // 👇 Hna hya lmohimma: bddl "default" b "en-US"
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
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

function TypeBadge({ type }: { type: "income" | "expense" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
        type === "income"
          ? "bg-emerald-950 text-emerald-400"
          : "bg-rose-950 text-rose-400"
      )}
    >
      {type === "income" ? "Income" : "Expense"}
    </span>
  );
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; query?: string; category?: string; date?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const userId = user.id;

  // Await searchParams
  const params = await searchParams;
  
  const currentYear = new Date().getFullYear();
  const MIN_YEAR = 2023;
  
  // Extract filter parameters
  const query = params.query || "";
  const category = params.category || "";
  const date = params.date || "";

  // Parse and validate year
  let selectedYear = currentYear;
 if (params.year) {
    const parsedYear = parseInt(params.year);
    
    // Validate year range
    if (isNaN(parsedYear)) {
      // Ila ktb chi tkherbi9a f URL -> rj3o l current year
      redirect(`/transactions?year=${currentYear}`);
    }
    
    if (parsedYear > currentYear) {
      // Ila fat lwa9t -> rj3o l current year (bla crash)
      redirect(`/transactions?year=${currentYear}`);
    }
    
    if (parsedYear < MIN_YEAR) {
      // Ila rj3 lor bzaf -> rj3o l a9dam 3am msmou7 bih
      redirect(`/transactions?year=${MIN_YEAR}`);
    }
    
    selectedYear = parsedYear;
  }

  const yearStart = new Date(`${selectedYear}-01-01`);
  const yearEnd = new Date(`${selectedYear}-12-31`);

  // Build where clause
  const where: any = {
    userId,
    date: {
      gte: yearStart,
      lte: yearEnd
    }
  };

  if (query) {
    where.title = { contains: query, mode: 'insensitive' };
  }

  if (category && category !== "All Categories") {
    where.category = category;
  }

  if (date) {
    where.date = {
      gte: new Date(`${date}T00:00:00`),
      lte: new Date(`${date}T23:59:59`)
    };
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' }
  });
  const groupedTransactions = groupTransactionsByMonth(transactions);
  const months = Object.keys(groupedTransactions);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-12 space-y-3 md:space-y-6">
        {/* Header */}
        <header className="mb-6 lg:mb-16">
          <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Transactions History
              </h1>
              <p className="text-zinc-400 mt-2 text-sm lg:text-base">
                Track, filter, and manage your financial activity.
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
            Refine Results
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-6">
            <div className="flex-1">
              <TransactionFilters currentYear={selectedYear} />
            </div>
          </div>
        </section>

      <div className="relative my-15 py-4">
              
               
              </div>

        {/* Transactions Grouped by Month */}
        {transactions.length === 0 ? (
          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 lg:p-12 text-center">
            <p className="text-zinc-400 text-base lg:text-lg">No transactions yet. Start by adding one!</p>
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
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                            Title
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                            Category
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                            Type
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">
                            Actions
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
                              {tx.category || "Other"}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={cn("px-2 py-1 text-xs font-medium rounded-full", tx.type === "income" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
                                {tx.type === "income" ? "Income" : "Expense"}
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
                          {tx.type === "income" ? "Income" : "Expense"}
                        </span>
                      </div>
                      {/* Row 3: Metadata (Date & Category) */}
                      <div className="flex justify-between items-center text-sm text-zinc-500">
                        <span>{formatDate(tx.date)}</span>
                        <span>{tx.category || "Other"}</span>
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
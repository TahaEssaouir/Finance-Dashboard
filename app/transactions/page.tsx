import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { TransactionActions } from "@/components/transactions/transaction-actions";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { YearSelector } from "@/components/transactions/year-selector";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation"; 

type Transaction = {
  id: number;
  title: string | null;
  amount: number | null;
  type: "income" | "expense";
  category: string | null;
  created_at: string | null;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatDate(dateString: string | null) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getMonthYear(dateString: string | null) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "long", year: "numeric" });
}

function groupTransactionsByMonth(transactions: Transaction[]) {
  const grouped: Record<string, Transaction[]> = {};
  
  transactions.forEach((tx) => {
    const monthYear = getMonthYear(tx.created_at);
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

  const yearStart = `${selectedYear}-01-01`;
  const yearEnd = `${selectedYear}-12-31`;

  // Build query with filters
  let queryBuilder = supabase
    .from("transactions")
    .select("id, title, amount, type, category, created_at")
    .gte("created_at", yearStart)
    .lte("created_at", yearEnd);
  
  // Apply filters
  if (query) {
    queryBuilder = queryBuilder.ilike("title", `%${query}%`);
  }
  
  if (category && category !== "All Categories") {
    queryBuilder = queryBuilder.eq("category", category);
  }
  
  if (date) {
    queryBuilder = queryBuilder.gte("created_at", `${date}T00:00:00`)
                               .lte("created_at", `${date}T23:59:59`);
  }
  
  const { data, error } = await queryBuilder.order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const transactions: Transaction[] = data ?? [];
  const groupedTransactions = groupTransactionsByMonth(transactions);
  const months = Object.keys(groupedTransactions);

  return (
    <DashboardLayout>
      <div className="p-12 space-y-12">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Transactions History
              </h1>
              <p className="text-zinc-400 mt-2">
                Track, filter, and manage your financial activity.
              </p>
            </div>
            <AddTransactionDialog />
          </div>
        </header>

        {/* Filters */}
        <section className="rounded-2xl border border-emerald-500/10 bg-emerald-950/40 backdrop-blur-xl p-6 shadow-2xl">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-4">
            Refine Results
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <YearSelector currentYear={selectedYear} />
            <TransactionFilters />
          </div>
        </section>

        {/* Transactions Grouped by Month */}
        {transactions.length === 0 ? (
          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-12 text-center">
            <p className="text-zinc-400 text-lg">No transactions yet. Start by adding one!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {months.map((month) => (
              <div key={month}>
                {/* Month Heading */}
                <h2 className="text-3xl font-bold text-white mb-4">{month}</h2>
                
                {/* Month Table */}
                <div className="rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden">
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
                              {formatDate(tx.created_at)}
                            </td>
                            <td className="px-6 py-4 text-sm text-white font-medium">
                              {tx.title || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-300">
                              {tx.category || "Other"}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <TypeBadge type={tx.type} />
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
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
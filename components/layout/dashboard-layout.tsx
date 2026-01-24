"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Menu, TrendingUp, LayoutDashboard, CreditCard, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Transactions", href: "/transactions", icon: CreditCard },
  { title: "Settings", href: "/settings", icon: Settings },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full flex-col md:flex-row bg-black">
      {/* Mobile Top Navbar (md:hidden) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 w-full bg-black border-b border-zinc-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">FinFlow</span>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button
              aria-label="Open menu"
              className="inline-flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-800/60 p-2 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-zinc-900 border-r border-zinc-800 p-0">
            {/* Sheet Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">FinFlow</span>
              </div>
              <SheetClose className=" text-red-500 p-2 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors">
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </SheetClose>
            </div>

            {/* Sheet Navigation */}
            <nav className="flex flex-col">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-6 py-4 border-b border-zinc-900 text-lg font-medium transition-colors",
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-white hover:bg-zinc-900/50"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar (hidden md:flex) */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-y-auto pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}

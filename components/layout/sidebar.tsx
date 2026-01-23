"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, CreditCard, Settings, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Transactions",
    icon: CreditCard,
    href: "/transactions",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-screen bg-zinc-900 text-white border-r border-zinc-800 transition-all duration-300 overflow-hidden flex-shrink-0",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="relative flex h-full flex-col">
        {/* Toggle Button */}
        <button
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setIsCollapsed((v) => !v)}
          className="absolute top-4 right-2 inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/60 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
        {/* Logo */}
        <div className={cn("flex items-center gap-3 px-6 py-8", isCollapsed && "justify-center")}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-2xl font-bold">FinFlow</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="px-4">
          <ul className="space-y-2">
            {menuItems
              .filter((item) => item.title !== "Settings")
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-xl px-6 py-4 text-base font-medium transition-colors",
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white",
                        isCollapsed ? "justify-center gap-0 px-0" : "gap-3"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        {/* Settings at bottom */}
        <div className="mt-auto px-4">
          {menuItems
            .filter((item) => item.title === "Settings")
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "mb-4 flex items-center rounded-xl px-6 py-4 text-base font-medium transition-colors",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white",
                    isCollapsed ? "justify-center gap-0 px-0" : "gap-3"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
        </div>

        {/* Footer */}
        <div className="px-6 py-6">
          <p className="text-sm text-zinc-500">© 2024 FinFlow</p>
        </div>
      </div>
    </aside>
  );
}

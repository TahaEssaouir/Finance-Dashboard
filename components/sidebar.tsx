"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, Settings, TrendingUp } from "lucide-react";
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

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-80 bg-zinc-950 text-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold">FinFlow</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-6 py-4 text-base font-medium transition-colors",
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-6 py-6">
          <p className="text-sm text-zinc-500">© 2024 FinFlow</p>
        </div>
      </div>
    </aside>
  );
}

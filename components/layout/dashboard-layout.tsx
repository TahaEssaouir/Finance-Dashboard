import { ReactNode } from "react";
import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <div className="ml-80">
        <main className="h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

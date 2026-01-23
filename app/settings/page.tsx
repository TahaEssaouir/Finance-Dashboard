import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">Settings</h1>
          <p className="text-xl text-zinc-400">Manage your account and preferences.</p>
        </header>

        {/* Content */}
        <div className="rounded-3xl bg-zinc-900 p-8 border border-zinc-800">
          <p className="text-zinc-400">Your settings options will appear here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

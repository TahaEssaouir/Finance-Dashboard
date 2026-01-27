"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePreferences } from "@/providers/PreferencesProvider";
import { deleteUserTransactions } from "@/lib/actions";

export default function SettingsPage() {
  const { language, setLanguage, theme, toggleTheme, t } = usePreferences();

  const handleExport = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const transactions = await response.json();

      // Convert to CSV
      const headers = ['Title', 'Amount', 'Type', 'Category', 'Date'];
      const csvContent = 'sep=,\n' + [
        headers.join(','),
        ...transactions.map((tx: any) => [
          `"${tx.title}"`,
          tx.amount,
          tx.type,
          `"${tx.category}"`,
          new Date(tx.date).toLocaleDateString()
        ].join(','))
      ].join('\n');

      // Download
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Transactions exported successfully!');
    } catch (error) {
      alert('Failed to export transactions');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all your transactions? This action cannot be undone.')) {
      return;
    }

    const result = await deleteUserTransactions();
    if (result.success) {
      alert('All transactions deleted successfully!');
    } else {
      alert(result.message || 'Failed to delete transactions');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{t.preferencesTitle}</h1>
          <p className="text-lg text-zinc-400">{t.settingsSubtitle}</p>
        </header>

        {/* Preferences Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">{t.preferencesTitle}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Language */}
            <div className="rounded-xl bg-zinc-800 p-6 border border-zinc-700">
              <Label htmlFor="language" className="text-sm font-medium text-zinc-300 mb-2 block">
                {t.languageLabel}
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-zinc-900 border-zinc-600 text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-600">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Theme */}
            <div className="rounded-xl bg-zinc-800 p-6 border border-zinc-700">
              <Label className="text-sm font-medium text-zinc-300 mb-2 block">
                {t.themeLabel}
              </Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-zinc-400">Light</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={theme === "dark"}
                    onChange={toggleTheme}
                  />
                  <div className="w-11 h-6 bg-zinc-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
                <span className="text-sm text-zinc-400">Dark</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">{t.dataManagementTitle}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Export Data */}
            <div className="rounded-xl bg-zinc-800 p-6 border border-zinc-700">
              <h3 className="text-lg font-medium text-white mb-2">{t.exportTitle}</h3>
              <p className="text-sm text-zinc-400 mb-4">
                {t.exportDescription}
              </p>
              <Button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {t.exportButton}
              </Button>
            </div>

            {/* Delete All */}
            <div className="rounded-xl bg-zinc-800 p-6 border border-zinc-700">
              <h3 className="text-lg font-medium text-white mb-2">{t.deleteTitle}</h3>
              <p className="text-sm text-zinc-400 mb-4">
                {t.deleteDescription}
              </p>
              <Button onClick={handleDeleteAll} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                {t.deleteButton}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

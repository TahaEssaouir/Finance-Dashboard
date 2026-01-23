"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTransaction } from "@/lib/actions";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Housing",
  "Transport",
  "Food",
  "Salary",
  "Freelance",
  "Other",
];

interface Transaction {
  id: number;
  title: string | null;
  amount: number | null;
  type: "income" | "expense";
  category: string | null;
  created_at: string | null;
}

interface EditTransactionDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({
  transaction,
  open,
  onOpenChange,
}: EditTransactionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: transaction.title || "",
    amount: transaction.amount?.toString() || "",
    type: transaction.type,
    category: transaction.category || "Other",
    date: transaction.created_at?.split("T")[0] || "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formDataObj = new FormData();
    formDataObj.append("id", transaction.id.toString());
    formDataObj.append("title", formData.title);
    formDataObj.append("amount", formData.amount);
    formDataObj.append("type", formData.type);
    formDataObj.append("category", formData.category);
    formDataObj.append("date", formData.date);

    const result = await updateTransaction(formDataObj);

    if (result.success) {
      onOpenChange(false);
    } else if (result.errors) {
      setErrors(result.errors);
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border border-zinc-800 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Edit Transaction
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Update your transaction details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-300">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Transaction name"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={cn(
                "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500",
                errors.title && "border-rose-500"
              )}
            />
            {errors.title && (
              <p className="text-sm text-rose-500">{errors.title[0]}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-zinc-300">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className={cn(
                "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500",
                errors.amount && "border-rose-500"
              )}
            />
            {errors.amount && (
              <p className="text-sm text-rose-500">{errors.amount[0]}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-zinc-300">
              Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value as "income" | "expense" })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem
                  value="income"
                  className="text-emerald-500 hover:text-emerald-400 focus:bg-zinc-700"
                >
                  Income
                </SelectItem>
                <SelectItem
                  value="expense"
                  className="text-rose-500 hover:text-rose-400 focus:bg-zinc-700"
                >
                  Expense
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-rose-500">{errors.type[0]}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-zinc-300">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {CATEGORIES.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="text-zinc-200 hover:text-white focus:bg-zinc-700"
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-rose-500">{errors.category[0]}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-zinc-300">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            {errors.date && (
              <p className="text-sm text-rose-500">{errors.date[0]}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {loading ? "Updating..." : "Update Transaction"}
            </Button>
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

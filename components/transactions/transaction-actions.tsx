"use client";

import { useState } from "react";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { EditTransactionDialog } from "./edit-transaction-dialog";
import { deleteTransaction } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface Transaction {
  id: number;
  title: string | null;
  amount: number | null;
  type: "income" | "expense";
  category: string | null;
  created_at: string | null;
}

interface TransactionActionsProps {
  transaction: Transaction;
}

export function TransactionActions({ transaction }: TransactionActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteTransaction(transaction.id.toString());
    if (result.success) {
      setDeleteOpen(false);
    }
    setDeleting(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-transparent border-0 hover:bg-teal-900/50 hover:scale-110 transition-all duration-200"
          >
            <MoreHorizontal className="h-4 w-4 text-teal-400 hover:text-teal-300" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-zinc-800 border-zinc-700 text-zinc-100"
        >
          <DropdownMenuItem
            onClick={() => setEditOpen(true)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer",
              "text-blue-400 hover:bg-rose-950 focus:bg-indigo-950 hover:text-white focus:text-white"
            )}
          >
            <Edit2 className="h-4 text-blue-400 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer",
              "text-rose-400 hover:bg-rose-950 focus:bg-rose-950 hover:text-white focus:text-white"
            )}
          >
            <Trash2 className="h-4 text-rose-400 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <EditTransactionDialog
        transaction={transaction}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              Delete Transaction?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg text-sm">
            <p className="text-zinc-300">
              <span className="text-zinc-400">Title:</span> {transaction.title}
            </p>
            <p className="text-zinc-300 mt-1">
              <span className="text-zinc-400">Amount:</span> $
              {transaction.amount}
            </p>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <AlertDialogCancel className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className={cn(
                "bg-rose-600 text-white hover:bg-rose-700",
                deleting && "opacity-50 cursor-not-allowed"
              )}
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

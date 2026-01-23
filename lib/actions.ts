"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabase } from "./supabase";

const transactionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"]),
  category: z.enum([
    "Housing",
    "Transport",
    "Food",
    "Salary",
    "Freelance",
    "Other",
  ]),
  date: z.string().date(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

export async function addTransaction(data: TransactionInput) {
  try {
    const validated = transactionSchema.parse(data);

    const { error } = await supabase.from("transactions").insert([
      {
        title: validated.title,
        amount: validated.amount,
        type: validated.type,
        category: validated.category,
        created_at: validated.date,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/transactions");

    return {
      success: true,
      message: "Transaction added successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error",
        errors: error.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateTransaction(formData: FormData) {
  try {
    const id = formData.get("id");
    const title = formData.get("title");
    const amount = formData.get("amount");
    const type = formData.get("type");
    const category = formData.get("category");
    const date = formData.get("date");

    if (!id) {
      return {
        success: false,
        message: "Transaction ID is required",
      };
    }

    const validated = transactionSchema.parse({
      title,
      amount,
      type,
      category,
      date,
    });

    const { error } = await supabase
      .from("transactions")
      .update({
        title: validated.title,
        amount: validated.amount,
        type: validated.type,
        category: validated.category,
        created_at: validated.date,
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/transactions");

    return {
      success: true,
      message: "Transaction updated successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error",
        errors: error.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteTransaction(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        message: "Transaction ID is required",
      };
    }

    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/transactions");

    return {
      success: true,
      message: "Transaction deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

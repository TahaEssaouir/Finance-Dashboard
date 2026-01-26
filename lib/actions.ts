"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "./prisma";
import { auth } from "@clerk/nextjs/server";

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
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const validated = transactionSchema.parse(data);

    await prisma.transaction.create({
      data: {
        title: validated.title,
        amount: validated.amount,
        type: validated.type,
        category: validated.category,
        date: new Date(validated.date),
        userId: userId,
      },
    });

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
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const type = formData.get("type") as "income" | "expense";
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;

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

    await prisma.transaction.update({
      where: {
        id: id,
        userId: userId, // Ensure user owns the transaction
      },
      data: {
        title: validated.title,
        amount: validated.amount,
        type: validated.type,
        category: validated.category,
        date: new Date(validated.date),
      },
    });

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
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (!id) {
      return {
        success: false,
        message: "Transaction ID is required",
      };
    }

    await prisma.transaction.delete({
      where: {
        id: id,
        userId: userId, // Ensure user owns the transaction
      },
    });

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

export async function deleteUserTransactions() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    await prisma.transaction.deleteMany({
      where: { userId },
    });

    revalidatePath("/");
    revalidatePath("/transactions");

    return {
      success: true,
      message: "All transactions deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

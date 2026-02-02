'use server'

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db"; // <-- Adapti hadi 3la 7ssab fin dayr config dyal DB

type ActionResponse = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createTransaction(formData: any): Promise<ActionResponse> {
  try {
    // 1. Vérifier l-user
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // 2. Enregistrer f Database (Adapti l-code 3la 7ssab Prisma/Supabase)
    // Mital b Prisma:
    await db.transaction.create({
      data: {
        amount: formData.amount,
        type: formData.type, // 'income' wla 'expense'
        category: formData.category,
        title: formData.description,
        date: new Date(formData.date),
        userId: userId,
      },
    });

    // 3. HA L-SIRR !! 🪄
    // Hna kan-goulu l Next.js: "3awd 7seb l-Page d l-Accueil mn 0 DABA!"
    revalidatePath('/'); 
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
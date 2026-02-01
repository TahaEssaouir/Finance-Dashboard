'use server'

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

const transactionSchema = z.object({
  title: z.string().min(1),
  amount: z.coerce.number().positive(),
  type: z.enum(['income', 'expense']),
  category: z.string(),
  date: z.string(),
});

export async function addTransaction(data: any) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = transactionSchema.parse(data);

  await prisma.transaction.create({
    data: {
      title: validated.title,
      amount: validated.amount,
      type: validated.type,
      category: validated.category,
      date: new Date(validated.date),
      userId,
    },
  });

  // Force cache revalidation for relevant routes
  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/transactions');

  return { success: true };
}

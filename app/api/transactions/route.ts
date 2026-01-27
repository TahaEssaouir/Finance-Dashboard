import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const date = searchParams.get('date') || '';

    const currentYear = new Date().getFullYear();
    const MIN_YEAR = 2023;
    let selectedYear = currentYear;

    if (year) {
      const parsedYear = parseInt(year);
      if (!isNaN(parsedYear) && parsedYear <= currentYear && parsedYear >= MIN_YEAR) {
        selectedYear = parsedYear;
      }
    }

    const yearStart = new Date(`${selectedYear}-01-01`);
    const yearEnd = new Date(`${selectedYear}-12-31`);

    // Build where clause
    const where: any = {
      userId,
      date: {
        gte: yearStart,
        lte: yearEnd
      }
    };

    if (query) {
      where.title = { contains: query, mode: 'insensitive' };
    }

    if (category && category !== "All Categories") {
      where.category = category;
    }

    if (date) {
      where.date = {
        gte: new Date(`${date}T00:00:00`),
        lte: new Date(`${date}T23:59:59`)
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
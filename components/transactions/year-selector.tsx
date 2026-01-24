"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearSelectorProps {
  currentYear: number;
}

export function YearSelector({ currentYear }: YearSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startYear = 2023;
  const endYear = new Date().getFullYear() + 1;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => endYear - i
  );

  function handleYearChange(year: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", year);
    router.push(`/transactions?${params.toString()}`);
  }

  return (
    <Select value={currentYear.toString()} onValueChange={handleYearChange}>
      <SelectTrigger className="w-full md:w-[180px] bg-zinc-950 border-zinc-700 text-white hover:bg-zinc-900 hover:text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-zinc-800 border-zinc-700">
        {years.map((year) => (
          <SelectItem
            key={year}
            value={year.toString()}
            className="text-zinc-200 hover:text-white focus:bg-zinc-700"
          >
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

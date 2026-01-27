"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";
import { YearSelector } from "./year-selector";
import { usePreferences } from "@/providers/PreferencesProvider";

const CATEGORIES = [
  "All Categories",
  "Housing",
  "Transport",
  "Food",
  "Salary",
  "Freelance",
  "Other",
];

export function TransactionFilters({ currentYear }: { currentYear: number }) {
  const { t } = usePreferences();
  const searchParams = useSearchParams();
  const router = useRouter();


  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");


  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "All Categories") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.replace(`/transactions?${params.toString()}`, { scroll: false });
  };


  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateFilter("query", value);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value); // Update l input dghya
    debouncedSearch(value); // Update URL b t9il
  };

  const handleCategoryChange = (value: string) => {
    updateFilter("category", value);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      updateFilter("date", format(date, "yyyy-MM-dd"));
    } else {
      updateFilter("date", undefined);
    }
  };

  const clearDate = () => {
    updateFilter("date", undefined);
  };

  // Récupérer la date depuis l'URL pour l'affichage
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : undefined;
  const selectedCategory = searchParams.get("category") || "All Categories";

  return (
    <div className="flex flex-col gap-3 w-full xl:flex-row xl:flex-wrap xl:items-end xl:gap-6">
      {/* Year Selector */}
      <div className="w-full xl:w-auto">
        <YearSelector currentYear={currentYear} />
      </div>
      {/* Search Input */}
      <div className="w-full xl:w-[300px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600 hover:bg-zinc-900 hover:text-white w-full"
          />
        </div>
      </div>

      {/* Category Select */}
      <div className="w-full xl:w-[200px]">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="bg-zinc-950 border-zinc-700 text-zinc-500 focus:ring-zinc-600 hover:bg-zinc-900 hover:text-white w-full xl:w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category} className="focus:bg-zinc-700 focus:text-white">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Picker */}
      <div className="flex gap-2 w-full xl:w-auto">
        <Popover>
          
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full xl:w-[200px] justify-start text-left font-normal bg-zinc-950 border-zinc-700 text-white hover:bg-zinc-900 hover:text-white",
                !selectedDate && "text-zinc-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : t.pickDate}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              className="bg-zinc-900 text-white"
            />
          </PopoverContent>
        </Popover>
        
        {selectedDate && (
          <Button
            variant="outline"
            size="icon"
            onClick={clearDate}
            className="bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
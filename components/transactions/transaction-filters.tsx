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
import { useDebouncedCallback } from "use-debounce"; // Ila ma3ndkch: npm i use-debounce

const CATEGORIES = [
  "All Categories",
  "Housing",
  "Transport",
  "Food",
  "Salary",
  "Freelance",
  "Other",
];

export function TransactionFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State ghir bach n-affichiw valeur f l'input (UI only)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");

  // Hada howa l fonction li kybdel URL direct
  // Ma m7tajch useCallback m3a searchParams hna 7it ghadi n3ytoulha direct
  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "All Categories") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.replace(`/transactions?${params.toString()}`, { scroll: false });
  };

  // ✅ DEBOUNCE: Hada howa l fix. 
  // Next.js ma ghadi ybdel URL ta doz 500ms bla ktba.
  // Ila ma3ndkch 'use-debounce', goulha lia n3tik code b 'setTimeout' 3adi.
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
    <div className="flex flex-wrap items-center justify-center gap-4">
      {/* Search Input */}
      <div className="w-[400px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600"
          />
        </div>
      </div>

      {/* Category Select */}
      <div className="w-[200px]">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white focus:ring-zinc-600">
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
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white",
                !selectedDate && "text-zinc-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
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
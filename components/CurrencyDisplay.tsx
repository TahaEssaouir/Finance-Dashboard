"use client";

import { usePreferences } from "@/providers/PreferencesProvider";

const currencyFormatters = {
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
  MAD: new Intl.NumberFormat("ar-MA", { style: "currency", currency: "MAD" }),
  EUR: new Intl.NumberFormat("en-EU", { style: "currency", currency: "EUR" }),
};

interface CurrencyDisplayProps {
  value: number;
}

export function CurrencyDisplay({ value }: CurrencyDisplayProps) {
  const { currency } = usePreferences();
  const formatter = currencyFormatters[currency as keyof typeof currencyFormatters];
  return <span>{formatter.format(value)}</span>;
}
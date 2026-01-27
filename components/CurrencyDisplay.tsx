"use client";

const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

interface CurrencyDisplayProps {
  value: number;
}

export function CurrencyDisplay({ value }: CurrencyDisplayProps) {
  return <span>{currencyFormatter.format(value)}</span>;
}
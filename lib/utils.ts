import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base URL for API calls
 * - Browser: Returns empty string to use relative paths
 * - Vercel: Returns https://{VERCEL_URL}
 * - Local: Returns http://localhost:3000
 */
export function getBaseUrl(): string {
  // Browser should use relative paths
  if (typeof window !== "undefined") {
    return "";
  }
  
  // Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Local development
  return "http://localhost:3000";
}

/**
 * Format currency amount with optional privacy mode
 * @param amount The amount to format
 * @param currency Currency code (e.g., 'USD', 'MAD')
 * @param locale Locale for formatting (e.g., 'en-US', 'fr-FR')
 * @param privacyMode If true, returns masked dots instead of amount
 * @returns Formatted currency string or masked dots
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = 'USD',
  locale: string = 'en-US',
  privacyMode: boolean = false
): string {
  if (privacyMode) {
    return '••••••';
  }

  if (amount === null || amount === undefined) {
    return '—';
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(amount);
  } catch (error) {
    // Fallback if currency code is invalid
    return `${amount.toFixed(2)}`;
  }
}

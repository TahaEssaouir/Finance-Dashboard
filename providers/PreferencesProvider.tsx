"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Currency = "USD" | "MAD" | "EUR";
type Theme = "light" | "dark";

interface PreferencesContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [theme, setThemeState] = useState<Theme>("dark");

  // Load from localStorage on mount
  useEffect(() => {
    const storedCurrency = localStorage.getItem("currency") as Currency;
    const storedTheme = localStorage.getItem("theme") as Theme;
    if (storedCurrency && ["USD", "MAD", "EUR"].includes(storedCurrency)) {
      setCurrencyState(storedCurrency);
    }
    if (storedTheme && ["light", "dark"].includes(storedTheme)) {
      setThemeState(storedTheme);
    }
  }, []);

  // Save to localStorage and apply theme
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    // Apply theme to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Apply initial theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <PreferencesContext.Provider value={{ currency, setCurrency, theme, setTheme }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
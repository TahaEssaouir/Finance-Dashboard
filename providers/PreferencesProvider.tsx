"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Language, getTranslation } from "@/lib/translations";

type Theme = "light" | "dark";

interface PreferencesContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: ReturnType<typeof getTranslation>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("dark");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language;
    const storedTheme = localStorage.getItem("theme") as Theme;
    if (storedLanguage && ["en", "fr"].includes(storedLanguage)) {
      setLanguageState(storedLanguage);
    }
    if (storedTheme && ["light", "dark"].includes(storedTheme)) {
      setThemeState(storedTheme);
    } else {
      // Apply default theme immediately
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsLoaded(true);
  }, []);

  // Apply theme to document when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    // Remove both potential classes first to be safe
    root.classList.remove("light", "dark");
    // Add the selected theme class
    root.classList.add(theme);
    // Persist to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const t = getTranslation(language);

  return (
    <PreferencesContext.Provider value={{ language, setLanguage, theme, toggleTheme, t }}>
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
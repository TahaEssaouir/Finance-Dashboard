"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Language, getTranslation } from "@/lib/translations";

interface PreferencesContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  privacyMode: boolean;
  togglePrivacyMode: () => void;
  t: ReturnType<typeof getTranslation>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [privacyMode, setPrivacyModeState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language;
    const storedPrivacyMode = localStorage.getItem("privacyMode");
    
    if (storedLanguage && ["en", "fr"].includes(storedLanguage)) {
      setLanguageState(storedLanguage);
    }
    
    if (storedPrivacyMode === "true") {
      setPrivacyModeState(true);
    }
    
    setIsLoaded(true);
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const togglePrivacyMode = () => {
    const newPrivacyMode = !privacyMode;
    setPrivacyModeState(newPrivacyMode);
    localStorage.setItem("privacyMode", newPrivacyMode ? "true" : "false");
  };

  const t = getTranslation(language);

  return (
    <PreferencesContext.Provider value={{ language, setLanguage, privacyMode, togglePrivacyMode, t }}>
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
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type FontSize = 'small' | 'medium' | 'large';
type Language = 'ko' | 'en';

interface SettingsContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [language, setLanguageState] = useState<Language>('ko');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedFontSize = localStorage.getItem('fontSize') as FontSize;
    const savedLanguage = localStorage.getItem('language') as Language;
    const savedSidebar = localStorage.getItem('isSidebarOpen');

    if (savedFontSize) setFontSizeState(savedFontSize);
    if (savedLanguage) setLanguageState(savedLanguage);
    if (savedSidebar !== null) setIsSidebarOpen(savedSidebar === 'true');
    setMounted(true);
  }, []);

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('fontSize', size);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const newState = !prev;
      localStorage.setItem('isSidebarOpen', String(newState));
      return newState;
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        fontSize,
        setFontSize,
        language,
        setLanguage,
        isSidebarOpen,
        toggleSidebar,
      }}
    >
      <div
        data-font-size={fontSize}
        className={`contents ${mounted ? '' : 'invisible'}`}
      >
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

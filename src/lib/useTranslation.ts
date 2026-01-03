'use client';

import { useSettings } from './SettingsContext';
import { translations } from './translations';

export function useTranslation() {
  const { language } = useSettings();
  const t = translations[language];
  return { t, language };
}

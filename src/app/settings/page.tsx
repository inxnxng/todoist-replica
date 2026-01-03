'use client';

import NotionSettings from '@/components/NotionSettings';
import { useSettings } from '@/lib/SettingsContext';
import { useTranslation } from '@/lib/useTranslation';
import { Check } from 'lucide-react';

export default function SettingsPage() {
  const { fontSize, setFontSize, language, setLanguage } = useSettings();
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold">{t.settings.title}</h1>
        <p className="mt-1 text-gray-500">{t.settings.desc}</p>
      </header>

      <section className="space-y-6">
        <h2 className="border-b border-gray-100 pb-2 text-lg font-semibold dark:border-gray-800">
          Integrations
        </h2>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
          <h3 className="mb-4 flex items-center gap-2 font-medium">
            <span className="text-xl">N</span>
            Notion Sync
          </h3>
          <NotionSettings />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="border-b border-gray-100 pb-2 text-lg font-semibold dark:border-gray-800">
          {t.settings.display}
        </h2>

        {/* Font Size */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.settings.fontSize}
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setFontSize('small')}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${fontSize === 'small' ? 'border-primary ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <span className="text-xs">Aa</span>
              <span>{t.settings.small}</span>
              {fontSize === 'small' && (
                <Check size={16} className="text-primary" />
              )}
            </button>
            <button
              onClick={() => setFontSize('medium')}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-base transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${fontSize === 'medium' ? 'border-primary ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <span className="text-base">Aa</span>
              <span>{t.settings.medium}</span>
              {fontSize === 'medium' && (
                <Check size={16} className="text-primary" />
              )}
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${fontSize === 'large' ? 'border-primary ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <span className="text-lg">Aa</span>
              <span>{t.settings.large}</span>
              {fontSize === 'large' && (
                <Check size={16} className="text-primary" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500">{t.settings.fontSizeDesc}</p>
        </div>

        {/* Language */}
        <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.settings.language}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setLanguage('ko')}
              className={`flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${language === 'ko' ? 'border-primary ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🇰🇷</span>
                <span>한국어</span>
              </div>
              {language === 'ko' && (
                <Check size={16} className="text-primary" />
              )}
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${language === 'en' ? 'border-primary ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🇺🇸</span>
                <span>English</span>
              </div>
              {language === 'en' && (
                <Check size={16} className="text-primary" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500">{t.settings.languageDesc}</p>
        </div>
      </section>
    </div>
  );
}

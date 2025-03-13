'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import de from './locales/de';
import en from './locales/en';

// Konfigurieren Sie i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: {
        translation: de,
      },
      en: {
        translation: en,
      },
    },
    fallbackLng: 'de',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
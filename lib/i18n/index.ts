import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import pl from './locales/pl.json';
import es from './locales/es.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';
import tw from './locales/tw.json';

const resources = {
  en: { translation: en },
  pl: { translation: pl },
  es: { translation: es },
  de: { translation: de },
  ja: { translation: ja },
  zh: { translation: zh },
  tw: { translation: tw },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
// import translationEN from './messages/en/index.json'; // Commented out for Spanish-only MVP
import translationES from './messages/es/index.json';

// Resources object with translations
const resources = {
  // en: {                           // Commented out for Spanish-only MVP
  //   translation: translationEN
  // },
  es: {
    translation: translationES
  }
};

i18n
  // Load translations using http backend
  .use(Backend)
  // Detect user language - force Spanish for MVP
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    debug: true,
    resources,
    fallbackLng: 'es', // Spanish as fallback
    lng: 'es', // Default language
    // Force Spanish only for MVP
    supportedLngs: ['es'],
    // Disable language detection for MVP
    detection: {
      order: ['navigator'],
      caches: [],
    },
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

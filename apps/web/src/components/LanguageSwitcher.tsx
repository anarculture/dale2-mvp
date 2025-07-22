import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  
  const changeLanguage = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('es')}
        className={`text-sm px-2 py-1 rounded ${
          i18n.language === 'es' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`text-sm px-2 py-1 rounded ${
          i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;

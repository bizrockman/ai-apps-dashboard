import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'de' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      title={i18n.language === 'en' ? 'Switch to German' : 'Zu Englisch wechseln'}
    >
      <Languages className="h-4 w-4" />
      <span>{i18n.language.toUpperCase()}</span>
    </button>
  );
};

export default LanguageSwitcher;
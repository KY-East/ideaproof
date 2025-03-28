'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });
  const [isOpen, setIsOpen] = useState(false);
  
  // Find current language
  const currentLanguage = languages.find(
    (lang) => lang.code === language
  ) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
    setIsOpen(false);
    
    // Save language preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', languageCode);
      // Refresh the page to apply the new language
      router.refresh();
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-slate-800 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500"
          id="language-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentLanguage.name}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-700 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="py-1" role="none">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`${
                  language.code === currentLanguage.code
                    ? 'bg-slate-700 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                } group flex items-center w-full px-4 py-2 text-sm`}
                role="menuitem"
                onClick={() => handleLanguageChange(language.code)}
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 
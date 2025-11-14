// app/components/LocaleSwitcher.js
'use client';

import { useTranslation } from 'react-i18next';

export function LocaleSwitcher() {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;

    const languages = [
        { code: 'ua', label: 'UA' },
        { code: 'en', label: 'EN' },
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex w-full justify-center rounded-lg bg-gray-200 dark:bg-gray-700 p-1 space-x-1">
            {languages.map((lang) => {
                const isActive = currentLang.startsWith(lang.code); // .startsWith для ('en-US')
                return (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors
              ${
                            isActive
                                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                        }
            `}
                    >
                        {lang.label}
                    </button>
                );
            })}
        </div>
    );
}
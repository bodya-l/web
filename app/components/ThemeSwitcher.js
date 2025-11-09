// This is a file representation.
// You can directly edit, format, and save this code.
// Your changes will be reflected in the user's view.

'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation();

    // Потрібно, щоб уникнути помилки гідратації на сервері
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Рендеримо "заглушку" на сервері
        return (
            <div className="flex w-full justify-center rounded-lg bg-gray-200 p-1">
                <div className="h-8 w-full rounded-md px-3 py-1.5" />
            </div>
        );
    }

    const themes = [
        { name: 'light', label: t('theme_switcher.light'), icon: Sun },
        { name: 'dark', label: t('theme_switcher.dark'), icon: Moon },
        { name: 'system', label: t('theme_switcher.system'), icon: Monitor },
    ];

    return (
        <div className="flex w-full justify-center rounded-lg bg-gray-200 dark:bg-gray-700 p-1 space-x-1">
            {themes.map((tItem) => {
                const Icon = tItem.icon;
                const isActive = theme === tItem.name;
                return (
                    <button
                        key={tItem.name}
                        onClick={() => setTheme(tItem.name)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors
              ${
                            isActive
                                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                        }
            `}
                    >
                        <Icon size={16} />
                        {tItem.label}
                    </button>
                );
            })}
        </div>
    );
}

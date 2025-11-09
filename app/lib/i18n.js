// This is a file representation.
// You can directly edit, format, and save this code.
// Your changes will be reflected in the user's view.

'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpApi) // Завантажує переклади з /public/locales
    .use(LanguageDetector) // Вфизначає мову браузера/cookie
    .use(initReactI18next) // Підключає до React
    .init({
        supportedLngs: ['ua', 'en'], // Мови, які ви підтримуєте
        fallbackLng: 'ua', // Мова за замовчуванням
        debug: false, // Встановіть true, щоб бачити логи

        // Налаштування для LanguageDetector
        detection: {
            order: ['cookie', 'localStorage', 'navigator'],
            caches: ['cookie'], // Зберігати вибір у cookie
        },

        // Налаштування для HttpApi
        backend: {
            loadPath: '/locales/{{lng}}/translation.json', // Шлях до файлів перекладу
        },

        react: {
            useSuspense: false, // Можна змінити на true, якщо використовуєте Suspense
        },
    });

export default i18n;

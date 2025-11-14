// app/layout.js
'use client'; // 👈 ВАЖЛИВО: Зробити layout клієнтським

import './globals.css';
import Providers from './providers';
import { useTranslation } from 'react-i18next'; // 👈 Імпортувати
import './lib/i18n'; // 👈 Переконайтеся, що i18n ініціалізується тут

// Metadata тепер не може бути статичним об'єктом у 'use client' файлі.
// Вам потрібно буде перенести це в `page.js` або використовувати `generateMetadata`
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata

// export const metadata = { ... }; // 👈 ЦЕ ТРЕБА ВИДАЛИТИ ЗВІДСИ

export default function RootLayout({ children }) {
    const { i18n } = useTranslation(); // 👈 Отримати стан i18n

    return (
        // 👇 Динамічно встановлюємо мову
        <html lang={i18n.language} suppressHydrationWarning={true}>
        <body className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 antialiased">
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
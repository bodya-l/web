// app/layout.js

import './globals.css';
// 1. ▼▼▼ ІМПОРТУЄМО НАШ НОВИЙ ПРОВАЙДЕР ▼▼▼
import AuthProvider from './components/AuthProvider';

export const metadata = {
    title: 'NAZVA - Гейміфіковане меню',
    description: 'Вхід для кастомерів та власників',
};

export default function RootLayout({ children }) {
    return (
        <html lang="uk" suppressHydrationWarning={true}>
            <body>
                {/* 2. ▼▼▼ ОГОРТАЄМО {children} У ПРОВАЙДЕР ▼▼▼ */}
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
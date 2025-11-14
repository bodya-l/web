// app/providers.js
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
// 💡 ШЛЯХ: Виправлено на відносний './lib/i18n' (з вашого логу помилок)
import './lib/i18n'; // 👈 Цей імпорт робить всю роботу
import { CartProvider } from '@/context/CartContext';

export default function Providers({ children }) {
    // ❌ Порожній useEffect можна видалити
    // useEffect(() => {
    //     // Ефект, щоб i18n ініціалізувався на клієнті
    // }, []);

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </SessionProvider>
        </ThemeProvider>
    );
}
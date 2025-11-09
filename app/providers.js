// This is a file representation.
// You can directly edit, format, and save this code.
// Your changes will be reflected in the user's view.

'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
// 💡 ШЛЯХ: Виправлено на відносний './lib/i18n' (з вашого логу помилок)
import './lib/i18n';
import { CartProvider } from '@/context/CartContext';

export default function Providers({ children }) {
    useEffect(() => {
        // Ефект, щоб i18n ініціалізувався на клієнті
    }, []);

    return (
        // ThemeProvider (зовнішній)
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider>
                {/* CartProvider має бути всередині SessionProvider */}
                <CartProvider>
                    {children}
                </CartProvider>
            </SessionProvider>
        </ThemeProvider>
    );
}

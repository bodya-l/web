// app/layout.js
import './globals.css';
import Providers from './providers';
// ▼▼▼ ВИПРАВЛЕНО ШЛЯХ: Використовуємо абсолютний шлях для CartProvider ▼▼▼
import { CartProvider } from '@/context/CartContext';
// ▲▲▲ ▲▲▲ ▲▲▲

export const metadata = {
    title: 'NAZVA - Гейміфіковане меню',
    description: 'Вхід для кастомерів та власників',
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="uk" suppressHydrationWarning={true}>
        <body className="bg-gray-50 text-gray-800 antialiased"> {/* Базові стилі Tailwind */}
        
        {/* NextAuth Providers */}
        <Providers>
            {/* CartProvider */}
            <CartProvider>
                {children}
            </CartProvider>
        </Providers>
        
        </body>
        </html>
    );
}
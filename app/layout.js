import './globals.css';
import Providers from './providers';
// import { CartProvider } from '@/context/CartContext'; // Цей імпорт більше не потрібен тут


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
        // suppressHydrationWarning важливий для next-themes
        <html lang="uk" suppressHydrationWarning={true}>
        {/* Класи для світлого та темного режиму на body */}
        <body className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 antialiased">

        <Providers>
            {/* CartProvider вже обгорнутий всередині Providers.js, тому тут його немає */}
            {children}
        </Providers>

        </body>
        </html>
    );
}
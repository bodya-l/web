// components/Header.tsx
import React from 'react';
import Link from 'next/link'; // ⬅️ Імпортуємо компонент Link

// 1. Визначення Інтерфейсу Props (залишається без змін)
interface HeaderProps {
  restaurantName: string;
  description: string;
  address: string;
}

// 2. Використання React.FC та Інтерфейсу
const Header: React.FC<HeaderProps> = ({ restaurantName, description, address }) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6 py-3 flex justify-between items-center">
        
        {/* Логотип/Інформація: Обгортаємо у Link */}
        {/* href="/" вказує на кореневий маршрут (ваша сторінка "Menu primary") */}
        <Link href="../primary_home" passHref legacyBehavior> 
            {/* Додаємо стилі, щоб показати, що це клікабельний елемент */}
            <div className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity">
                {/* Аватар/Логотип */}
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    {/* Тут може бути IMG або SVG логотип */}
                </div>
                
                {/* Інформація */}
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">{restaurantName}</h1>
                    <p className="text-sm text-gray-500">{description}</p>
                    <p className="text-sm text-gray-500">{address}</p>
                </div>
            </div>
        </Link>

        {/* Права частина: Іконки (Кошик та Користувач) - залишається без змін */}
        <div className="flex items-center space-x-4">
          
          {/* Іконка Кошика */}
          <button 
            className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Кошик"
          >
            <svg /* ... SVG Кошика ... */ className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </button>

          {/* Іконка Користувача */}
          <button 
            className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Профіль користувача"
          >
            <svg /* ... SVG Користувача ... */ className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c4.418 0 8 1.79 8 4v2H4v-2c0-2.21 3.582-4 8-4z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
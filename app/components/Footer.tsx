// components/Footer.tsx
import React from 'react';
import Link from 'next/link'; // Не забувайте імпортувати Link, якщо використовуєте якірні посилання

<style>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Great+Vibes&family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Pacifico&display=swap');
</style>


const Footer: React.FC = () => (
  <footer className="bg-white border-t border-gray-100 mt-12 pt-8 pb-12">
    <div className="container mx-auto px-4 max-w-7xl ">
        
        {/* ⬅️ ВИПРАВЛЕННЯ: Змінено 'grid-col-12' на 'grid-cols-12' */}
        {/* ⬅️ ДОДАНО: 'grid-cols-1' для мобільних та 'md:' для десктопу */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-x-12"> 
            
            {/* Верхній рядок футера (Breadcrumb) */}
            {/* ⬅️ col-span-3 працює лише з префіксом 'md:' */}
            <div className="mb-8 md:col-span-3"> 
                <h3 className="text-lg font-bold text-[#1EAA3F]">Breadcrumb</h3>
                <p className="text-gray-500 text-sm">Смак починається з меню</p>
            </div>

            {/* Основні колонки футера */}
            {/* ⬅️ col-span-9 працює лише з префіксом 'md:' */}
            <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8">
                
                {/* 1. Продукт */}
                {/* ... (ваш контент) ... */}
                <div>
                    <h4 className="font-semibold mb-3 text-gray-800">Продукт</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><a href="#" className="hover:text-green-600 transition-colors">Про нас</a></li>
                        <li><a href="#" className="hover:text-green-600 transition-colors">QR код</a></li>
                        <li><a href="#" className="hover:text-green-600 transition-colors">Система</a></li>
                    </ul>
                </div>
                
                {/* 2. Партнерство */}
                {/* ... (ваш контент) ... */}
                <div>
                    <h4 className="font-semibold mb-3 text-gray-800">Партнерство</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><a href="#" className="hover:text-green-600 transition-colors">Підписка</a></li>
                        <li><a href="#" className="hover:text-green-600 transition-colors">Підключення</a></li>
                        <li><a href="/partners" className="hover:text-green-600 transition-colors">Партнери</a></li>
                    </ul>
                </div>
                
                {/* 3. Контакти */}
                {/* ... (ваш контент) ... */}
                <div>
                    <h4 className="font-semibold mb-3 text-gray-800">Контакти</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>
                        <a href="https://instagram.com" className="flex items-center hover:text-green-600 transition-colors">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1200px-Instagram_icon.png" alt="p" className='h-5 mr-2'/> Instagram
                        </a>
                        </li>
                        <li>
                        <a href="https://t.me/" className="flex items-center hover:text-green-600 transition-colors">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1200px-Telegram_logo.svg.png" alt="" className='h-5 mr-2'/> Telegram
                        </a>
                        </li>
                        <li>
                        <a href="tel:+380661614886" className="flex items-center hover:text-green-600 transition-colors">
                            <img src="https://icons.veryicon.com/png/o/miscellaneous/yunrenui-original-ui-of-fool-cloud/phone-circle.png" alt="" className='h-5 mr-2'/>+380 66 161 4886
                        </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  </footer>
);

export default Footer;
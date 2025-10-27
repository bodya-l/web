// app/components/RestaurantCard.js
'use client';

import Link from 'next/link';
import Image from 'next/image';

// Припускаємо, що цей тип приходить з API /api/partners/
/**
 * @typedef {object} RestaurantPreview
 * @property {number} id
 * @property {string} name
 * @property {string} [description]
 * @property {string} [address]
 * @property {string} [logoUrl]
 * @property {string} [bannerUrl]
 * @property {number} [stars]
 */

// Компонент зірок
const StarRating = ({ rating }) => {
    const stars = [];
    const maxStars = 5;
    for (let i = 1; i <= maxStars; i++) {
        // Використовуємо округлення до половини зірки, якщо потрібно (або просто цілі зірки)
        const isFilled = i <= Math.round(rating); 
        stars.push(
            <svg key={i} className={`w-4 h-4 ${isFilled ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.071 3.292a1 1 0 00.95.695h3.46c.969 0 1.371 1.24.588 1.81l-2.8 2.031a1 1 0 00-.364 1.118l1.071 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.031a1 1 0 00-1.176 0l-2.8 2.031c-.784.57-1.84-.197-1.54-1.118l1.071-3.292a1 1 0 00-.364-1.118l-2.8-2.031c-.783-.57-.381-1.81.588-1.81h3.46a1 1 0 00.95-.695l1.07-3.292z" />
            </svg>
        );
    }
    return <div className="flex">{stars}</div>;
};

// ❗️ .js: Додайте JSDoc для пропсів
/**
 * @param {object} props
 * @param {RestaurantPreview} props.restaurant
 */
export default function RestaurantCard({ restaurant }) {
    
    // Заглушки
    const defaultBanner = '/images/default_banner.jpg'; 
    const defaultLogo = '/images/default_logo.png'; 
    // Використовуємо реальні зірки або заглушку (наприклад, 4.0)
    const rating = restaurant.stars || 4.0; 

    return (
        // Обгортка Link для переходу
        // ⬅️ ВИПРАВЛЕННЯ: Додано зовнішній відступ mb-8
        <Link 
            href={`/menu/${restaurant.id}`} 
            className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden no-underline text-gray-900 mb-8"
        >
            {/* 1. Банер та контейнер для лого */}
            <div className="relative h-40 bg-gray-200">
                <Image
                    src={restaurant.bannerUrl || defaultBanner}
                    alt={`Banner for ${restaurant.name}`}
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0"
                />
                
                {/* 2. Логотип (зліва вгорі, в кругу) - Імітуємо дизайн зі скріншота */}
                <div className="absolute top-3 left-3 w-12 h-12 rounded-full bg-white border-2 border-white overflow-hidden shadow-md p-1 flex items-center justify-center">
                    <Image
                        src={restaurant.logoUrl || defaultLogo}
                        alt={`${restaurant.name} Logo`}
                        width={48}
                        height={48}
                        className="object-cover rounded-full"
                    />
                </div>
            </div>
            
            {/* 3. Текстовий контент */}
            <div className="p-4 relative">
                {/* Назва */}
                <h2 className="text-xl font-bold mb-1">{restaurant.name}</h2>
                
                {/* Опис */}
                <p className="text-sm text-gray-700 mb-1">{restaurant.description || 'A warm and welcoming place for coffee lovers'}</p>
                
                {/* Адреса */}
                <p className="text-xs text-gray-400 mb-3">{restaurant.address || 'Адреса не вказана.'}</p>
                
                {/* Рейтинг */}
                <StarRating rating={rating} /> 
            </div>
        </Link>
    );
}
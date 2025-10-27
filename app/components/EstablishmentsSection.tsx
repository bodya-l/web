// app/components/EstablishmentsSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RestaurantCard from './RestaurantCard'; 
import { ArrowRight } from 'lucide-react'; // Використовуємо стрілку

// Тип для даних (як у API)
interface RestaurantPreview {
    id: number;
    name: string;
    description?: string;
    address?: string;
    logoUrl?: string;
    bannerUrl?: string;
    stars?: number;
}

export default function EstablishmentsSection() {
    const [restaurants, setRestaurants] = useState<RestaurantPreview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ⬅️ Завантаження даних з API
    useEffect(() => {
        fetch('/api/partners') // Викликаємо наш API, який повертає всі заклади
            .then(res => {
                 if (!res.ok) throw new Error('Failed to fetch data.');
                 return res.json();
            })
            .then(data => {
                setRestaurants(data);
            })
            .catch(err => {
                setError('Не вдалося завантажити список закладів.');
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // Обмежуємо список до перших 3-х елементів для головної сторінки
    const limitedRestaurants = restaurants.slice(0, 3);

    return (
        // ⬅️ Збільшений вертикальний відступ
        <section className="mt-16"> 
            
            {/* ▼▼▼ ЗАГОЛОВОК ТА КНОПКА ▼▼▼ */}
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                
                {/* ⬅️ Задизайнений ЗАГОЛОВОК */}
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Establishments:
                </h2>
                
                {/* ⬅️ Стилізована КНОПКА "Переглянути всі" */}
                <Link 
                    href="/partners" 
                    // Використовуємо синій колір, як на вашому скріншоті-зразку
                    className="flex items-center text-base font-semibold text-indigo-600 transition hover:text-indigo-800 whitespace-nowrap p-2 rounded-lg hover:bg-indigo-50 no-underline"
                >
                    Переглянути всі
                    <ArrowRight size={20} className="ml-1" />
                </Link>
            </div>
            {/* ▲▲▲ КІНЕЦЬ ЗАГОЛОВКУ ▲▲▲ */}

            {isLoading ? (
                <div className="text-center text-gray-500 py-6">Завантаження закладів...</div>
            ) : error ? (
                <div className="text-center text-red-600 py-6">{error}</div>
            ) : limitedRestaurants.length === 0 ? (
                <div className="text-center text-gray-500 py-6">Наразі немає доступних закладів.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {limitedRestaurants.map((restaurant) => (
                        <RestaurantCard 
                            key={restaurant.id}
                            restaurant={restaurant}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
// app/partners/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// ⬅️ ВИПРАВЛЕНО ШЛЯХИ: використовуємо відносні шляхи до компонентів
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import RestaurantCard from '../components/RestaurantCard'; 

// Тип для даних, які ми очікуємо від API (використовуємо JSDoc)
/**
 * @typedef {object} RestaurantPreview
 * @property {number} id
 * @property {string} name
 * @property {string} [description]
 * @property {string} [address]
 * @property {string} [logoUrl]
 * @property {string} [bannerUrl]
 */

// Компонент зірок (для цілісності)
const StarRating = ({ rating }) => {
    const stars = [];
    const maxStars = 5;
    for (let i = 1; i <= maxStars; i++) {
        stars.push(
            <svg key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.071 3.292a1 1 0 00.95.695h3.46c.969 0 1.371 1.24.588 1.81l-2.8 2.031a1 1 0 00-.364 1.118l1.071 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.031a1 1 0 00-1.176 0l-2.8 2.031c-.784.57-1.84-.197-1.54-1.118l1.071-3.292a1 1 0 00-.364-1.118l-2.8-2.031c-.783-.57-.381-1.81.588-1.81h3.46a1 1 0 00.95-.695l1.07-3.292z" />
            </svg>
        );
    }
    return <div className="flex">{stars}</div>;
};


export default function PartnersPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const defaultBanner = '/images/default_banner.jpg'; 
    const defaultLogo = '/images/default_logo.png'; 

    // Завантаження даних
    useEffect(() => {
        fetch('/api/partners')
            .then(res => {
                 if (!res.ok) throw new Error('Failed to fetch partners data.');
                 return res.json();
            })
            .then(data => {
                setRestaurants(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError('Не вдалося завантажити список ресторанів.');
                setIsLoading(false);
            });
    }, []);
    
    // Компонент зірок (винесений у функціональний компонент)
    const renderStarRating = (rating) => <StarRating rating={rating} />;


    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* ⬅️ Хедер */}
            <Header /> 

            {/* ОСНОВНИЙ КОНТЕНТ */}
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
                    Усі Партнери
                </h1>

                {isLoading ? (
                    <div className="text-center text-gray-500 py-10">Завантаження...</div>
                ) : error ? (
                    <div className="text-center text-red-600 py-10">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {restaurants.map((restaurant) => (
                            <RestaurantCard 
                                key={restaurant.id}
                                restaurant={restaurant}
                                defaultBanner={defaultBanner}
                                defaultLogo={defaultLogo}
                                renderStarRating={renderStarRating} // Передаємо функцію рендерингу зірок
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Футер */}
            <Footer />
        </div>
    );
}
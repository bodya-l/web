// app/manage/restaurants/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react'; // ⬅️ Додано signOut
import Link from 'next/link';
import Image from 'next/image';
import { Settings, Trash2, User, Plus, LogOut } from 'lucide-react'; // ⬅️ Додано LogOut

export default function ManageRestaurantsPage() {
    const [restaurants, setRestaurants] = useState([]);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/manage/restaurants')
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch restaurants');
                    }
                    return res.json();
                })
                .then((data) => {
                    setRestaurants(data);
                })
                .catch((error) => {
                    console.error('Error fetching restaurants:', error);
                });
        }
    }, [status]);
    
    // Функція виходу з системи
    const handleSignOut = () => {
        // Вихід, з перенаправленням на сторінку входу
        signOut({ callbackUrl: '/login' });
    };

    if (status === 'loading') {
        return (
            <main className="w-full min-h-screen flex flex-col bg-white justify-start">
                <div className="p-8 text-center text-gray-500">Завантаження...</div>
            </main>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <main className="w-full min-h-screen flex flex-col bg-white justify-start">
                <div className="p-8 text-center text-gray-500">Доступ заборонено.</div>
            </main>
        );
    }


    return (
        <main className="w-full min-h-screen flex flex-col bg-white justify-start">
            <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8">
                
                {/* manageHeader */}
                <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200 flex-wrap gap-4">
                    
                    {/* manageHeaderTitle */}
                    <div className="manageHeaderTitle">
                        <h1 className="m-0 text-sm font-semibold tracking-wider text-gray-600 uppercase">MANAGER MODE</h1>
                    </div>
                    
                    {/* manageHeaderUser (Об'єднаний блок користувача та виходу) */}
                    <div className="flex items-center gap-4">
                        
                        {/* Інформація про користувача */}
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <User size={16} className="text-gray-500" />
                            <span>{session?.user?.email}</span>
                        </div>
                        
                        {/* КНОПКА ВИХОДУ */}
                        <button
                            onClick={handleSignOut}
                            className="text-gray-500 hover:text-red-600 transition flex items-center gap-1 text-sm font-medium"
                            title="Вийти"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Вийти</span>
                        </button>
                    </div>
                </header>

                {/* manageSection */}
                <section className="mb-8 sm:mb-12">
                    {/* manageSectionHeader */}
                    <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
                        <div>
                            <h2 className="m-0 mb-1 text-2xl sm:text-3xl font-bold">My Restaurants</h2>
                            <p className="m-0 text-gray-500 text-base">Manage your restaurants and menus</p>
                        </div>
                        {/* manageAddButton */}
                        <button className="bg-indigo-600 text-white border-none rounded-lg px-5 py-3 text-sm sm:text-base font-medium cursor-pointer whitespace-nowrap transition hover:bg-indigo-700 flex items-center gap-2">
                            <Plus size={20} />
                            Add Restaurant
                        </button>
                    </div>

                    {/* manageRestaurantList */}
                    <div className="flex flex-col gap-4 sm:gap-6">
                        {Array.isArray(restaurants) && restaurants.length > 0 ? (
                            restaurants.map((restaurant) => (
                                // manageRestaurantCard
                                <div key={restaurant.id} className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-4 md:p-6 overflow-hidden">
                                    {/* manageRestaurantImage */}
                                    <div className="relative w-full h-48 md:w-48 md:h-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                        <Image
                                            src={restaurant.imageUrl || '/images/placeholder.jpg'}
                                            alt={restaurant.name}
                                            layout="fill"
                                            objectFit="cover"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* manageRestaurantInfo */}
                                    <div className="flex-grow text-left">
                                        <h3 className="m-0 mb-2 text-lg sm:text-xl font-semibold">{restaurant.name}</h3>
                                        <p className="m-0 mb-4 text-gray-500 text-sm line-clamp-2">{restaurant.description || 'No description'}</p>
                                        {/* manageRestaurantStats */}
                                        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                                            <span><strong className="text-black">{/* TODO */}</strong> Categories</span>
                                            <span><strong className="text-black">{restaurant.orders?.length || 0}</strong> Orders</span>
                                            <span><strong className="text-black">${/* TODO */}</strong> Revenue</span>
                                        </div>
                                    </div>
                                    {/* manageRestaurantActions */}
                                    <div className="flex items-center gap-4 flex-shrink-0 mt-4 pt-4 border-t border-gray-100 justify-between md:border-t-0 md:pt-0 md:mt-0 md:justify-end">
                                        {/* actionIcon (Налаштування) */}
                                        <button className="text-xl cursor-pointer text-gray-500 transition hover:text-gray-800">
                                            <Settings size={20} />
                                        </button>
                                        
                                        {/* actionIcon (Видалення) */}
                                        <button className="text-xl cursor-pointer text-gray-500 transition hover:text-red-500">
                                            <Trash2 size={20} />
                                        </button>
                                        
                                        {/* КНОПКА KITCHEN */}
                                        <Link
                                            href={`/dashboard/${restaurant.id}`}
                                            className="bg-gray-100 text-indigo-600 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer no-underline whitespace-nowrap transition hover:bg-gray-200 ml-auto md:ml-0"
                                        >
                                            KITCHEN
                                        </Link>
                                        
                                        {/* MANAGE MENU */}
                                        <Link
                                            href={`/manage/restaurants/${restaurant.id}/categories`}
                                            className="bg-gray-100 text-indigo-600 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer no-underline whitespace-nowrap transition hover:bg-gray-200"
                                        >
                                            MANAGE MENU
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center p-8">You haven't added any restaurants yet.</p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
// app/menu/[restaurantId]/page.js
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Settings, ArrowLeft, Utensils, Coffee, Wine, Package, User } from 'lucide-react'; 
import ProfileModal from '../../components/ProfileModal'; 

// --- ДАНІ ДЛЯ ВІДТВОРЕННЯ ДИЗАЙНУ ---
const RESTAURANT_ID = 1; 

// Використовуємо Lucide-react для іконок
const PRIMARY_CATEGORIES = [
    { name: 'Кухня', icon: Utensils, link: 'Кухня' },
    { name: 'Напої', icon: Coffee, link: 'Напої' },
    { name: 'Алкоголь', icon: Wine, link: 'Алкогольні напої' },
    { name: 'Мерч', icon: Package, link: 'Мерч' },
];
// ------------------------------------

export default function MenuPage() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [restaurant, setRestaurant] = useState(null); 
    const [isLoadingData, setIsLoadingData] = useState(true); 
    
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const restaurantId = params.restaurantId;

    // --- ДАНІ РЕСТОРАНУ (Тепер як заглушки, доки не спрацює API) ---
    const userLevel = 'lvl. 23';
    const restaurantRating = '★★★★☆'; 
    const defaultPlaceholder = '/images/placeholder.jpg'; 
    
    const userName = session?.user?.name || 'Клієнт';
    const profileInitial = userName.charAt(0);
    const userImage = session?.user?.image;


    // ⬅️ ЛОГІКА ЗАВАНТАЖЕННЯ ДАНИХ (для картки)
    useEffect(() => {
        // Ми залишаємо цю логіку, щоб завантажити дані для картки ресторану
        if (status === 'authenticated' && restaurantId) {
            fetch(`/api/menu/${restaurantId}`)
                .then(res => res.json())
                .then(data => {
                    setRestaurant(data);
                })
                .catch(error => {
                    console.error('Failed to load restaurant data:', error);
                })
                .finally(() => {
                    setIsLoadingData(false);
                });
        }
    }, [status, restaurantId]);


    // Стан завантаження
    if (status === "loading" || isLoadingData) {
        return (
            <main className="w-full min-h-screen flex flex-col bg-gray-50 justify-center items-center">
                <div className="p-8 text-center text-gray-500">Завантаження меню...</div>
            </main>
        );
    }
    
    const { name, address, bannerUrl, logoUrl } = restaurant || {}; 
    

    return (
        <>
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />

            <main className="w-full min-h-screen flex flex-col bg-gray-50 justify-start">

                {/* --- 1. ХЕДЕР З ФОНОМ (BANNER) --- */}
                <div className="w-full h-[clamp(200px,30vh,250px)] bg-gray-100 bg-cover bg-center relative flex-shrink-0">
                    <Image
                        src={bannerUrl || defaultPlaceholder} 
                        alt="Restaurant Banner"
                        layout="fill"
                        objectFit="cover"
                        className="absolute inset-0"
                    />

                    {/* Накладання іконок */}
                    <div className="absolute inset-x-0 top-0 p-4 sm:p-6 flex justify-between items-center bg-gradient-to-b from-black/30 to-transparent w-full max-w-[1600px] mx-auto">
                        <Link href={'/partners'}><button className="bg-white/80 text-gray-800 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl cursor-pointer transition backdrop-blur-sm shadow-md hover:bg-white/95 font-bold">
                            <ArrowLeft size={24} />
                        </button></Link>
                        
                        <div className="flex gap-3">
                            <button className="bg-white/80 text-gray-800 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl cursor-pointer transition backdrop-blur-sm shadow-md hover:bg-white/95">
                                <Settings size={20} />
                            </button>
                            <button onClick={() => setIsProfileOpen(true)} className="bg-white/80 text-gray-800 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl cursor-pointer transition backdrop-blur-sm shadow-md hover:bg-white/95 overflow-hidden">
                                {userImage ? (
                                    <Image src={userImage} alt="Profile" width={40} height={40} className="rounded-full object-cover w-full h-full" />
                                ) : (
                                    <span className="font-semibold">{profileInitial}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- 2. КАРТКА РЕСТОРАНУ --- */}
                <div className="relative z-10 w-full max-w-[1600px] mx-auto">
                    <div className="bg-white rounded-3xl shadow-lg p-5 mx-4 lg:mx-8 -mt-20 sm:-mt-16 z-10 text-left">
                        
                        <div className="flex items-center space-x-4">
                            {/* ЛОГОТИП */}
                            <div className="w-16 h-16 sm:w-16 sm:h-16 rounded-full bg-gray-200 border-2 sm:border-4 border-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                                <Image
                                    src={logoUrl || defaultPlaceholder}
                                    alt="Restaurant Logo"
                                    width={64}
                                    height={64}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            
                            <div className="flex-grow overflow-hidden">
                                <h2 className="text-2xl font-bold text-gray-900">{name || 'NAZVA'}</h2>
                                <p className="mt-0.5 mb-1 text-yellow-500 text-sm">{restaurantRating}</p>
                                <span className="text-sm text-gray-500 truncate block">{address || 'Адреса відсутня'}</span>
                            </div>
                            <span className="text-sm font-bold text-green-600 self-start">{userLevel}</span>
                        </div>

                        {/* Прогрес бар */}
                        <div className="mt-4 border-t border-gray-100 pt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 3. СПИСОК КАТЕГОРІЙ МЕНЮ (4 ОСНОВНІ КНОПКИ) --- */}
                <div className="w-full mx-auto max-w-[1600px] flex-grow flex flex-col pt-8 px-4 lg:px-8">
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* ⬅️ ЖОРСТКО КОДОВАНИЙ MAP ДЛЯ ДИЗАЙНУ */}
                        {PRIMARY_CATEGORIES.map((category) => {
                            const Icon = category.icon;
                            
                            return (
                                <Link 
                                    key={category.name}
                                    // ⬅️ ПОСИЛАННЯ: Використовуємо category.link для URL
                                    href={`/menu-secondary?id=${restaurantId}&category=${category.link}`} 
                                    className="bg-white rounded-lg p-4 flex items-center shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="bg-gray-100 rounded-md p-2 flex-shrink-0">
                                        <Icon className="w-6 h-6 text-green-700" />
                                    </div>

                                    <span className="text-base font-semibold ml-3 text-gray-800">
                                        {category.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </main>
        </>
    );
}
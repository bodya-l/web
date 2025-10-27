// app/menu-secondary/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProfileModal from '../components/ProfileModal';
import CartModal from '../components/CartModal';
import MyOrdersModal from '../components/MyOrdersModal'; 
import { useCart } from '../../context/CartContext';
import { useSession } from 'next-auth/react';
import { ArrowLeft, ShoppingCart, User, Clock } from 'lucide-react';
import Pusher from 'pusher-js'; 

// ⬅️ Об'єкт категорій для побудови навігації
const SIDE_NAV_CATEGORIES = {
    "Кухня": ["Гарячі страви", "Супи", "Салати", "Десерти"],
    "Напої": ["Алкогольні напої", "Безалкогольні напої", "Кава", "Чай"],
    "Піца": ["Піца"],
};

export default function MenuSecondaryPage() {
    const [dishes, setDishes] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    
    const [openDropdown, setOpenDropdown] = useState(null); 

    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category'); 
    const restaurantId = searchParams.get('id') || '1'; 

    const { addToCart, cartCount } = useCart();
    const { data: session, status } = useSession();
    
    const userId = session?.user?.id ? String(session.user.id) : null; 

    // 1. Завантаження даних
    useEffect(() => {
        if (currentCategory) { 
            fetch(`/api/dishes?category=${currentCategory}`)
                .then((res) => res.json())
                .then((data) => {
                    setDishes(data);
                });
        }
    }, [currentCategory]); 

    // 2. Логіка підписки на Pusher (Сповіщення про статус)
    useEffect(() => {
        if (status !== 'authenticated' || !userId) return;

        const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
        const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
        
        if (!pusherKey || !pusherCluster) {
            console.error("Pusher: Missing NEXT_PUBLIC keys in environment.");
            return; 
        }

        const channelName = `user-${userId}`;
        
        const pusherClient = new Pusher(pusherKey, {
          cluster: pusherCluster,
        });
        
        const channel = pusherClient.subscribe(channelName);

        channel.bind('order-status-update', (data) => {
          alert(`🔔 НОВИЙ СТАТУС: ${data.message}`);
        });

        // Cleanup
        return () => {
          pusherClient.unsubscribe(channelName);
          pusherClient.disconnect();
        };
    }, [userId, status]); 

    // ⬅️ Логіка для визначення активного dropdown при завантаженні сторінки
    useEffect(() => {
        const parentCategory = Object.entries(SIDE_NAV_CATEGORIES).find(([_, subcats]) => 
            subcats.includes(currentCategory)
        )?.[0];
        
        if (parentCategory) {
            setOpenDropdown(parentCategory);
        }
    }, [currentCategory]);


    return (
        <>
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
            <MyOrdersModal
                isOpen={isOrdersOpen}
                onClose={() => setIsOrdersOpen(false)}
                restaurantId={restaurantId}
            />

            <main className="w-full min-h-screen flex flex-col bg-white justify-start">
                {/* secondaryMenuContentWrapper */}
                <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col overflow-hidden">
                    
                    {/* secondaryMenuHeaderNew */}
                    <header className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-10 py-4 sm:py-5 border-b border-gray-100 flex-shrink-0 w-full max-w-7xl mx-auto">
                        <Link href={`/menu/${restaurantId}`} className="text-2xl sm:text-3xl no-underline text-gray-800 font-bold">
                            <ArrowLeft size={24} strokeWidth={2.5} />
                        </Link>
                        <div className="restaurantInfo">
                            <h3>NAZVA</h3>
                            <p>description of the restaurant</p>
                        </div>
                        {/* headerIcons */}
                        <div className="flex items-center gap-4 sm:gap-6 ml-auto">
                            
                            {/* 1. КНОПКА "Мої замовлення" (ТЕКСТОВА) */}
                            <button 
                                onClick={() => setIsOrdersOpen(true)}
                                className="bg-green-100 text-green-700 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer whitespace-nowrap transition hover:bg-green-200"
                            >
                                Мої Замовлення
                            </button>

                            {/* 2. cartIcon */}
                            <span className="text-xl sm:text-2xl cursor-pointer z-10 relative text-gray-800" onClick={() => setIsCartOpen(true)}>
                                <ShoppingCart size={22} strokeWidth={2.5} />
                                {cartCount > 0 && <span className="absolute -top-2 -right-2.5 bg-red-600 text-white rounded-full px-1.5 py-0.5 text-xs font-bold leading-none min-w-[18px] text-center">{cartCount}</span>}
                            </span>
                            
                            {/* 3. profileIcon */}
                            <span className="text-xl sm:text-2xl cursor-pointer z-10 relative text-gray-800" onClick={() => setIsProfileOpen(true)}>
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="profile" className="w-7 h-7 rounded-full object-cover" />
                                ) : (
                                    <User size={22} strokeWidth={2.5} />
                                )}
                            </span>
                        </div>
                    </header>

                    {/* secondaryMenuBody */}
                    <div className="flex flex-grow overflow-hidden w-full max-w-7xl mx-auto">
                        
                        {/* ⬅️ Бічна навігація (SideNav) - РОЗСУВНИЙ ДИЗАЙН */}
                        <nav 
                            className="flex flex-col p-4 sm:p-5 border-r border-gray-100 gap-0 flex-shrink-0 w-[150px] sm:w-[220px] overflow-y-auto"
                        >
                            
                            {Object.entries(SIDE_NAV_CATEGORIES).map(([mainTitle, subcategories]) => {
                                const isDropdownOpen = openDropdown === mainTitle;
                                const isMainCategoryActive = subcategories.includes(currentCategory);
                                return (
                                    <div key={mainTitle} className="w-full">
                                        
                                        {/* Основна назва категорії (Батьківський елемент) */}
                                        <span 
                                            onClick={() => setOpenDropdown(isDropdownOpen ? null : mainTitle)} // ⬅️ КЛІК ДЛЯ РОЗКРИТТЯ/ЗАКРИТТЯ
                                            className={`no-underline px-4 py-3 text-left font-medium text-sm sm:text-base transition-colors duration-200 block cursor-pointer rounded-lg
                                                ${isDropdownOpen || isMainCategoryActive 
                                                    ? 'bg-gray-200 text-gray-900 font-semibold' // ⬅️ Активний стиль (Сірий)
                                                    : 'text-gray-800 hover:bg-gray-100'}`
                                            }
                                        >
                                            {mainTitle}
                                        </span>
                                        
                                        {/* Випадаюче меню (РОЗСУВНИЙ СПИСОК) */}
                                        <ul 
                                            className={`list-none p-0 overflow-hidden transition-all duration-300 ease-in-out 
                                                ${isDropdownOpen || isMainCategoryActive ? 'max-h-96 opacity-100 pb-2' : 'max-h-0 opacity-0'}`
                                            }
                                        >
                                            {subcategories.map((subCategory) => {
                                                const isActive = subCategory === currentCategory; 
                                                return (
                                                    <li key={subCategory}>
                                                        <Link 
                                                            href={`/menu-secondary?id=${restaurantId}&category=${subCategory}`} 
                                                            className={`block no-underline pl-8 pr-3 py-2 text-left text-sm transition-colors duration-200 
                                                                ${isActive 
                                                                    ? 'bg-green-100 text-green-700 font-semibold rounded-md' // ⬅️ ЗЕЛЕНЕ ВИДІЛЕННЯ
                                                                    : 'text-gray-700 hover:bg-gray-50'}`
                                                            }
                                                        >
                                                            {subCategory}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                );
                            })}

                            {/* --- ПІЦА (Звичайне посилання, без dropdown) --- */}
                            <Link 
                                href={`/menu-secondary?id=${restaurantId}&category=Піца`} 
                                className={`no-underline px-4 py-3 rounded-lg text-left font-medium text-sm sm:text-base transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis 
                                    ${'Піца' === currentCategory ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-800 hover:bg-gray-100'}`}
                            >
                                Піца
                            </Link>

                        </nav>

                        {/* dishListNew (Список страв) */}
                        <div className="dishListNew flex-grow p-4 sm:p-5 lg:px-10 overflow-y-auto text-left">
                            <div className="dishListHeader flex justify-between items-center mb-6 flex-wrap gap-2">
                                <h3>{currentCategory || 'Страви'}</h3>
                                <div className="dishProgress">
                                    <span className="text-sm text-gray-500 font-medium">lvl. 23</span>
                                    <div className="w-20 sm:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '83%' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-500 font-medium">83%</span>
                                </div>
                            </div>

                            {/* Цикл страв */}
                            {Array.isArray(dishes) && dishes.map((dish) => (
                                <div key={dish.id} className="flex gap-3 sm:gap-4 border-b border-gray-100 py-4 sm:py-6 last:border-b-0">
                                    <div className="flex-grow overflow-hidden">
                                        <h4 className="m-0 mb-1 text-base sm:text-lg font-semibold truncate">{dish.name}</h4>
                                        <p className="m-0 mb-2 text-sm text-gray-500 line-clamp-2">{dish.description || 'Опис відсутній'}</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-sm sm:text-base font-bold text-gray-800">{dish.price} грн</span>
                                        </div>
                                    </div>
                                    <div className="relative flex-shrink-0">
                                        <Image
                                            src={dish.imageUrl || '/images/placeholder.jpg'}
                                            alt={dish.name}
                                            width={90}
                                            height={90}
                                            className="rounded-lg object-cover w-[70px] h-[70px] sm:w-[90px] sm:h-[90px]"
                                        />
                                        <button
                                            className="absolute -bottom-2 -right-2 bg-white border border-gray-200 shadow-lg text-green-500 rounded-full w-8 h-8 sm:w-9 sm:h-9 text-3xl font-light cursor-pointer flex items-center justify-center leading-none transition-transform active:scale-90"
                                            onClick={() => addToCart(dish)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
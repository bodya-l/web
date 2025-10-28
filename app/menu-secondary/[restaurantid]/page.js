// app/menu-secondary/[restaurantid]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProfileModal from '../../components/ProfileModal';
import CartModal from '../../components/CartModal';
import MyOrdersModal from '../../components/MyOrdersModal';
import { useCart } from '../../../context/CartContext';
import { useSession } from 'next-auth/react';
// 💡 1. Додаємо іконку 'Star'
import { ArrowLeft, ShoppingCart, User, Clock, Star } from 'lucide-react';
import Pusher from 'pusher-js'; 

const SIDE_NAV_CATEGORIES = {
    "Кухня": ["Гарячі страви", "Супи", "Салати", "Десерти"],
    "Напої": ["Алкогольні напої", "Безалкогольні напої", "Кава", "Чай"],
};

export default function MenuSecondaryPage({ params }) {
    const [restaurant, setRestaurant] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(true);
    
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null); 

    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category'); 
    const restaurantId = params.restaurantid; 

    const { addToCart, cartCount } = useCart();
    const { data: session, status } = useSession();
    const userId = session?.user?.id ? String(session.user.id) : null; 

    // Завантаження даних РЕСТОРАНУ
    useEffect(() => {
        if (restaurantId) {
            setIsLoadingRestaurant(true);
            fetch(`/api/restaurants/${restaurantId}`) 
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Не вдалося завантажити дані ресторану');
                    }
                    return res.json();
                })
                .then((data) => {
                    setRestaurant(data);
                })
                .catch((error) => {
                    console.error("Помилка завантаження ресторану:", error);
                    setRestaurant(null); // Скидаємо, щоб показати помилку
                })
                .finally(() => {
                    setIsLoadingRestaurant(false);
                });
        }
    }, [restaurantId]);

    // Завантаження СТРАВ
    useEffect(() => {
        if (currentCategory && restaurantId) { 
            const apiUrl = `/api/dishes?restaurantId=${restaurantId}&category=${currentCategory}`;
            fetch(apiUrl)
                .then((res) => res.json())
                .then((data) => setDishes(data))
                .catch((error) => {
                    console.error("Помилка завантаження страв:", error);
                    setDishes([]);
                });
        }
    }, [currentCategory, restaurantId]);

    // ... (useEffect для Pusher без змін) ...
     useEffect(() => {
        if (status !== 'authenticated' || !userId) return;
        const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
        const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
        if (!pusherKey || !pusherCluster) return; 
        const channelName = `user-${userId}`;
        const pusherClient = new Pusher(pusherKey, { cluster: pusherCluster });
        const channel = pusherClient.subscribe(channelName);
        channel.bind('order-status-update', (data) => {
          alert(`🔔 НОВИЙ СТАТУС: ${data.message}`);
        });
        return () => {
          pusherClient.unsubscribe(channelName);
          pusherClient.disconnect();
        };
    }, [userId, status]); 

    // ... (useEffect для Dropdown без змін) ...
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
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} restaurantId={restaurantId} />
            <MyOrdersModal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} restaurantId={restaurantId} />

            <main className="w-full min-h-screen flex flex-col bg-white justify-start">
                <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col overflow-hidden">
                    
                    {/* 💡 2. ОНОВЛЕНИЙ ХЕДЕР */}
                    <header className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 lg:px-10 py-4 sm:py-5 border-b border-gray-100 flex-shrink-0 w-full max-w-7xl mx-auto">
                        <Link href={`/menu/${restaurantId}`} className="text-2xl sm:text-3xl no-underline text-gray-800 font-bold flex-shrink-0">
                            <ArrowLeft size={24} strokeWidth={2.5} />
                        </Link>
                        
                        {/* 💡 3. ОНОВЛЕНИЙ БЛОК ІНФОРМАЦІЇ */}
                        <div className="restaurantInfo flex items-center gap-4 flex-grow min-w-0">
                            {isLoadingRestaurant ? (
                                // Скелетон-завантажувач
                                <>
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                                    <div className="flex-grow min-w-0">
                                        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                        <div className="h-4 bg-gray-100 rounded w-full mt-2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-100 rounded w-1/3 mt-1 animate-pulse"></div>
                                    </div>
                                </>
                            ) : restaurant ? (
                                // Блок з даними
                                <>
                                    {/* Логотип */}
                                    <Image
                                        src={restaurant.logoUrl || '/images/placeholder.jpg'}
                                        alt={restaurant.name}
                                        width={64} // 64px
                                        height={64} // 64px
                                        className="rounded-lg object-cover flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16"
                                    />
                                    {/* Інфо */}
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-bold text-lg truncate" title={restaurant.name}>
                                            {restaurant.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate" title={restaurant.address}>
                                            {restaurant.address || 'Адреса не вказана'}
                                        </p>
                                        {/* Зірки */}
                                        <div className="flex items-center gap-1 mt-1">
                                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                            <span className="font-bold text-sm text-gray-800">{restaurant.stars.toFixed(1)}</span>
                                            <span className="text-sm text-gray-400">({restaurant.description || 'опис'})</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Помилка
                                <h3 className="font-bold text-lg text-red-500">Помилка завантаження</h3>
                            )}
                        </div>
                        
                        {/* Іконки хедера (без змін) */}
                        <div className="flex items-center gap-4 sm:gap-6 ml-auto flex-shrink-0">
                            <button onClick={() => setIsOrdersOpen(true)} className="bg-green-100 text-green-700 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer whitespace-nowrap transition hover:bg-green-200">
                                Мої Замовлення
                            </button>
                            <span className="text-xl sm:text-2xl cursor-pointer z-10 relative text-gray-800" onClick={() => setIsCartOpen(true)}>
                                <ShoppingCart size={22} strokeWidth={2.5} />
                                {cartCount > 0 && <span className="absolute -top-2 -right-2.5 bg-red-600 text-white rounded-full px-1.5 py-0.5 text-xs font-bold leading-none min-w-[18px] text-center">{cartCount}</span>}
                            </span>
                            <span className="text-xl sm:text-2xl cursor-pointer z-10 relative text-gray-800" onClick={() => setIsProfileOpen(true)}>
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="profile" className="w-7 h-7 rounded-full object-cover" />
                                ) : (
                                    <User size={22} strokeWidth={2.5} />
                                )}
                            </span>
                        </div>
                    </header>

                    {/* ... (решта коду: навігація, список страв - без змін) ... */}
                    <div className="flex flex-grow overflow-hidden w-full max-w-7xl mx-auto">
                        <nav 
                            className="flex flex-col p-4 sm:p-5 border-r border-gray-100 gap-0 flex-shrink-0 w-[150px] sm:w-[220px] overflow-y-auto"
                        >
                            {Object.entries(SIDE_NAV_CATEGORIES).map(([mainTitle, subcategories]) => {
                                const isDropdownOpen = openDropdown === mainTitle;
                                const isMainCategoryActive = subcategories.includes(currentCategory);
                                return (
                                    <div key={mainTitle} className="w-full">
                                        <span onClick={() => setOpenDropdown(isDropdownOpen ? null : mainTitle)} className={`no-underline px-4 py-3 text-left font-medium text-sm sm:text-base transition-colors duration-200 block cursor-pointer rounded-lg ${isDropdownOpen || isMainCategoryActive ? 'bg-gray-200 text-gray-900 font-semibold' : 'text-gray-800 hover:bg-gray-100'}`}>
                                            {mainTitle}
                                        </span>
                                        <ul className={`list-none p-0 overflow-hidden transition-all duration-300 ease-in-out ${isDropdownOpen || isMainCategoryActive ? 'max-h-96 opacity-100 pb-2' : 'max-h-0 opacity-0'}`}>
                                            {subcategories.map((subCategory) => {
                                                const isActive = subCategory === currentCategory; 
                                                return (
                                                    <li key={subCategory}>
                                                        <Link href={`/menu-secondary/${restaurantId}?category=${subCategory}`} className={`block no-underline pl-8 pr-3 py-2 text-left text-sm transition-colors duration-200 ${isActive ? 'bg-green-100 text-green-700 font-semibold rounded-md' : 'text-gray-700 hover:bg-gray-50'}`}>
                                                            {subCategory}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                );
                            })}
                            <Link href={`/menu-secondary/${restaurantId}?category=Піца`} className={`no-underline px-4 py-3 rounded-lg text-left font-medium text-sm sm:text-base transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis ${'Піца' === currentCategory ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-800 hover:bg-gray-100'}`}>
                                Піца
                            </Link>
                        </nav>

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
                            
                            {Array.isArray(dishes) && dishes.length > 0 ? dishes.map((dish) => (
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
                                            onClick={() => addToCart(dish, restaurantId)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-500 text-center py-10">
                                    {isLoadingRestaurant ? 'Завантаження страв...' : 'У цій категорії ще немає страв.'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
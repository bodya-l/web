// app/menu-secondary/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProfileModal from '../components/ProfileModal';
import CartModal from '../components/CartModal'; // Імпортуємо модалку кошика
import { useCart } from '../../context/CartContext'; // Імпортуємо хук кошика

export default function MenuSecondaryPage() {
    const [dishes, setDishes] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false); // Стан для модалки кошика

    const searchParams = useSearchParams();
    const category = searchParams.get('category');

    // Отримуємо функції та дані з контексту кошика
    const { addToCart, cartCount } = useCart();


    // Завантажуємо дані з нашого API, коли сторінка відкривається

    const [activeCategory, setActiveCategory] = useState('Гарячі страви');

  // 2. Ви кажете: "при кліку, зробити цей стан `true`

    const [activeCategory, setActiveCategory] = useState('Гарячі страви');

  // 2. Ви кажете: "при кліку, зробити цей стан `true`

    useEffect(() => {
        if (category) {
            fetch(`/api/dishes?category=${category}`)
                .then((res) => res.json())
                .then((data) => {
                    setDishes(data);
                });
        }
    }, [category]); // Ефект спрацює, якщо категорія зміниться

    return (
        <>
            {/* Модалка Профілю */}
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
            {/* Модалка Кошика */}
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />

            {/* Контейнер сторінки, що заповнює екран */}
            <main className="pageContainer menuPageContainer">

                {/* Обгортка, яка заповнює висоту і обмежує ширину контенту */}
                <div className="secondaryMenuContentWrapper">

                    {/* Хедер з кнопкою "Назад" та іконками */}
                    <header className="secondaryMenuHeaderNew">
                        <Link href="/menu" className="backButton">
                            ‹
                        </Link>
                        <div className="restaurantInfo">
                            <h3>NAZVA</h3>
                            <p>description of the restaurant</p>
                        </div>
                        <div className="headerIcons">
                            {/* Іконка кошика відкриває модалку */}
                            <span className="cartIcon" onClick={() => setIsCartOpen(true)}>
                🛒
                                {cartCount > 0 && <span className="cartCountBadge">{cartCount}</span>}
              </span>
                            <span className="profileIcon" onClick={() => setIsProfileOpen(true)}>
                👤
              </span>
                        </div>
                    </header>

                    {/* Тіло меню (бічна панель + список) */}
                    <div className="secondaryMenuBody">

                        {/* Бічна навігація з випадаючим меню */}
                        <nav className="secondarySideNav">
                            {/* --- КУХНЯ --- */}
                            <div className="sideNavItem with-dropdown">
                                <span>Кухня</span>
                                <ul className="dropdown-menu">
                                    <li><Link href="/menu-secondary?category=Гарячі страви" onClick={() => setActiveCategory("Гарячі страви")} className={activeCategory === "Гарячі страви" ? 'active_sideNavItem-sub' : 'sideNavItem-sub'}>Гарячі страви</Link></li>
                                    <li><Link href="/menu-secondary?category=Супи" onClick={() => setActiveCategory("Супи")} className={activeCategory === "Супи" ? 'active_sideNavItem-sub' : 'sideNavItem-sub'}>Супи</Link></li>
                                    <li><Link href="/menu-secondary?category=Салати" onClick={() => setActiveCategory("Салати")} className={activeCategory === "Салати" ? 'active_sideNavItem-sub' : 'sideNavItem-sub'}>Салати</Link></li>
                                    <li><Link href="/menu-secondary?category=Десерти" onClick={() => setActiveCategory("Десерти")} className={activeCategory === "Десерти" ? 'active_sideNavItem-sub' : 'sideNavItem-sub'}>Десерти</Link></li>
                                </ul>
                            </div>
                            {/* --- НАПОЇ --- */}
                            <div className="sideNavItem with-dropdown">
                                <span>Напої</span>
                                <ul className="dropdown-menu">
                                    <li><Link href="/menu-secondary?category=Алкогольні напої" onClick={() => setActiveCategory("Алкогольні напої")} className={activeCategory === "Алкогольні напої" ? 'active_sideNavItem-sub' : 'sideNavItem-sub'}>Алкогольні напої</Link></li>
                                    <li><Link href="/menu-secondary?category=Безалкогольні напої" onClick={() => setActiveCategory("Безалкогольні напої")} className={activeCategory === "Безалкогольні напої" ? 'active_sideNavItem-sub' : 'sideNavItem-sub'}>Безалкогольні напої</Link></li>
                                    <li><Link href="/menu-secondary?category=Кава" onClick={() => setActiveCategory("Кава")} className={activeCategory === "Кава" ? 'active_sideNavItem-sub' : 'sideNavItem-sub'}>Кава</Link></li>
                                    <li><Link href="/menu-secondary?category=Чай" onClick={() => setActiveCategory("Чай")} className={activeCategory === "Чай" ? 'active_sideNavItem-sub' : 'sideNavItem-sub'}>Чай</Link></li>
                                </ul>
                            </div>
                            {/* --- ПІЦА --- */}
                            <Link href="/menu-secondary?category=Піца" className="sideNavItem">
                                Піца
                            </Link>
                        </nav>

                        {/* Оновлений список страв */}
                        <div className="dishListNew">
                            <div className="dishListHeader">
                                <h3>{category || 'Страви'}</h3>
                                <div className="dishProgress">
                                    <span>lvl. 23</span>
                                    <div className="dishProgressBar"><div className="dishProgressBarFill" style={{ width: '83%' }}></div></div>
                                    <span>83%</span>
                                </div>
                            </div>

                            {Array.isArray(dishes) && dishes.map((dish) => (
                                <div key={dish.id} className="dishItemNew">
                                    <div className="dishInfoNew">
                                        <h4>{dish.name}</h4>
                                        <p>{dish.description || 'Опис відсутній'}</p>
                                        <div className="dishDetailsNew">
                                            <span className="dishPriceNew">{dish.price} грн</span>
                                        </div>
                                        <div className="dishCaloriesNew">
                                            <span className="caloriesBar red"></span>
                                            <span className="caloriesBar green"></span>
                                        </div>
                                    </div>
                                    <div className="dishImageContainerNew">
                                        <Image
                                            src={dish.imageUrl || '/images/placeholder.jpg'}
                                            alt={dish.name}
                                            width={90}
                                            height={90}
                                            className="dishImageNew"
                                        />
                                        {/* Кнопка додає товар в кошик при кліку */}
                                        <button
                                            className="dishAddButtonNew"
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
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProfileModal from '../components/ProfileModal';
import { useSession } from 'next-auth/react';
import { RiAccountBoxFill } from "react-icons/ri";
import AuthGuard from '../components/AuthGuard';

export default function MenuSecondaryPage() {
    const { data: session, status } = useSession();

    const [dishes, setDishes] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const searchParams = useSearchParams();
    const category = searchParams.get('category');

    // Завантажуємо дані з нашого API, коли сторінка відкривається
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
        <AuthGuard>
        <>
            {/* Наша модалка, яка буде поверх всього */}
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={session?.user}
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
                            <span className="cartIcon">🛒</span>
                            <span className="profileIcon" onClick={() => setIsProfileOpen(true)}>
                <RiAccountBoxFill size={30} color="#131414ff" />
              </span>
                        </div>
                    </header>

                    {/* Тіло меню (бічна панель + список) */}
                    <div className="secondaryMenuBody">

                        {/* Бічна навігація з випадаючим меню */}
                        <nav className="secondarySideNav">
                            {/* --- КУХНЯ (з випадаючим меню) --- */}
                            <div className="sideNavItem with-dropdown">
                                <span>Кухня</span>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link href="/menu-secondary?category=Гарячі страви" className="sideNavItem-sub">
                                            Гарячі страви
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/menu-secondary?category=Салати" className="sideNavItem-sub">
                                            Салати
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/menu-secondary?category=Десерти" className="sideNavItem-sub">
                                            Десерти
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* --- НАПОЇ (з випадаючим меню) --- */}
                            <div className="sideNavItem with-dropdown">
                                <span>Напої</span>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link href="/menu-secondary?category=Алкогольні" className="sideNavItem-sub">
                                            Алкогольні
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/menu-secondary?category=Безалкогольні" className="sideNavItem-sub">
                                            Безалкогольні
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/menu-secondary?category=Кава" className="sideNavItem-sub">
                                            Кава
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/menu-secondary?category=Чай" className="sideNavItem-sub">
                                            Чай
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Просте посилання */}
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
                                    <div className="dishProgressBar">
                                        <div className="dishProgressBarFill" style={{ width: '83%' }}></div>
                                    </div>
                                    <span>83%</span>
                                </div>
                            </div>

                            {/* Перевіряємо, чи 'dishes' є масивом, перед використанням .map */}
                            {Array.isArray(dishes) && dishes.map((dish) => (
                                <div key={dish.id} className="dishItemNew">
                                    <div className="dishInfoNew">
                                        <h4>{dish.name}</h4>
                                        <p>{dish.description || 'Опис відсутній'}</p>
                                        <div className="dishDetailsNew">
                                            <span className="dishPriceNew">{dish.price} грн</span>
                                            {/* <span className="dishOldPrice">134 грн</span> */}
                                        </div>
                                        <div className="dishCaloriesNew">
                                            <span className="caloriesBar red"></span>
                                            <span className="caloriesBar green"></span>
                                        </div>
                                    </div>
                                    <div className="dishImageContainerNew">
                                        <Image
                                            src={dish.imageUrl || '/images/placeholder.jpg'} // Додаємо плейсхолдер
                                            alt={dish.name}
                                            width={90}
                                            height={90}
                                            className="dishImageNew"
                                        />
                                        <button className="dishAddButtonNew">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </main>
        </>
        </AuthGuard>
    );
}
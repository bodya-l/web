// app/menu/page.js
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react'; // 1. Додано useEffect
import { useRouter } from 'next/navigation'; // 2. Додано useRouter
import ProfileModal from '../components/ProfileModal';
import { useSession } from 'next-auth/react';
import { RiAccountBoxFill } from "react-icons/ri";
import AuthGuard from '../components/AuthGuard';


export default function MenuPage() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // 3. Отримуємо не тільки 'session', але й 'status'
    const { data: session, status } = useSession();

    // 7. Якщо код дійшов сюди, юзер 100% залогінений
    return (
        <AuthGuard>
        <>
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                // 8. Передаємо дані користувача в модальне вікно
                user={session?.user}
            />

            <main className="pageContainer menuPageContainer">
                <div className="primaryMenuContentWrapper">
                    <div className="menuHeaderImage">
                        {/* 9. Оновлюємо іконку профілю */}
                        <div className="profileIcon" onClick={() => setIsProfileOpen(true)}>
                            <RiAccountBoxFill size={30} color="#131414ff" />
                        </div>
                    </div>

                    <div className="menuProfileCard">
                        {/* 10. Оновлюємо аватарку в картці */}
                        <div className="menuProfileAvatar">
                        </div>
                        <div className="menuProfileInfo">
                            {/* 11. Оновлюємо ім'я в картці */}
                            <h2>NAZVA</h2>
                            <p>★★★★☆</p>
                            <span>Буковель, 32</span>
                        </div>
                        <div className="menuProfileLevel">
                            <div className="menuProgressBarContainer">
                                <div className="menuProgressBarFill" style={{ width: '75%' }}></div>
                            </div>
                            <span>lvl. 23</span>
                        </div>
                    </div>

                    <nav className="menuNavList">
                        <Link href="/menu-secondary?category=Гарячі страви" className="menuNavItem">
                            Кухня
                        </Link>
                        <Link href="/menu-secondary?category=Напої" className="menuNavItem">
                            Напої
                        </Link>
                        <Link href="/menu-secondary?category=Алкоголь" className="menuNavItem">
                            Алкоголь
                        </Link>
                        <Link href="/menu-secondary?category=Mapu" className="menuNavItem">
                            Mapu
                        </Link>
                    </nav>
                </div>
            </main>
        </>
        </AuthGuard>
    );
}
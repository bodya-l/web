// app/components/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { User } from 'lucide-react';

// ... (інтерфейс HeaderProps без змін) ...
interface HeaderProps {
    breadcrumpText?: string;
    description?: string;
    onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
                                           breadcrumpText = "Breadcrumb",
                                           description = "Смак починається з меню",
                                           onProfileClick
                                       }) => {
    const { data: session } = useSession();
    const userImage = session?.user?.image;

    return (
        <header className="bg-white border-b border-gray-100">
            <div className="container mx-auto px-4 lg:px-6 py-6 flex justify-between items-center max-w-7xl">

                {/* Ліва частина (без змін) */}
                <Link href="/homepage" passHref legacyBehavior>
                    <div className="flex flex-col cursor-pointer hover:opacity-90 transition-opacity">
                        <h1 className="text-2xl font-bold text-green-600">
                            {breadcrumpText}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {description}
                        </p>
                    </div>
                </Link>

                {/* Права частина: Іконка Користувача */}
                <div className="flex items-center space-x-4">

                    {/* Іконка Користувача */}
                    <button
                        onClick={onProfileClick}
                        // 💡 ОНОВЛЕННЯ: Додаємо z-10, щоб кнопка була гарантовано "зверху"
                        className="relative z-10 text-gray-800 hover:text-green-600 transition-colors p-2 rounded-full hover:bg-gray-50"
                        aria-label="Профіль користувача"
                    >
                        {userImage ? (
                            <Image
                                src={userImage}
                                alt="profile"
                                width={28}
                                height={28}
                                className="w-7 h-7 rounded-full object-cover"
                            />
                        ) : (
                            <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c4.418 0 8 1.79 8 4v2H4v-2c0-2.21 3.582-4 8-4z"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
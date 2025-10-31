// app/components/ProfileModal.js
'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { MapPin, Award, Coffee, Map, X, LogOut } from 'lucide-react'; // Додано LogOut

export default function ProfileModal({ isOpen, onClose }) {
    const { data: session } = useSession();

    if (!isOpen) {
        return null;
    }

    //  ВИПРАВЛЕННЯ КЕШУВАННЯ GOOGLE
    const handleSignOut = async () => {
        // 1. Очищуємо локальну сесію NextAuth (без автоматичного перенаправлення)
        await signOut({ redirect: false }); 
        
        // 2. Примусове перенаправлення на сторінку входу.
        // Це скидає стан і дозволяє користувачу вибрати інший Google-акаунт.
        window.location.href = '/login'; 
    };
    // ▲▲▲ ▲▲▲ ▲▲▲

    return (
        // profileOverlay
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50" onClick={onClose}>
            {/* profileModal (адаптований max-w-md) */}
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* profileCloseButton */}
                <button className="absolute top-3 right-4 text-2xl text-gray-400 cursor-pointer z-10 hover:text-gray-600" onClick={onClose}>
                    <X size={24} />
                </button>

                {/* updatedProfileHeader */}
                <div className="bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white p-6 flex items-center gap-4 flex-shrink-0">
                    {/* updatedProfileAvatar */}
                    <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-2xl font-medium flex-shrink-0">
                        {session?.user?.image ? (
                            <Image 
                                src={session.user.image} 
                                alt="Avatar" 
                                width={50} 
                                height={50} 
                                className="rounded-full object-cover" 
                            />
                        ) : (
                            <span>{session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'A'}</span>
                        )}
                    </div>
                    {/* updatedProfileName */}
                    <div className="flex-grow overflow-hidden">
                        <h3 className="m-0 text-base font-semibold truncate">{session?.user?.name || 'User'}</h3>
                        <p className="m-0 text-xs opacity-80 truncate">{session?.user?.email}</p>
                    </div>
                    {/* updatedProfileLevel */}
                    <div className="text-sm font-medium bg-black/20 px-3 py-1 rounded-full flex-shrink-0 whitespace-nowrap">
                        <span>{1} lvl.</span>
                    </div>
                </div>

                {/* profileModalContent (блок з прокруткою) */}
                <div className="p-6 overflow-y-auto flex-grow">
                    {/* updatedProfileStats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* statCard */}
                        <div className="bg-gray-100 rounded-xl p-4 text-center">
                            {/* statIcon */}
                            <span className="text-2xl block mb-2 mx-auto"><MapPin size={22} /></span>
                            <h4 className="m-0 text-sm font-semibold text-gray-600 mb-1">Restaurants</h4>
                            <p className="m-0 text-sm"><strong className="text-lg font-bold text-black">2</strong> visited</p>
                            <span className="text-xs text-gray-500">Lviv, Kyiv</span>
                        </div>
                        {/* statCard */}
                        <div className="bg-gray-100 rounded-xl p-4 text-center">
                            <span className="text-2xl block mb-2 mx-auto"><Award size={22} /></span>
                            <h4 className="m-0 text-sm font-semibold text-gray-600 mb-1">Achievements</h4>
                            <p className="m-0 text-sm"><strong className="text-lg font-bold text-black">2</strong> unlocked</p>
                        </div>
                    </div>

                    {/* updatedMyItemsButton */}
                    <button className="block w-full p-3 rounded-xl bg-green-600 text-white text-base font-bold cursor-pointer mb-6 transition hover:bg-green-700 flex-shrink-0">
                        My Items
                    </button>

                    {/* updatedAchievementsList */}
                    <div className="text-left flex-shrink-0">
                        <h4 className="m-0 mb-4 text-base font-semibold text-gray-800">Achievements</h4>
                        {/* achievementItem */}
                        <div className="flex items-center gap-4 bg-gray-100 rounded-xl p-4 mb-3">
                            <span className="text-2xl flex-shrink-0"><Coffee size={24} /></span>
                            <div>
                                <h5 className="m-0 mb-0.5 text-sm font-semibold">Coffee Lover</h5>
                                <p className="m-0 text-xs text-gray-600">Tried 10 different coffee items</p>
                            </div>
                        </div>
                        {/* achievementItem */}
                        <div className="flex items-center gap-4 bg-gray-100 rounded-xl p-4 mb-3">
                            <span className="text-2xl flex-shrink-0"><Map size={24} /></span>
                            <div>
                                <h5 className="m-0 mb-0.5 text-sm font-semibold">Explorer</h5>
                                <p className="m-0 text-xs text-gray-600">Visited 5 different restaurants</p>
                            </div>
                        </div>
                    </div>
                </div> 

                {/* Кнопка "Вийти" (поза блоком прокрутки) */}
                <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 m-6 mt-0 flex-shrink-0 w-[calc(100%-3rem)] self-center flex items-center justify-center gap-2"
                >
                    <LogOut size={18} />
                    Вийти
                </button>
            </div>
        </div>
    );
}
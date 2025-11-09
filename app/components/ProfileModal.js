'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { MapPin, Award, X, LogOut, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LocaleSwitcher } from './LocaleSwitcher';

// Іконка за замовчуванням, якщо немає URL-адреси
const DefaultIcon = () => <Award size={24} className="text-[#1db954]" />;

export default function ProfileModal({ isOpen, onClose }) {
    const { data: session } = useSession();
    const { t } = useTranslation();

    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            fetch('/api/achievements/my')
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch achievements');
                    return res.json();
                })
                .then(data => {
                    setAchievements(data || []);
                })
                .catch(error => {
                    console.error('Failed to load achievements:', error);
                    setAchievements([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSignOut = async () => {
        // Використовуємо redirect: false, а потім оновлюємо вікно для повного скидання стану
        await signOut({ redirect: false });
        window.location.href = '/login';
    };

    return (
        // profileOverlay
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50" onClick={onClose}>
            {/* profileModal */}
            <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>

                {/* profileCloseButton */}
                <button
                    className="absolute top-3 right-4 text-gray-400 cursor-pointer z-10 hover:text-gray-600 dark:hover:text-gray-200 transition"
                    onClick={onClose}
                    aria-label={t('common.close')} // Додано aria-label для доступності
                >
                    <X size={24} />
                </button>

                {/* updatedProfileHeader - Градієнтна шапка */}
                <div className="bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white p-6 flex items-center gap-4 flex-shrink-0">

                    {/* updatedProfileAvatar */}
                    <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-2xl font-medium flex-shrink-0 overflow-hidden">
                        {session?.user?.image ? (
                            <Image
                                src={session.user.image}
                                alt={t('profile.avatar_alt')}
                                width={50}
                                height={50}
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-white">
                                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'A'}
                            </span>
                        )}
                    </div>

                    {/* updatedProfileName */}
                    <div className="flex-grow overflow-hidden">
                        <h3 className="m-0 text-base font-semibold truncate">{session?.user?.name || t('profile.default_user')}</h3>
                        <p className="m-0 text-xs opacity-80 truncate">{session?.user?.email}</p>
                    </div>
                </div>

                {/* profileModalContent */}
                <div className="p-6 overflow-y-auto flex-grow dark:text-gray-300">

                    {/* updatedProfileStats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">

                        {/* statCard - Заклади */}
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center">
                            <span className="text-xl block mb-2 mx-auto text-green-500"><MapPin size={22} /></span>
                            <h4 className="m-0 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">{t('profile.restaurants_visited')}</h4>
                            <p className="m-0 text-sm">
                                <strong className="text-lg font-bold text-black dark:text-white">?</strong> {t('profile.visited')}
                            </p>
                        </div>

                        {/* statCard - Досягнення */}
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center">
                            <span className="text-xl block mb-2 mx-auto text-yellow-500"><Award size={22} /></span>
                            <h4 className="m-0 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">{t('profile.achievements')}</h4>
                            <p className="m-0 text-sm">
                                <strong className="text-lg font-bold text-black dark:text-white">{achievements.length}</strong> {t('profile.unlocked')}
                            </p>
                        </div>
                    </div>

                    {/* updatedMyItemsButton */}
                    <button className="block w-full p-3 rounded-xl bg-green-600 text-white text-base font-bold cursor-pointer mb-6 transition hover:bg-green-700 flex-shrink-0 shadow-md">
                        {t('profile.my_items')}
                    </button>

                    {/* ДИНАМІЧНИЙ СПИСОК АЧІВОК */}
                    <div className="text-left flex-shrink-0">
                        <h4 className="m-0 mb-4 text-base font-semibold text-gray-800 dark:text-white">{t('profile.achievements')}</h4>

                        {isLoading && (
                            <div className="flex justify-center items-center h-24">
                                <Loader2 className="animate-spin text-gray-400" size={32} />
                            </div>
                        )}

                        {!isLoading && achievements.length === 0 && (
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">{t('profile.no_achievements')}</p>
                            </div>
                        )}

                        {!isLoading && achievements.length > 0 && (
                            <div className="space-y-3">
                                {achievements.map((userAch) => (
                                    <div key={userAch.id} className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 transition hover:shadow-lg">
                                        <span className="text-2xl flex-shrink-0">
                                            {userAch.achievement.iconUrl ? (
                                                <Image
                                                    src={userAch.achievement.iconUrl}
                                                    alt={userAch.achievement.name}
                                                    width={24}
                                                    height={24}
                                                    className="w-6 h-6 object-contain"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.parentNode.innerHTML = DefaultIcon().props.children; // Показати DefaultIcon при помилці
                                                    }}
                                                />
                                            ) : (
                                                <DefaultIcon />
                                            )}
                                        </span>
                                        <div>
                                            <h5 className="m-0 mb-0.5 text-sm font-semibold dark:text-white">{userAch.achievement.name}</h5>
                                            <p className="m-0 text-xs text-gray-600 dark:text-gray-400">{userAch.achievement.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ПЕРЕМИКАЧІ ТЕМИ ТА МОВИ */}
                <div className="p-6 pt-0 space-y-4 flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
                    <ThemeSwitcher />
                    <LocaleSwitcher />
                </div>

                {/* Кнопка "Вийти" */}
                <button
                    onClick={handleSignOut}
                    className="px-4 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 m-6 mt-0 flex-shrink-0 w-[calc(100%-3rem)] self-center flex items-center justify-center gap-2 transition"
                >
                    <LogOut size={18} />
                    {t('profile.logout')}
                </button>
            </div>
        </div>
    );
}
// app/components/RestaurantLevelBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { calculateLevel } from '@/lib/levelingService'; // 👈 Імпортуємо нашу логіку

export function RestaurantLevelBar() {
    const params = useParams();
    const restaurantId = params.restaurantId as string;

    const [level, setLevel] = useState(1);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!restaurantId) return;

        const fetchXp = async () => {
            try {
                setIsLoading(true);
                // Викликаємо API, який ми створили в Кроці 1
                const response = await axios.get(`/api/loyalty/${restaurantId}`);
                const xp = response.data.xp;

                // Рахуємо рівень на основі XP (Крок 2)
                const { level, progress } = calculateLevel(xp);
                setLevel(level);
                setProgress(progress);

            } catch (error) {
                console.error('Failed to fetch level stats', error);
                setLevel(1);
                setProgress(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchXp();
    }, [restaurantId]);

    if (isLoading) {
        // 💀 Можна додати гарний "skeleton" loader тут
        return (
            <div className="w-full">
                <div className="h-2.5 bg-gray-200 rounded-full w-48 animate-pulse"></div>
            </div>
        );
    }

    // ВАШ КОМПОНЕНТ ДЛЯ РЕНДЕРУ (я взяв за основу ваш скріншот)
    return (
        <div className="w-full max-w-[150px]"> {/* Обмежте ширину, якщо потрібно */}
            <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-white">
          lvl. {level}
        </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">
                {progress}%
            </div>
        </div>
    );
}
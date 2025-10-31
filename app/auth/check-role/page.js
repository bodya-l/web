// app/auth/check-role/page.js
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CheckRolePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Як тільки сесія завантажиться...
        if (status === 'authenticated') {
            // Перевіряємо роль і перенаправляємо
            if (session?.user?.role === 'OWNER') {
                router.replace('/manage/restaurants'); // replace, щоб не можна було повернутись назад
            } else {
                router.replace('/homepage');
            }
        } else if (status === 'unauthenticated') {
            // Якщо з якоїсь причини не вдалося увійти, повертаємо на логін
            router.replace('/login');
        }
        // Залежності: status, session, router
    }, [status, session, router]);

    // Поки йде перевірка, показуємо завантаження
    return (
        // pageContainer + menuPageContainer -> Tailwind
        <main className="w-full min-h-screen flex flex-col bg-white justify-start">
            {/* style={{...}} -> Tailwind */}
            <div className="p-8 text-center text-gray-600">
                Перевірка ролі...
            </div>
        </main>
    );
}
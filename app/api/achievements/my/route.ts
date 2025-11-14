import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config';

// 💡 ВИРІШЕННЯ: Повідомляємо Next.js, що цей маршрут завжди динамічний
// Це запобігає спробам статичної генерації під час збірки (build)
export const dynamic = 'force-dynamic';

export async function GET() {
    // 1. АВТЕНТИФІКАЦІЯ
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Неавторизовано' }, { status: 401 });
    }
    const userId = Number(session.user.id);

    // 2. ЗАПИТ ДО БАЗИ ДАНИХ
    try {
        const userAchievements = await prisma.userAchievement.findMany({
            where: { userId: userId },
            include: {
                achievement: {
                    select: {
                        name: true,
                        description: true,
                        iconUrl: true,
                        code: true
                    }
                }
            },
            orderBy: {
                unlockedAt: 'desc'
            }
        });

        // 3. ТРАНСФОРМАЦІЯ
        // "Розпаковуємо" вкладені дані, щоб фронтенд отримав чистий масив
        const achievements = userAchievements.map(ua => ({
            id: ua.achievement.code, // Використовуємо 'code' як унікальний ID
            name: ua.achievement.name,
            description: ua.achievement.description,
            iconUrl: ua.achievement.iconUrl,
            unlockedAt: ua.unlockedAt // Додаємо дату розблокування
        }));

        // 4. ВІДПОВІДЬ
        // Повертаємо новий, "чистий" масив
        return NextResponse.json(achievements);

    } catch (error) {
        console.error("Помилка при отриманні ачівок:", error);
        return NextResponse.json({ message: 'Внутрішня помишка сервера' }, { status: 500 });
    }
}
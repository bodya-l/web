import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config';

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
            // Включаємо повну інформацію про саму ачівку
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
            // Сортуємо: останні отримані - перші в списку
            orderBy: {
                unlockedAt: 'desc'
            }
        });

        // 3. ВІДПОВІДЬ
        // Ми повертаємо масив об'єктів
        return NextResponse.json(userAchievements);

    } catch (error) {
        console.error("Помилка при отриманні ачівок:", error);
        return NextResponse.json({ message: 'Внутрішня помишка сервера' }, { status: 500 });
    }
}


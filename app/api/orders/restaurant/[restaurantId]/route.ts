// app/api/orders/restaurant/[restaurantId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Переконайтесь, що шлях до prisma правильний
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config';

// 💡 1. ВИПРАВЛЕНО: очікуємо 'restaurantId' (camelCase)
type RouteParams = {
    params: {
        restaurantId: string;
    }
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Неавторизовано' }, { status: 401 });
        }
        
        // 💡 2. ВИПРАВЛЕНО: отримуємо 'restaurantId' (camelCase)
        const { restaurantId } = params;
        const restaurantIdNum = Number(restaurantId);

        if (isNaN(restaurantIdNum)) {
            // Ця помилка більше не має з'являтися
            return NextResponse.json({ message: 'Некоректний ID ресторану' }, { status: 400 });
        }

        // 3. Перевірка: чи є користувач ВЛАСНИКОМ цього ресторану?
        const restaurant = await prisma.restaurant.findFirst({ // findFirst безпечніше
            where: {
                id: restaurantIdNum,
                ownerId: Number(session.user.id) // Перевіряємо, що id власника = id сесії
            }
        });
        
        // (Якщо у вас є роль ADMIN, ви можете додати цю перевірку)
        // if (!restaurant && session.user.role !== 'ADMIN') { 
        if (!restaurant) {
            return NextResponse.json({ message: 'Доступ заборонено (Ви не власник)' }, { status: 403 });
        }

        // 4. Отримуємо замовлення з УСІМА вкладеними даними
        const orders = await prisma.order.findMany({
            where: {
                restaurantId: restaurantIdNum,
                status: {
                    in: ['PENDING', 'PREPARING', 'READY']
                }
            },
            include: {
                user: {
                    select: { name: true }
                },
                items: {
                    include: {
                        dish: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'asc' 
            }
        });

        // 5. Повертаємо повні дані
        return NextResponse.json(orders);

    } catch (error) {
        console.error('Помилка /api/orders/restaurant:', error);
        return NextResponse.json({ message: 'Внутрішня помилка сервера' }, { status: 500 });
    }
}
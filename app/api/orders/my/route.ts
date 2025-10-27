// app/api/orders/my/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Неавторизовано' }, { status: 401 });
        }
        
        const userIdRaw = session.user.id;
        // Безпечне парсування ID з JWT
        const numericUserId = typeof userIdRaw === 'string' ? parseInt(userIdRaw) : (userIdRaw as number); 
        
        if (isNaN(numericUserId) || !numericUserId) {
             return NextResponse.json({ message: 'Помилка ID користувача' }, { status: 400 });
        }

        // ▼▼▼ ЧИТАННЯ: Order, OrderItem та Dish.name ▼▼▼
        const orders = await prisma.order.findMany({
            where: { userId: numericUserId },
            orderBy: { createdAt: 'desc' },
            select: { 
                id: true,
                createdAt: true,
                totalPrice: true,
                status: true,
                restaurantId: true,
                // ⬅️ Використовуємо include для OrderItem та Dish
                items: {
                    select: {
                        quantity: true,
                        priceAtPurchase: true,
                        // Отримуємо назву страви через зв'язок Dish
                        dish: { select: { name: true } } 
                    }
                }
            }
        });
        
        // Форматування даних для фронтенду
        const ordersWithDetails = orders.map(order => ({
            ...order,
            // Перетворюємо items для зручності відображення
            items: order.items.map(item => ({
                name: item.dish.name,
                quantity: item.quantity,
                price: item.priceAtPurchase // Фіксована ціна
            })),
        }));
        // ▲▲▲ ▲▲▲ ▲▲▲

        // Встановлюємо заголовок для запобігання кешуванню на стороні сервера
        return NextResponse.json(ordersWithDetails, {
             headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
        
    } catch (error) {
        console.error('Error fetching my orders (500):', error);
        return NextResponse.json({ message: 'Помилка сервера' }, { status: 500 });
    }
}
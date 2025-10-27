// app/api/orders/restaurant/[restaurantId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config';

// МАПА ПРІОРИТЕТІВ: Чим менше число, тим вище в списку
const STATUS_PRIORITY = {
    'READY': 1,
    'PREPARING': 2,
    'PENDING': 3,
    'COMPLETED': 4,
};

// ▼▼▼ ВИПРАВЛЕННЯ: Явно визначаємо типи, які повертає Prisma ▼▼▼

// Тип для даних, які повертає `prisma.order.findMany`
type OrderFromDB = {
    id: number;
    createdAt: Date;
    totalPrice: number;
    status: string;
    userId: number;
    user: { name: string | null };
    items: {
        quantity: number;
        priceAtPurchase: number;
        dish: { name: string };
    }[];
};

// Тип для елемента 'items'
type ItemFromDB = {
    quantity: number;
    priceAtPurchase: number;
    dish: { name: string };
};

// ▲▲▲ ▲▲▲ ▲▲▲

export async function GET(
    request: Request,
    { params }: { params: { restaurantId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'OWNER') {
            return NextResponse.json({ message: 'Доступ заборонено. Необхідний статус ВЛАСНИКА.' }, { status: 403 });
        }
        
        const numericRestaurantId = parseInt(params.restaurantId);
        
        const isOwner = await prisma.restaurant.count({
            where: { id: numericRestaurantId, ownerId: session.user.id as number }
        });

        if (isOwner === 0) {
             return NextResponse.json({ message: 'Цей ресторан вам не належить.' }, { status: 403 });
        }
        
        // 1. Отримуємо замовлення
        const orders: OrderFromDB[] = await prisma.order.findMany({
            where: { restaurantId: numericRestaurantId },
            orderBy: { createdAt: 'asc' }, 
            select: { 
                id: true,
                createdAt: true,
                totalPrice: true,
                status: true,
                userId: true, 
                user: { select: { name: true } },
                items: {
                    select: {
                        quantity: true,
                        priceAtPurchase: true,
                        dish: { select: { name: true } }
                    }
                }
            }
        });
        
        // 2. Форматування, обчислення пріоритету
        // ▼▼▼ ВИПРАВЛЕННЯ: Додано тип 'OrderFromDB' ▼▼▼
        const ordersWithDetails = orders.map((order: OrderFromDB) => ({
            ...order,
            priority: STATUS_PRIORITY[order.status as keyof typeof STATUS_PRIORITY] || 99, 
            userName: order.user.name || 'Анонім',
            // ▼▼▼ ВИПРАВЛЕННЯ: Додано тип 'ItemFromDB' ▼▼▼
            items: order.items.map((item: ItemFromDB) => ({
                name: item.dish.name,
                quantity: item.quantity,
                price: item.priceAtPurchase
            })),
        }));
        // ▲▲▲ ▲▲▲ ▲▲▲


        // 3. ФІНАЛЬНЕ СОРТУВАННЯ НА БЕКЕНДІ (JavaScript)
        ordersWithDetails.sort((a, b) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });


        return NextResponse.json(ordersWithDetails, {
             headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
    } catch (error) {
        console.error('Error fetching restaurant orders:', error);
        return NextResponse.json({ message: 'Помилка сервера при завантаженні історії' }, { status: 500 });
    }
}
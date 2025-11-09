// This is a file representation.
// You can directly edit, format, and save this code.
// Your changes will be reflected in the user's view.

import { NextResponse } from 'next/server';
import Pusher from 'pusher';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config';
import { checkAndAwardAchievements } from '@/lib/achievementService'; // 💡 1. Імпорт Ачівок

// Ініціалізація Pusher
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
});

// Тип для даних, що надходять з кошика клієнта
type CartItem = {
    dishId: number;
    quantity: number;
};

// ... (Інші типи: PusherItemDetails, OrderItemCreateData) ...
// Тип даних для Pusher
type PusherItemDetails = {
    name: string;
    quantity: number;
    price: number;
};

// Тип для Prisma nested write
type OrderItemCreateData = {
    dishId: number;
    quantity: number;
    priceAtPurchase: number; // Зберігаємо ціну на момент покупки
};

export async function POST(request: Request) {
    try {
        // 1. АВТЕНТИФІКАЦІЯ
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Неавторизовано. Увійдіть, щоб зробити замовлення.' }, { status: 401 });
        }
        const userId = Number(session.user.id);

        // 2. ОТРИМАННЯ ДАНИХ З ТІЛА ЗАПИТУ
        const body: { cart: CartItem[]; restaurantId: string } = await request.json();
        const { cart, restaurantId } = body;

        // 3. ВАЛІДАЦІЯ ВХІДНИХ ДАНИХ
        if (!cart || cart.length === 0) {
            return NextResponse.json({ message: 'Кошик порожній' }, { status: 400 });
        }

        if (!restaurantId) {
            return NextResponse.json({ message: 'Не вказано ID ресторану' }, { status: 400 });
        }

        const numericRestaurantId = Number(restaurantId);
        if (isNaN(numericRestaurantId)) {
            return NextResponse.json({ message: 'Некоректний ID ресторану' }, { status: 400 });
        }

        // 4. ОТРИМАННЯ ДАНИХ З БД ТА ВАЛІДАЦІЯ
        const dishIds = cart.map((item) => item.dishId);

        const dishesFromDb = await prisma.dish.findMany({
            where: { id: { in: dishIds } },
            include: { category: { select: { restaurantId: true } } }
        });

        if (dishesFromDb.length !== cart.length) {
            const foundIds = new Set(dishesFromDb.map(d => d.id));
            const missingIds = dishIds.filter(id => !foundIds.has(id));
            return NextResponse.json({ message: `Страви з ID: ${missingIds.join(', ')} не знайдено` }, { status: 404 });
        }

        const allDishesMatchRestaurant = dishesFromDb.every(
            dish => dish.category.restaurantId === numericRestaurantId
        );

        if (!allDishesMatchRestaurant) {
            return NextResponse.json({ message: 'Кошик містить страви з різних ресторанів або ID ресторану невірний.' }, { status: 400 });
        }

        // 5. РОЗРАХУНОК СУМИ та підготовка OrderItem даних
        let totalPrice = 0;
        const dishDetailsMap = new Map(
            dishesFromDb.map((item) => [item.id, { price: item.price, name: item.name }])
        );

        const itemsToCreate: OrderItemCreateData[] = [];
        const itemsForPusher: PusherItemDetails[] = [];

        for (const cartItem of cart) {
            const details = dishDetailsMap.get(cartItem.dishId);

            if (details) {
                const itemTotalPrice = details.price * cartItem.quantity;
                totalPrice += itemTotalPrice;

                itemsToCreate.push({
                    dishId: cartItem.dishId,
                    quantity: cartItem.quantity,
                    priceAtPurchase: details.price,
                });

                itemsForPusher.push({
                    name: details.name,
                    quantity: cartItem.quantity,
                    price: details.price
                });
            }
        }

        // 6. ЗБЕРЕЖЕННЯ В БД (Транзакція)
        const savedOrder = await prisma.order.create({
            data: {
                userId: userId,
                restaurantId: numericRestaurantId,
                totalPrice: totalPrice,
                status: 'PENDING', // 💡 Статус замовлення
                items: {
                    create: itemsToCreate,
                }
            },
            include: {
                items: {
                    include: { dish: { select: { name: true } } }
                },
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        // 7. PUSHER: Сповіщаємо власника ресторану
        // ... (Ваш Pusher код залишається тут) ...
        const channelName = `restaurant-${restaurantId}`;
        const eventName = 'new-order';

        const pusherPayload = {
            message: `Нове замовлення! (ID: ${savedOrder.id})`,
            order: {
                id: savedOrder.id,
                totalPrice: savedOrder.totalPrice,
                status: savedOrder.status,
                createdAt: savedOrder.createdAt,
                items: savedOrder.items.map(item => ({
                    name: item.dish.name,
                    quantity: item.quantity,
                    priceAtPurchase: item.priceAtPurchase
                }))
            },
            userName: savedOrder.user.name || session.user.name || 'Анонімний клієнт',
            userEmail: savedOrder.user.email || session.user.email,
        };

        await pusher.trigger(channelName, eventName, pusherPayload);

        // 💡 --- 8. НОВА ЛОГІКА РІВНІВ (XP) ---
        // Ми додаємо XP тільки якщо замовлення вважається "завершеним"
        // ЗАРАЗ: Ми додаємо XP одразу. Якщо ви хочете додавати XP тільки
        // коли статус 'COMPLETED', вам потрібно буде перенести цю логіку
        // в інший API-роут, який оновлює статус замовлення.

        // 1 грн = 1 XP
        const xpGained = Math.floor(totalPrice);

        if (xpGained > 0) {
            await prisma.userRestaurantStats.upsert({
                where: {
                    // Унікальний ключ зі схеми
                    userId_restaurantId: {
                        userId: userId,
                        restaurantId: numericRestaurantId,
                    },
                },
                update: {
                    // Якщо запис існує, додаємо XP
                    xp: {
                        increment: xpGained,
                    },
                },
                create: {
                    // Якщо це перше замовлення, створюємо запис
                    userId: userId,
                    restaurantId: numericRestaurantId,
                    xp: xpGained,
                },
            });
            console.log(`[Loyalty] Юзер ${userId} отримав ${xpGained} XP для ресторану ${numericRestaurantId}`);
        }
        // --- КІНЕЦЬ ЛОГІКИ РІВНІВ ---


        // 💡 --- 9. ЛОГІКА АЧІВОК (залишається) ---
        // Перевірка ачівок відбудеться у фоновому режимі.
        // ВАЖЛИВО: 'checkAndAwardAchievements' має бути оновлений,
        // щоб перевіряти статус 'COMPLETED' для замовлень.
        checkAndAwardAchievements(userId).catch(err => {
            console.error(`[Achievements] Помилка при перевірці ачівок для користувача ${userId}:`, err);
        });


        // 10. УСПІШНА ВІДПОВІДЬ
        return NextResponse.json({ success: true, orderId: savedOrder.id }, { status: 201 });

    } catch (error) {
        console.error('Помилка при створенні замовлення:', error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                return NextResponse.json({ message: 'Помилка зв\'язку даних (напр. ID страви або користувача не існує)' }, { status: 400 });
            }
        }

        return NextResponse.json({ message: 'Внутрішня помишка сервера' }, { status: 500 });
    }
}


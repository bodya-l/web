// app/api/manage/restaurants/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config'; 
import prisma from '@/lib/prisma';

// 💡 ПРИМІТКА: Ми видалили помилковий TypeScript-код (type RouteParams = ...)
// бо це .js файл. Ми використовуємо JSDoc для типів.

/**
* @typedef {object} RestaurantCreateData
* @property {string} name
* @property {string} [description]
* @property {string} [imageUrl]
*/

// Функція GET для отримання ресторанів поточного власника
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // 1. ПЕРЕВІРКА АВТОРИЗАЦІЇ
        if (!session?.user?.id || session.user.role !== 'OWNER') {
            return NextResponse.json({ message: 'Доступ заборонено. Необхідний статус ВЛАСНИКА.' }, { status: 403 });
        }
        
        // 💡 2. ВИПРАВЛЕННЯ: Перетворюємо ID сесії (рядок) на ЧИСЛО
        const ownerId = Number(session.user.id);

        if (isNaN(ownerId)) {
             return NextResponse.json({ message: 'Некоректний ID користувача' }, { status: 400 });
        }

        // 3. ОТРИМУЄМО РЕСТОРАНИ
        const restaurants = await prisma.restaurant.findMany({
            where: {
                ownerId: ownerId, // Тепер ми передаємо число
            },
            orderBy: {
                name: 'asc',
            },
            include: {
                orders: {
                    select: { id: true }
                }
            }
        });

        return NextResponse.json(restaurants, { status: 200 });

    } catch (error) {
        console.error('Error fetching owner restaurants:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// Функція POST для створення нового ресторану
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session.user.role !== 'OWNER') {
            return NextResponse.json({ message: 'Доступ заборонено. Необхідний статус ВЛАСНИКА.' }, { status: 403 });
        }
        
        // 💡 4. ВИПРАВЛЕННЯ: Тут також перетворюємо ID на число
        const ownerId = Number(session.user.id);
        if (isNaN(ownerId)) {
             return NextResponse.json({ message: 'Некоректний ID користувача' }, { status: 400 });
        }

        /** @type {RestaurantCreateData} */
        const data = await request.json();

        if (!data.name) {
            return NextResponse.json({ message: 'Restaurant name is required' }, { status: 400 });
        }

        // 5. СТВОРЕННЯ РЕСТОРАНУ
        const newRestaurant = await prisma.restaurant.create({
            data: {
                name: data.name,
                description: data.description,
                // 'imageUrl' у вас в схемі немає, але є 'logoUrl' і 'bannerUrl'
                // Я залишу як у вас, але перевірте, чи є 'imageUrl' у схемі Restaurant
                // imageUrl: data.imageUrl, 
                logoUrl: data.logoUrl, // Можливо, ви мали на увазі це?
                ownerId: ownerId, // Передаємо число
            },
        });

        return NextResponse.json(newRestaurant, { status: 201 });

    } catch (error) {
        console.error('Error creating restaurant:', error);
        if (error?.code === 'P2002') { // Унікальне обмеження
            return NextResponse.json({ message: 'Restaurant with this name already exists' }, { status: 409 });
        }
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
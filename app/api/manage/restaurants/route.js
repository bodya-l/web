// app/api/manage/restaurants/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config'; // Використовуємо абсолютний шлях
import prisma from '@/lib/prisma';

// Визначаємо очікувані типи для даних за допомогою JSDoc
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
        // У JS не можна використовувати ?.role, тому перевіряємо як JS-об'єкт
        if (!session?.user?.id || session.user.role !== 'OWNER') {
            return NextResponse.json({ message: 'Доступ заборонено. Необхідний статус ВЛАСНИКА.' }, { status: 403 });
        }
        
        // 2. ОТРИМУЄМО РЕСТОРАНИ (ЗА ОДИН ЗАПИТ)
        // ID власника вже доступний як число (встановлено в колбеках)
        const ownerId = session.user.id; 

        const restaurants = await prisma.restaurant.findMany({
            where: {
                ownerId: ownerId, 
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

        // 1. ПЕРЕВІРКА АВТОРИЗАЦІЇ
        if (!session?.user?.id || session.user.role !== 'OWNER') {
            return NextResponse.json({ message: 'Доступ заборонено. Необхідний статус ВЛАСНИКА.' }, { status: 403 });
        }
        
        const ownerId = session.user.id;
        /** @type {RestaurantCreateData} */
        const data = await request.json(); 

        if (!data.name) {
            return NextResponse.json({ message: 'Restaurant name is required' }, { status: 400 });
        }

        // 2. СТВОРЕННЯ РЕСТОРАНУ
        const newRestaurant = await prisma.restaurant.create({
            data: {
                name: data.name,
                description: data.description,
                imageUrl: data.imageUrl,
                ownerId: ownerId, 
            },
        });

        return NextResponse.json(newRestaurant, { status: 201 });

    } catch (error) {
        console.error('Error creating restaurant:', error);
        if (error?.code === 'P2002') { 
            return NextResponse.json({ message: 'Restaurant with this name already exists' }, { status: 409 });
        }
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
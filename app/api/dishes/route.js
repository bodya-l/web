// app/api/dishes/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // Ваш шлях правильний

// --- 1. ОНОВЛЕНА Функція для ОТРИМАННЯ страв (GET) ---
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // 💡 1. Отримуємо ОБИДВА параметри з URL
        const categoryName = searchParams.get('category');
        const restaurantId = searchParams.get('restaurantId'); // ⬅️ Новий параметр

        // 💡 2. Перевіряємо, що ОБИДВА параметри на місці
        if (!categoryName || !restaurantId) {
            return NextResponse.json(
                { error: 'Необхідно вказати "category" та "restaurantId"' },
                { status: 400 }
            );
        }

        // 💡 3. Оновлений запит до Prisma
        // Ми шукаємо страви, де категорія відповідає назві І ID ресторану
        const dishes = await prisma.dish.findMany({
            where: {
                category: {
                    name: categoryName,
                    restaurantId: Number(restaurantId) // ⬅️ Фільтруємо за ID ресторану
                },
            },
        });

        return NextResponse.json(dishes, { status: 200 });
    } catch (error) {
        console.error('Error fetching dishes:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// --- 2. Ваша функція для СТВОРЕННЯ нової страви (POST) ---
// (Залишаємо без змін, але додамо обробку помилок)
export async function POST(request) {
    try {
        const data = await request.json();

        // Перевірка наявності обов'язкових полів
        if (!data.name || !data.price || !data.categoryId) {
             return NextResponse.json(
                { error: 'Name, price, and categoryId are required' },
                { status: 400 }
            );
        }

        const newDish = await prisma.dish.create({
            data: {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                calories: data.calories ? parseInt(data.calories) : null,
                imageUrl: data.imageUrl,
                categoryId: parseInt(data.categoryId),
            },
        });

        return NextResponse.json(newDish, { status: 201 }); // 201 Created

    } catch (error)
    {
        console.error('Failed to create dish:', error);
        // Додамо перевірку на помилку Prisma (наприклад, неіснуюча categoryId)
        if (error.code === 'P2003') { // Foreign key constraint failed
             return NextResponse.json(
                { error: 'Invalid categoryId: This category does not exist.' },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { error: 'Failed to create dish' },
            { status: 500 }
        );
    }
}
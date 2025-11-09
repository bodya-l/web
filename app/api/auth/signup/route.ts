import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/emailService';
import { Role } from '@prisma/client'; // Імпортуємо Role

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        // 1. Валідація вхідних даних
        if (!email || !password || !name) {
            return NextResponse.json({ message: 'Ім\'я, пошта та пароль є обов\'язковими' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ message: 'Пароль має бути не менше 6 символів' }, { status: 400 });
        }

        // 2. Перевірка, чи існує користувач
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return NextResponse.json({ message: 'Користувач з такою поштою вже існує' }, { status: 409 }); // 409 Conflict
        }

        // 3. Хешування пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Створення користувача
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: Role.CUSTOMER, // Використовуємо enum
                // emailVerified залишається null
            },
        });

        // 5. Генерація та збереження коду верифікації
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-значний код
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Код дійсний 1 годину

        // 💡 --- ВИПРАВЛЕННЯ ДЛЯ БЕК-ЕНДУ ---
        // 'upsert' спричиняв помилку, бо 'email' не є @unique в схемі EmailVerificationCode.
        // Цей патерн (видалити старі коди, створити новий) є надійнішим.

        // Спочатку видаляємо ВСІ старі коди для цього email
        await prisma.emailVerificationCode.deleteMany({
            where: { email: email.toLowerCase() },
        });

        // Тепер створюємо один новий, чистий код
        await prisma.emailVerificationCode.create({
            data: {
                email: email.toLowerCase(),
                code: code,
                expiresAt: expiresAt,
            },
        });
        // --- КІНЕЦЬ ВИПРАВЛЕННЯ ---

        // 6. Надсилання email
        // 💡 --- ВИПРАВЛЕННЯ TS2345 ---
        // Використовуємо 'email.toLowerCase()' замість 'newUser.email',
        // оскільки TypeScript вважає, що 'newUser.email' може бути 'null' (через схему Prisma).
        // Ми знаємо, що 'email' тут - це 'string', бо ми валідували його на початку.
        await sendVerificationEmail(email.toLowerCase(), code);
        // --- КІНЕЦЬ ВИПРАВЛЕННЯ ---


        // 7. Успішна відповідь
        return NextResponse.json({
            message: 'Реєстрація успішна! Код верифікації надіслано на вашу пошту.',
            email: newUser.email,
        }, { status: 201 });

    } catch (error) {
        console.error('Помилка реєстрації:', error);
        return NextResponse.json({ message: 'Внутрішня помишка сервера' }, { status: 500 });
    }
}



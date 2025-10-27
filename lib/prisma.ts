// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// 1. Оголошуємо глобальну змінну з типом PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 2. Використовуємо явний тип PrismaClient
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    // 3. Тут TS автоматично визначить, що global.prisma має тип PrismaClient
    prisma = global.prisma;
}

export default prisma;
// /lib/prisma.ts

import { PrismaClient } from '@prisma/client'

// Це спеціальний код, щоб у режимі розробки (development)
// не створювалося безліч підключень до бази даних.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Опціонально: увімкни це, якщо хочеш бачити
    // SQL-запити в терміналі під час розробки
    // log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
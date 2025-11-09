import prisma from './prisma';

/**
 * Допоміжна функція для видачі ачівки
 * @param userId - ID користувача
 * @param achievementCode - Унікальний код ачівки (напр. "EXPLORER_1")
 */
async function grantAchievement(userId: number, achievementCode: string) { // <-- ТУТ ЗМІНЕНО НА NUMBER
                                                                           // Знаходимо ачівку в базі за її кодом
    const achievement = await prisma.achievement.findUnique({
        where: { code: achievementCode }
    });

    // Якщо ачівки з таким кодом немає в БД, логуємо і виходимо
    if (!achievement) {
        console.warn(`[Achievements] Ачівку з кодом ${achievementCode} не знайдено в базі даних.`);
        return;
    }

    // Створюємо запис про те, що користувач отримав цю ачівку
    // Використовуємо createMany + skipDuplicates, щоб уникнути помилки,
    // якщо такий запис вже існує (завдяки @@unique в схемі).
    await prisma.userAchievement.createMany({
        data: {
            userId: userId, // <-- Тепер це number
            achievementId: achievement.id
        },
        skipDuplicates: true
    });

    console.log(`[Achievements] Користувачу ${userId} видано ачівку ${achievementCode}`);
}


/**
 * Перевіряє та видає ачівки для користувача на основі його замовлень
 * @param userId - ID користувача, для якого робиться перевірка
 */
export async function checkAndAwardAchievements(userId: number) { // <-- ТУТ ЗМІНЕНО НА NUMBER
                                                                  // 1. Отримуємо всі замовлення користувача
                                                                  // Враховуємо лише завершені замовлення (наприклад, 'COMPLETED' або 'DELIVERED')
                                                                  // !! ВАЖЛИВО: Оновіть цей 'status', якщо у вас інша назва для завершених замовлень
                                                                  // Якщо ви хочете видавати ачівки за будь-які замовлення, просто видаліть рядок 'status'
    const userOrders = await prisma.order.findMany({
        where: {
            userId: userId, // <-- Тепер це number
            status: 'COMPLETED' // <-- Увага! Змініть, якщо потрібно
        },
        select: { restaurantId: true } // Нам потрібні лише ID ресторанів
    });

    // Якщо у користувача немає завершених замовлень, нічого не робимо
    if (userOrders.length === 0) {
        return;
    }

    // 2. Отримуємо ачівки, які у користувача ВЖE є
    const userAchievements = await prisma.userAchievement.findMany({
        where: { userId: userId }, // <-- Тепер це number
        include: { achievement: { select: { code: true } } } // Включаємо код ачівки
    });

    // Створюємо Set (набір) кодів ачівок, які вже є, для швидкої перевірки
    const ownedAchievementCodes = new Set(userAchievements.map(ua => ua.achievement.code));


    // --- 💡 ОНОВЛЕНИЙ БЛОК ЛОГІКИ ПЕРЕВІРКИ 💡 ---

    // --- Перевірки "Гурмана" (загальна кількість замовлень) ---
    const totalOrders = userOrders.length;

    if (totalOrders >= 1 && !ownedAchievementCodes.has('FOODIE_1')) {
        await grantAchievement(userId, 'FOODIE_1');
    }

    if (totalOrders >= 5 && !ownedAchievementCodes.has('FOODIE_2')) {
        await grantAchievement(userId, 'FOODIE_2');
    }

    if (totalOrders >= 10 && !ownedAchievementCodes.has('FOODIE_3')) {
        await grantAchievement(userId, 'FOODIE_3');
    }
    // (Можна додати FOODIE_4 для 25 замовлень і т.д.)


    // --- Перевірки "Дослідника" (унікальні ресторани) ---
    const distinctRestaurants = new Set(userOrders.map(o => o.restaurantId));
    const totalDistinctRestaurants = distinctRestaurants.size;

    if (totalDistinctRestaurants >= 3 && !ownedAchievementCodes.has('EXPLORER_1')) {
        await grantAchievement(userId, 'EXPLORER_1');
    }

    if (totalDistinctRestaurants >= 5 && !ownedAchievementCodes.has('EXPLORER_2')) {
        await grantAchievement(userId, 'EXPLORER_2');
    }
    // (Можна додати EXPLORER_3 для 10 ресторанів і т.д.)
}


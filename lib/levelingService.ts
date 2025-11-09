// This is a file representation.
// You can directly edit, format, and save this code.
// Your changes will be reflected in the user's view.

/**
 * Розраховує поточний рівень, прогрес та необхідний досвід на основі XP.
 * Формула: 100 XP = рівень 2, 400 XP = рівень 3, 900 XP = рівень 4
 * (level^2 * 100)
 * @param xp Загальна кількість досвіду
 * @returns Об'єкт з даними про рівень
 */
export function calculateLevel(xp: number): {
    level: number;
    progress: number;
    xpForNextLevel: number;
    xpCurrent: number;
    xpNeededForNext: number;
} {
    let level = 1;

    // Визначаємо поточний рівень
    // (рівень 2 = 100xp, рівень 3 = 400xp, рівень 4 = 900xp)
    while (xp >= level * level * 100) {
        level++;
    }

    // Якщо користувач на 1 рівні і має 0-99 xp
    if (level === 1) {
        const xpForNextLevel = 100;
        const progress = (xp / xpForNextLevel) * 100;
        return {
            level: 1,
            progress: progress,
            xpForNextLevel: xpForNextLevel,
            xpCurrent: xp,
            xpNeededForNext: xpForNextLevel,
        };
    }

    // Розрахунок для рівнів 2+
    const xpForCurrentLevel = (level - 1) * (level - 1) * 100;
    const xpForNextLevel = level * level * 100;

    const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
    const xpCurrent = xp - xpForCurrentLevel;
    const progress = Math.floor((xpCurrent / xpNeededForNext) * 100);

    return { level, progress, xpForNextLevel, xpCurrent, xpNeededForNext };
}

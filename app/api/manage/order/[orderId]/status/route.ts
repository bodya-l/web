// app/api/manage/order/[orderId]/status/route.ts
import { NextResponse } from 'next/server';
import Pusher from 'pusher';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth.config';
import { getServerSession } from 'next-auth/next';

// Ініціалізація Pusher
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
});

// ▼▼▼ Явне визначення допустимих статусів ▼▼▼
type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';

export async function PUT(
    request: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        // 1. Перевірка авторизації
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== 'OWNER') {
             return NextResponse.json({ message: 'Недостатньо прав' }, { status: 403 });
        }
        
        const orderId = parseInt(params.orderId);
        
        // 2. Отримуємо статус та явно приводимо його до нашого типу OrderStatus
        const { status } = await request.json();
        const newStatus = status as OrderStatus; // ⬅️ ВИПРАВЛЕНО
        
        // 3. Об'єкт сповіщень (тепер безпечний для використання з newStatus)
        const statusMap = {
            'PREPARING': 'прийнято до приготування! 👨‍🍳',
            'READY': 'готове та очікує видачі! 🛎️',
            'PENDING': 'очікує',
            'COMPLETED': 'видано'
        } as const;
        
        // 4. Оновлення статусу в базі даних
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus },
            select: { userId: true, id: true, status: true, restaurantId: true } // Потрібен ID клієнта
        });

        // 5. Надсилання сповіщення клієнту
        const channelName = `user-${updatedOrder.userId}`;
        const eventName = 'order-status-update';
        
        await pusher.trigger(channelName, eventName, {
            orderId: updatedOrder.id,
            newStatus: updatedOrder.status,
            message: `Ваше замовлення #${updatedOrder.id} було ${statusMap[newStatus]}`, 
        });

        return NextResponse.json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json({ message: 'Помилка сервера' }, { status: 500 });
    }
}
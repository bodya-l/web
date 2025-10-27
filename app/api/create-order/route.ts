// app/api/create-order/route.ts
import { NextResponse } from 'next/server';
import Pusher from 'pusher';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config'; // ⬅️ Імпорт конфігурації

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

// Тип даних для Pusher
type PusherItemDetails = {
    name: string;
    quantity: number;
    price: number;
};

// ▼▼▼ ТИП ДЛЯ NESTED WRITE: Як Prisma очікує дані для створення OrderItem ▼▼▼
type OrderItemCreateData = {
    dishId: number; 
    quantity: number; 
    priceAtPurchase: number; 
};

export async function POST(request: Request) {
  try {
    // 1. АВТЕНТИФІКАЦІЯ
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Неавторизовано. Увійдіть, щоб зробити замовлення.' }, { status: 401 });
    }
    const userId = session.user.id as number;

    const body: { cart: CartItem[] } = await request.json();
    const { cart } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ message: 'Кошик порожній' }, { status: 400 });
    }

    // 2. ОТРИМАННЯ СПРАВЖНІХ ЦІН З БД
    const dishIds = cart.map((item) => item.dishId);
    
    const dishesFromDb = await prisma.dish.findMany({
      where: { id: { in: dishIds } },
      include: { category: { select: { restaurantId: true } } }
    });

    if (dishesFromDb.length !== cart.length) {
      return NextResponse.json({ message: 'Деякі страви не знайдено' }, { status: 404 });
    }
    
    // Перевіряємо, чи всі страви з одного ресторану (потрібен ID першої страви)
    const restaurantId = dishesFromDb[0].category.restaurantId;
    
    // 3. РОЗРАХУНОК СУМИ та підготовка OrderItem даних
    let totalPrice = 0;
    const priceMap = new Map(dishesFromDb.map((item) => [item.id, item.price]));
    
    // ▼▼▼ ВИПРАВЛЕННЯ: Явне визначення типів масивів ▼▼▼
    const itemsToCreate: OrderItemCreateData[] = []; // ⬅️ Тепер має тип OrderItemCreateData[]
    const itemsForPusher: PusherItemDetails[] = []; // ⬅️ Ваш тип для Pusher
    // ▲▲▲ ▲▲▲ ▲▲▲
    
    cart.forEach((cartItem) => {
      const price = priceMap.get(cartItem.dishId);
      const dishName = dishesFromDb.find(d => d.id === cartItem.dishId)?.name || 'Невідома страва';
      
      if (price !== undefined) {
        totalPrice += price * cartItem.quantity;
        
        // Дані для створення записів OrderItem у БД
        itemsToCreate.push({
            dishId: cartItem.dishId,
            quantity: cartItem.quantity,
            priceAtPurchase: price, // Зберігаємо фіксовану ціну
        });
        
        // Дані для сповіщення власника
        itemsForPusher.push({
            name: dishName,
            quantity: cartItem.quantity,
            price: price
        });
      }
    });

    // 4. ЗБЕРЕЖЕННЯ В БД: Створюємо Order та OrderItems за один запит (nested write)
    const savedOrder = await prisma.order.create({
      data: {
        userId: userId,
        restaurantId: restaurantId,
        totalPrice: totalPrice,
        status: 'PENDING', 
        items: {
            create: itemsToCreate, // ⬅️ Створюємо пов'язані OrderItems
        }
      },
      // Повертаємо деталі, щоб власник міг їх бачити
      include: {
          items: {
              include: { dish: { select: { name: true } } }
          }
      }
    });

    // 5. PUSHER: Сповіщаємо власника ресторану
    const channelName = `restaurant-${restaurantId}`;
    const eventName = 'new-order';
    
    await pusher.trigger(channelName, eventName, {
      message: 'Нове замовлення!',
      order: savedOrder,
      items: itemsForPusher, // Надсилаємо об'єкти для миттєвого відображення
      userName: session.user.name || 'Анонім',
    });

    return NextResponse.json({ success: true, order: savedOrder }, { status: 201 });
  } catch (error) {
    console.error('Помилка при створенні замовлення:', error);
    return NextResponse.json({ message: 'Внутрішня помишка сервера' }, { status: 500 });
  }
}
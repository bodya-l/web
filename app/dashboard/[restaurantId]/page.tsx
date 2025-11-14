// app/dashboard/[restaurantId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { useParams } from 'next/navigation';
import { Utensils, Timer, Clock } from 'lucide-react';

// --- ТИПИ ---

// Локальний тип, який використовує UI для відображення
type ItemDetails = {
    name: string;
    quantity: number;
    price: number;
}

// Локальний тип замовлення для UI
type Order = {
    id: number;
    createdAt: string;
    totalPrice: number;
    userName: string;
    items: ItemDetails[];
    status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';
};

// 💡 1. Тип даних, що надходять з API (при завантаженні історії)
// (Припускаємо, що API повертає таку структуру з Prisma)
type ApiOrderResponse = {
    id: number;
    createdAt: string;
    totalPrice: number;
    status: Order['status'];
    user: {
        name: string | null;
    };
    items: {
        quantity: number;
        priceAtPurchase: number;
        dish: {
            name: string;
        };
    }[];
};

// 💡 2. Тип даних, що надходять з PUSHER (з /api/create-order)
type NewOrderPusherPayload = {
    message: string;
    order: {
        id: number;
        totalPrice: number;
        status: 'PENDING';
        createdAt: string;
        items: {
            name: string;
            quantity: number;
            priceAtPurchase: number;
        }[];
    };
    userName: string;
};

// --- КОНСТАНТИ ТА ХЕЛПЕРИ ---

const getStatusColor = (status: Order['status']) => {
    switch (status) {
        case 'READY': return 'text-green-600 bg-green-100';
        case 'PREPARING': return 'text-yellow-600 bg-yellow-100';
        case 'COMPLETED': return 'text-gray-600 bg-gray-100';
        default: return 'text-red-600 bg-red-100';
    }
};

const STATUS_PRIORITY = {
    'READY': 1,
    'PREPARING': 2,
    'PENDING': 3,
    'COMPLETED': 4,
};

const sortOrders = (orders: Order[]) => {
    return [...orders].sort((a, b) => {
        const priorityA = STATUS_PRIORITY[a.status];
        const priorityB = STATUS_PRIORITY[b.status];

        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }

        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
};


export default function RestaurantDashboard() {
    const params = useParams();
    const restaurantId = params.restaurantId as string;

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Завантаження історії та налаштування Pusher
    useEffect(() => {
        if (!restaurantId) return;

        const channelName = `restaurant-${restaurantId}`;

        // --- A. Завантаження історії з БД ---
        const fetchInitialOrders = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/orders/restaurant/${restaurantId}`, {
                    cache: 'no-store'
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || 'Не вдалося завантажити історію замовлень.');
                }

                // 💡 3. ОТРИМУЄМО "СИРІ" ДАНІ З API
                const data: ApiOrderResponse[] = await res.json();

                // 💡 4. ТРАНСФОРМУЄМО ДАНІ У ЛОКАЛЬНИЙ ТИП "Order"
                const transformedOrders: Order[] = data.map(order => ({
                    id: order.id,
                    createdAt: order.createdAt,
                    totalPrice: order.totalPrice,
                    status: order.status,
                    // Мапимо вкладені дані
                    userName: order.user?.name || 'Клієнт', // ⬅️ з order.user.name
                    items: order.items.map(item => ({     // ⬅️ з order.items
                        name: item.dish.name,
                        quantity: item.quantity,
                        price: item.priceAtPurchase
                    }))
                }));

                setOrders(sortOrders(transformedOrders)); // ⬅️ СОРТУЄМО ТРАНСФОРМОВАНІ
            } catch (err: any) {
                setError(err.message);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialOrders();


        // --- B. Налаштування Pusher ---
        const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        const channel = pusherClient.subscribe(channelName);

        // 💡 5. ВИПРАВЛЕНО: Слухач НОВИХ ЗАМОВЛЕНЬ
        channel.bind('new-order', (data: NewOrderPusherPayload) => {
            console.log('Pusher: Отримано нове замовлення!', data);

            // Розпаковуємо дані згідно типу NewOrderPusherPayload
            const newOrder: Order = {
                id: data.order.id,
                createdAt: data.order.createdAt,
                totalPrice: data.order.totalPrice,
                status: data.order.status, // Це 'PENDING'
                userName: data.userName,   // ⬅️ з data.userName
                items: data.order.items.map(item => ({ // ⬅️ з data.order.items
                    name: item.name,
                    quantity: item.quantity,
                    price: item.priceAtPurchase
                })),
            };

            setOrders(prev => sortOrders([newOrder, ...prev]));
        });

        // Слухач ОНОВЛЕННЯ СТАТУСУ (цей код був коректним)
        channel.bind('order-status-update', (data: { orderId: number, newStatus: Order['status'] }) => {
            console.log('Pusher: Отримано оновлення статусу!', data);
            setOrders(prev => {
                const updatedOrders = prev.map(order =>
                    order.id === data.orderId ? { ...order, status: data.newStatus } : order
                );
                return sortOrders(updatedOrders);
            });
        });


        // Cleanup
        return () => {
            channel.unbind_all();
            pusherClient.unsubscribe(channelName);
            pusherClient.disconnect();
        };
    }, [restaurantId]);


    // 3. Зміна статусу (Цей код був коректним)
    const handleStatusChange = async (orderId: number, currentStatus: Order['status']) => {
        let newStatus: Order['status'];

        if (currentStatus === 'PENDING') newStatus = 'PREPARING';
        else if (currentStatus === 'PREPARING') newStatus = 'READY';
        else if (currentStatus === 'READY') newStatus = 'COMPLETED';
        else return;

        // 1. Оптимістичне оновлення UI та сортування
        setOrders(prev => {
            const updatedOrders = prev.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            );
            return sortOrders(updatedOrders);
        });

        // 2. Виклик API для збереження та сповіщення
        try {
            const res = await fetch(`/api/manage/order/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                throw new Error('Не вдалося оновити статус на сервері.');
                // (Тут можна додати логіку відкату стану, якщо запит не вдався)
            }
        } catch (error) {
            console.error("Помилка PUT-запиту:", error);
            // (Логіка відкату)
        }
    };

    // --- РЕНДЕР ---

    if (isLoading) return <div className="p-8 text-center text-gray-500">Завантаження історії замовлень...</div>;
    if (error) return <div className="p-8 text-center text-red-600">Помилка: {error}</div>;

    return (
        <main className="w-full min-h-screen bg-gray-50 p-4 sm:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Utensils size={32} className="text-indigo-600"/>
                    Кухня (Дашборд) - Ресторан #{restaurantId}
                </h1>
                <p className="text-gray-500 mt-1">Очікують на прийняття: {orders.filter(o => o.status === 'PENDING').length || 0}</p>
            </header>

            {/* Список замовлень */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        // Картка замовлення
                        <div key={order.id} className={`bg-white rounded-xl shadow-lg border flex flex-col justify-between p-6 ${order.status === 'PENDING' ? 'border-red-200' : 'border-gray-100'}`}>

                            {/* Хедер картки */}
                            <div className="mb-4">
                                <div className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(order.status)} mb-2`}>
                                    {order.status === 'PENDING' ? <Clock size={14} className="mr-1"/> : <Timer size={14} className="mr-1"/>}
                                    {order.status}
                                </div>
                                <h3 className="text-xl font-bold mb-1">Замовлення #{order.id}</h3>
                                <p className="text-sm text-gray-600">Клієнт: {order.userName}</p>
                                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString('uk-UA')}</p>
                            </div>

                            {/* Деталі замовлення */}
                            <div className="flex-grow py-4 border-y border-gray-100">
                                <ul className="space-y-1 text-sm max-h-40 overflow-y-auto pr-2">
                                    {order.items.map((item, index) => (
                                        <li key={index} className="flex justify-between items-start gap-2">
                                            <span className="text-gray-700 font-medium break-words pr-2">{item.name} (x{item.quantity})</span>
                                            <span className="text-gray-500 font-semibold flex-shrink-0">{item.price.toFixed(2)} грн</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Футер картки */}
                            <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-extrabold text-indigo-600">
                  Всього: {order.totalPrice.toFixed(2)} грн
                </span>

                                {/* Кнопка дії */}
                                {order.status === 'PENDING' && (
                                    <button
                                        onClick={() => handleStatusChange(order.id, 'PENDING')}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition shadow-sm"
                                    >
                                        Прийняти
                                    </button>
                                )}
                                {order.status === 'PREPARING' && (
                                    <button
                                        onClick={() => handleStatusChange(order.id, 'PREPARING')}
                                        className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition shadow-sm"
                                    >
                                        Готово
                                    </button>
                                )}
                                {order.status === 'READY' && (
                                    <button
                                        onClick={() => handleStatusChange(order.id, 'READY')}
                                        className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-500 transition shadow-sm"
                                    >
                                        Видати
                                    </button>
                                )}
                                {order.status === 'COMPLETED' && (
                                    <span className="text-sm font-medium text-gray-500">Завершено</span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 p-10 bg-white rounded-xl shadow-inner">Нових замовлень не надходило.</p>
                )}
            </div>
        </main>
    );
}
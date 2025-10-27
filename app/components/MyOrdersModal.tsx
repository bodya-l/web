// app/components/MyOrdersModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Clock, Utensils, CheckCircle, Package, Eye } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Pusher from 'pusher-js';
import OrderDetailsModal from './OrderDetailsModal';

// ▼▼▼ ТИПИ ТА ІНТЕРФЕЙСИ ▼▼▼
type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';
type OrderItemDetail = { name: string; quantity: number; price: number; };

type OrderDisplay = {
    id: number;
    createdAt: string;
    totalPrice: number;
    status: OrderStatus;
    items: OrderItemDetail[]; 
};

const getStatusDetails = (status: OrderStatus) => {
    switch (status) {
        case 'READY': return { icon: CheckCircle, text: 'Готове до видачі!', color: 'text-green-600 bg-green-100' };
        case 'PREPARING': return { icon: Utensils, text: 'Готується', color: 'text-yellow-600 bg-yellow-100' };
        case 'COMPLETED': return { icon: Package, text: 'Завершено', color: 'text-gray-600 bg-gray-100' };
        default: return { icon: Clock, text: 'Очікує прийняття', color: 'text-red-600 bg-red-100' };
    }
};

// Інтерфейс для пропсів (ми отримуємо ID ресторану з menu-secondary/page.tsx)
interface MyOrdersModalProps {
    isOpen: boolean;
    onClose: () => void;
    restaurantId: string; // ⬅️ Потрібен ID ресторану для підписки на НОВІ замовлення
}


export default function MyOrdersModal({ isOpen, onClose, restaurantId }: MyOrdersModalProps) {
    const [orders, setOrders] = useState<OrderDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session, status } = useSession();
    const userId = session?.user?.id;
    const userIdString = userId ? String(userId) : null;
    
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderDisplay | null>(null);
    
    const openDetails = (order: OrderDisplay) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };


    // 1. Завантаження історії замовлень клієнта (працює при відкритті)
    useEffect(() => {
        if (!isOpen || status !== 'authenticated' || !userId) return;

        setIsLoading(true); 
        fetch(`/api/orders/my`, { cache: 'no-store' }) // Завжди свіжі дані
            .then(res => {
                if (!res.ok) throw new Error('Не вдалося завантажити історію замовлень.');
                return res.json();
            })
            .then(setOrders)
            .catch(err => {
                setError('Не вдалося завантажити історію замовлень.');
            })
            .finally(() => { 
                setIsLoading(false);
            });
            
    }, [isOpen, status, userId]); // Залежність від isOpen - завантажуємо при відкритті

    // 2. Логіка підписки на Pusher (ОНОВЛЕННЯ СТАТУСУ та НОВІ ЗАМОВЛЕННЯ)
    useEffect(() => {
        if (status !== 'authenticated' || !userIdString || !restaurantId) {
            return;
        }
        
        // Підписка на канал для НОВОГО ЗАМОВЛЕННЯ (як власник)
        const restChannelName = `restaurant-${restaurantId}`;
        // Підписка на канал для ОНОВЛЕННЯ СТАТУСУ (канал клієнта)
        const userChannelName = `user-${userIdString}`;

        const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });
        
        const restChannel = pusherClient.subscribe(restChannelName);
        const userChannel = pusherClient.subscribe(userChannelName);

        // A. Слухач для НОВИХ ЗАМОВЛЕНЬ (подія, надіслана з /api/create-order)
        restChannel.bind('new-order', (data: { order: any, items: OrderItemDetail[], userName: string }) => {
            // Фільтруємо, щоб оновлювати замовлення ТІЛЬКИ для поточного користувача
            if (data.order.userId === userId) {
                 const newOrder: OrderDisplay = {
                    id: data.order.id,
                    createdAt: data.order.createdAt,
                    totalPrice: data.order.totalPrice,
                    status: 'PENDING',
                    items: data.items, // Використовуємо items з Pusher payload
                 };
                setOrders(prev => [newOrder, ...prev]); // ⬅️ МИТТЄВО ДОДАЄМО ЗАМОВЛЕННЯ
                alert(`🔔 Нове замовлення №${data.order.id} успішно відправлено!`);
            }
        });
        
        // B. Слухач для ОНОВЛЕННЯ СТАТУСУ
        userChannel.bind('order-status-update', (data: { orderId: number, newStatus: OrderStatus, message: string }) => {
            setOrders(prev => prev.map(order => 
                order.id === data.orderId ? { ...order, status: data.newStatus } : order
            ));
        });


        return () => {
          restChannel.unbind_all();
          userChannel.unbind_all();
          pusherClient.unsubscribe(restChannelName);
          pusherClient.unsubscribe(userChannelName);
          pusherClient.disconnect();
        };
    }, [isOpen, userId, userIdString, status, restaurantId, session?.user?.id]); // Додано всі залежності


    if (!isOpen) {
        return null;
    }

    return (
        // ... (весь return)
        <>
            {/* Модалка деталей */}
            {selectedOrder && (
                <OrderDetailsModal
                    isOpen={isDetailsOpen}
                    onClose={() => setIsDetailsOpen(false)}
                    orderId={selectedOrder.id}
                    items={selectedOrder.items}
                    total={selectedOrder.totalPrice}
                />
            )}

            {/* Основна модалка історії замовлень */}
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50" onClick={onClose}>
                <div className="bg-white rounded-xl w-full max-w-xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                    <button className="absolute top-3 right-4 text-2xl text-gray-400 cursor-pointer z-10 hover:text-gray-600" onClick={onClose}>
                        <X size={24} />
                    </button>
                    
                    <h2 className="text-2xl font-bold text-gray-900 p-6 pb-0">
                        Мої Замовлення
                    </h2>

                    <div className="p-6 overflow-y-auto flex-grow space-y-4">
                        {isLoading ? (
                            <p className="text-center text-gray-500 py-8">Завантаження...</p>
                        ) : error ? (
                            <p className="text-center text-red-600 py-8">{error}</p>
                        ) : orders.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">Ви ще не робили замовлень.</p>
                        ) : (
                            orders.map((order) => {
                                const details = getStatusDetails(order.status);
                                
                                const hasItems = order.items && order.items.length > 0;
                                
                                return (
                                    <div key={order.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-lg font-bold">Замовлення #{order.id}</h3>
                                            <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${details.color}`}>
                                                <details.icon size={14} className="mr-1"/>
                                                {details.text}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-sm mb-1">
                                            Дата: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                                        </p>
                                        <div className="flex justify-between items-end pt-2 border-t border-gray-200 mt-2">
                                            <span className="text-xl font-extrabold text-indigo-600">
                                                {order.totalPrice.toFixed(2)} грн
                                            </span>
                                            
                                            {/* КНОПКА "Переглянути замовлення" */}
                                            {hasItems ? (
                                                <button 
                                                    onClick={() => openDetails(order)}
                                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-semibold transition"
                                                >
                                                    <Eye size={18} />
                                                    Переглянути замовлення
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400">Деталі відсутні</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="p-6 pt-0 flex-shrink-0">
                        <button onClick={onClose} className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-bold hover:bg-gray-300 transition">
                            Закрити
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
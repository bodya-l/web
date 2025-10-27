// app/dashboard/[restaurantId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { useParams } from 'next/navigation';
import { Utensils, Timer, Clock } from 'lucide-react'; 

// Типи, що відповідають даним Pusher та БД
type ItemDetails = {
  name: string;
  quantity: number;
  price: number;
}

type Order = {
  id: number;
  createdAt: string;
  totalPrice: number;
  userName: string;
  items: ItemDetails[];
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';
  priority?: number; // Додано для сортування
};

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'READY': return 'text-green-600 bg-green-100';
    case 'PREPARING': return 'text-yellow-600 bg-yellow-100';
    case 'COMPLETED': return 'text-gray-600 bg-gray-100';
    default: return 'text-red-600 bg-red-100';
  }
};

// МАПА ПРІОРИТЕТІВ (повторюємо, щоб UI знав логіку)
const STATUS_PRIORITY = {
    'READY': 1,       
    'PREPARING': 2,   
    'PENDING': 3,     
    'COMPLETED': 4,   
};

// ⬅️ ФУНКЦІЯ СОРТУВАННЯ
const sortOrders = (orders: Order[]) => {
    return [...orders].sort((a, b) => {
        const priorityA = STATUS_PRIORITY[a.status];
        const priorityB = STATUS_PRIORITY[b.status];
        
        // 1. Сортування за статусом (пріоритет)
        if (priorityA !== priorityB) {
            return priorityA - priorityB; // ASC: 1, 2, 3...
        }
        
        // 2. Сортування за часом (від найстарішого до новішого)
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
};


export default function RestaurantDashboard() {
  const params = useParams();
  const restaurantId = params.restaurantId as string;
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Завантаження історії замовлень з БД та налаштування Pusher
  useEffect(() => {
    if (!restaurantId) return;

    const channelName = `restaurant-${restaurantId}`;
    
    // --- A. Завантаження історії з БД (гарантує стійкість) ---
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

            const data: Order[] = await res.json();
            setOrders(sortOrders(data)); // ⬅️ СОРТУЄМО ПРИ ЗАВАНТАЖЕННІ
        } catch (err: any) {
            setError(err.message);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchInitialOrders();


    // --- B. Налаштування Pusher (для миттєвих оновлень) ---
    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusherClient.subscribe(channelName);

    // Слухач: НОВІ ЗАМОВЛЕННЯ
    channel.bind('new-order', (data: { order: any, items: ItemDetails[], userName: string }) => {
      const newOrder: Order = {
          id: data.order.id,
          createdAt: data.order.createdAt,
          totalPrice: data.order.totalPrice,
          userName: data.userName,
          items: data.items,
          status: 'PENDING',
      };
      // Додаємо нове замовлення та пересортовуємо весь список
      setOrders(prev => sortOrders([newOrder, ...prev])); 
    });

    // Слухач: ОНОВЛЕННЯ СТАТУСУ (на випадок, якщо хтось інший натиснув кнопку)
    channel.bind('order-status-update', (data: { orderId: number, newStatus: Order['status'] }) => {
         setOrders(prev => {
             const updatedOrders = prev.map(order => 
                 order.id === data.orderId ? { ...order, status: data.newStatus } : order
             );
             return sortOrders(updatedOrders); // ⬅️ ПЕРЕСОРТОВУЄМО
         });
    });


    // Cleanup
    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(channelName);
      pusherClient.disconnect();
    };
  }, [restaurantId]);
  
  
  // 3. Зміна статусу (PUT API та сповіщення клієнта)
  const handleStatusChange = async (orderId: number, currentStatus: Order['status']) => {
      let newStatus: Order['status'];

      if (currentStatus === 'PENDING') newStatus = 'PREPARING';
      else if (currentStatus === 'PREPARING') newStatus = 'READY';
      else if (currentStatus === 'READY') newStatus = 'COMPLETED';
      else return; 

      // 1. Оновлюємо UI миттєво та ПЕРЕСОРТОВУЄМО
      setOrders(prev => {
            const updatedOrders = prev.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            );
            return sortOrders(updatedOrders); // ⬅️ ПЕРЕСОРТОВУЄМО
        });
      
      // 2. Викликаємо API для збереження статусу та сповіщення клієнта
      try {
          const res = await fetch(`/api/manage/order/${orderId}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: newStatus }),
          });
          
          if (!res.ok) {
              throw new Error('Не вдалося оновити статус на сервері.');
          }
      } catch (error) {
          console.error("Помилка PUT-запиту:", error);
      }
  };

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
            <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col justify-between">
              
              {/* Хедер картки */}
              <div className="mb-4">
                <div className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(order.status)} mb-2`}>
                  {order.status === 'PENDING' ? <Clock size={14} className="mr-1"/> : <Timer size={14} className="mr-1"/>}
                  {order.status}
                </div>
                <h3 className="text-xl font-bold mb-1">Замовлення #{order.id}</h3>
                <p className="text-sm text-gray-600">Клієнт: {order.userName}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</p>
              </div>

              {/* Деталі замовлення */}
              <div className="flex-grow py-4 border-y border-gray-100">
                <ul className="space-y-1 text-sm">
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
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition"
                  >
                    Прийняти
                  </button>
                )}
                {order.status === 'PREPARING' && (
                  <button 
                      onClick={() => handleStatusChange(order.id, 'PREPARING')}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition"
                  >
                    Готово
                  </button>
                )}
                {order.status === 'READY' && (
                  <button 
                      onClick={() => handleStatusChange(order.id, 'READY')}
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-500 transition"
                  >
                    Видати
                  </button>
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
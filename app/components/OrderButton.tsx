// app/components/OrderButton.tsx
'use client';

import { useState } from 'react';

type CartItem = {
  dishId: number; 
  quantity: number;
};

type Props = {
  cartItems: CartItem[];
  restaurantId: string; // 💡 1. Додаємо restaurantId до пропсів
};

export function OrderButton({ cartItems, restaurantId }: Props) { // 💡 2. Отримуємо restaurantId
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrderClick = async () => {
    setIsLoading(true);
    setError(null);

    // 💡 3. Додаємо restaurantId до даних, що відправляються
    const orderData = {
      cart: cartItems,
      restaurantId: restaurantId, // ⬅️ Ось воно!
    };

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData), // 💡 4. Відправляємо повні дані
      });

      if (!response.ok) {
        let errData = { message: 'Помилка сервера' };
        try {
            errData = await response.json();
        } catch (e) {
            // Ігноруємо
        }
        throw new Error(errData.message || `Помилка: ${response.status}`);
      }

      const result = await response.json();
      alert('Ваше замовлення прийнято! Очікуйте підтвердження.');
      
      // Тут можна також очистити кошик, якщо потрібно
      // clearCart(); 

    } catch (err: any) {
      setError(err.message);
      alert(`Сталася помилка: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleOrderClick} 
        disabled={isLoading || cartItems.length === 0}
        className="w-full bg-green-600 text-white px-4 py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isLoading ? 'Обробка...' : 'Замовити'}
      </button>
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
    </div>
  );
}
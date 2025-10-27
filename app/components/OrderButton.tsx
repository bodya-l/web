// app/components/OrderButton.tsx
'use client';

import { useState } from 'react';

// Тип для позиції в кошику (dishId тепер number)
type CartItem = {
  dishId: number; 
  quantity: number;
};

type Props = {
  cartItems: CartItem[];
};

export function OrderButton({ cartItems }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrderClick = async () => {
    setIsLoading(true);
    setError(null);

    const orderData = {
      cart: cartItems,
    };

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        let errData = { message: 'Помилка сервера' };
        try {
            errData = await response.json();
        } catch (e) {
            // Ігноруємо помилку, якщо відповідь не JSON (наприклад, 404 HTML)
        }
        throw new Error(errData.message || `Помилка: ${response.status}`);
      }

      const result = await response.json();
      alert('Ваше замовлення прийнято! Очікуйте підтвердження.');
      
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
        // Tailwind стилі
        className="w-full bg-green-600 text-white px-4 py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isLoading ? 'Обробка...' : 'Замовити'}
      </button>
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
    </div>
  );
}
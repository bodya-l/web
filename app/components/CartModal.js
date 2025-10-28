// app/components/CartModal.js
'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext'; 
import Image from 'next/image';
import { X, Trash2, Minus, Plus } from 'lucide-react';

// 💡 1. Компонент тепер приймає "restaurantId" як пропс
export default function CartModal({ isOpen, onClose, restaurantId }) {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart(); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) {
        return null;
    }

    // --- ▼ ЛОГІКА ОФОРМЛЕННЯ ЗАМОВЛЕННЯ ▼ ---
    const handlePlaceOrder = async () => {
        setIsLoading(true);
        setError('');
        
        const itemsForApi = cartItems.map(item => ({
            dishId: item.id,
            quantity: item.quantity
        }));

        // 💡 2. Додаткова перевірка, що ID ресторану є
        if (!restaurantId) {
            setError('Помилка: не вдалося визначити ресторан. Оновіть сторінку.');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                
                // 💡 3. ГОЛОВНА ЗМІНА: Додаємо restaurantId в тіло запиту
                body: JSON.stringify({ 
                    cart: itemsForApi,
                    restaurantId: restaurantId // ⬅️ Ось воно!
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to place order');
            }

            // Успіх!
            alert('Ваше замовлення успішно оформлено! Очікуйте підтвердження на Кухні.');
            
            clearCart(); 
            onClose(); // Закриваємо модалку

        } catch (err) {
            console.error('Order error:', err);
            // Покращена обробка помилок
            if (err instanceof Error) {
                setError(`Помилка замовлення: ${err.message}`);
            } else {
                setError('Сталася невідома помилка при замовленні');
            }
        } finally {
            setIsLoading(false);
        }
    };
    // --- ▲ КІНЕЦЬ ЛОГІКИ ▲ ---


    return (
        // profileOverlay
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50" onClick={onClose}>
            {/* profileModal + cartModal (max-w-lg) */}
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* profileCloseButton */}
                <button className="absolute top-3 right-4 text-2xl text-gray-400 cursor-pointer z-10 hover:text-gray-600" onClick={onClose}>
                    <X size={24} />
                </button>
                
                {/* modalTitle */}
                <h2 className="text-2xl font-bold text-gray-900 p-6 pb-0">
                    Ваш Кошик
                </h2>

                {/* cartModalContent */}
                <div className="p-6 overflow-y-auto flex-grow">
                    {/* cartItemsList */}
                    {cartItems.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Ваш кошик порожній.</p>
                    ) : (
                        <div className="max-h-[40vh] overflow-y-auto pr-2">
                            {cartItems.map((item) => (
                                // cartItem
                                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-b-0">
                                    {/* cartItemImage */}
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={item.imageUrl || '/images/placeholder.jpg'}
                                            alt={item.name}
                                            width={50}
                                            height={50}
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                    {/* cartItemDetails */}
                                    <div className="flex-grow text-left overflow-hidden">
                                        <span className="block font-medium mb-1 text-sm truncate">{item.name}</span>
                                        <span className="text-sm text-gray-600">{item.price} грн</span>
                                    </div>
                                    {/* cartItemQuantity */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="bg-gray-100 rounded-full w-7 h-7 text-lg leading-7 cursor-pointer text-gray-600 flex items-center justify-center transition hover:bg-gray-200"
                                        >
                                            <Minus size={16}/>
                                        </button>
                                        <span className="font-medium min-w-[20px] text-center">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="bg-gray-100 rounded-full w-7 h-7 text-lg leading-7 cursor-pointer text-gray-600 flex items-center justify-center transition hover:bg-gray-200"
                                        >
                                            <Plus size={16}/>
                                        </button>
                                    </div>
                                    {/* cartItemRemove */}
                                    <button 
                                        className="bg-none border-none text-lg text-gray-400 cursor-pointer px-2 flex-shrink-0 transition hover:text-red-500" 
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div> 

                {/* loginError (з адаптованими margin) */}
                {error && (
                    <div className="px-6 pb-4">
                        <p className="text-red-700 bg-red-100 border border-red-300 rounded-lg p-3 text-sm text-center">
                            {error}
                        </p>
                    </div>
                )}

                {/* cartFooter */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-200 pt-6 p-6 flex-shrink-0">
                        {/* cartTotal */}
                        <div className="flex justify-between text-lg font-bold mb-6">
                            <span>Разом:</span>
                            <span>{cartTotal.toFixed(2)} грн</span>
                        </div>
                        {/* Кнопка "Замовити" (зелена) */}
                        <button
                            className="w-full px-4 py-3 rounded-lg font-medium text-base bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={handlePlaceOrder}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Оформлення...' : 'Замовити'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
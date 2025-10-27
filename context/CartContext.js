// context/CartContext.js
'use client';

import React, { createContext, useState, useContext } from 'react';

// Створюємо сам контекст
const CartContext = createContext();

// Створюємо "провайдер" - компонент, який буде огортати додаток
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]); // Стан для зберігання товарів

    // Функція додавання товару в кошик
    const addToCart = (dish) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === dish.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevItems, { 
                    ...dish, 
                    quantity: 1,
                }];
            }
        });
    };

    // Функція видалення товару
    const removeFromCart = (dishId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== dishId));
    };

    // Функція оновлення кількості
    const updateQuantity = (dishId, quantity) => {
        const newQuantity = Math.max(1, quantity);
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === dishId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // ▼▼▼ ДОДАНО: Функція очищення кошика ▼▼▼
    const clearCart = () => {
        setCartItems([]);
    };
    // ▲▲▲ ▲▲▲ ▲▲▲


    // Розрахунок загальної суми та кількості
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);


    // Значення, яке буде доступне всім компонентам всередині провайдера
    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart, // ⬅️ Експортуємо нову функцію
        cartTotal,
        cartCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Хук для зручного доступу до контексту
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
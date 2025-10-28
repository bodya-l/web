// context/CartContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    
    // 💡 1. Новий стан для відстеження ID ресторану в кошику
    const [cartRestaurantId, setCartRestaurantId] = useState(null);
    
    // Стан, щоб уникнути помилок гідратації при роботі з localStorage
    const [isCartLoaded, setIsCartLoaded] = useState(false);

    // 💡 2. Завантаження кошика з localStorage при першому завантаженні
    useEffect(() => {
        try {
            const itemsFromStorage = localStorage.getItem('cartItems');
            const restaurantIdFromStorage = localStorage.getItem('cartRestaurantId');
            
            if (itemsFromStorage) {
                setCartItems(JSON.parse(itemsFromStorage));
            }
            if (restaurantIdFromStorage) {
                setCartRestaurantId(restaurantIdFromStorage);
            }
        } catch (error) {
            console.error("Failed to load cart from localStorage", error);
            // Очищуємо сховище у разі пошкоджених даних
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cartRestaurantId');
        }
        setIsCartLoaded(true);
    }, []);

    // 💡 3. Збереження кошика в localStorage при будь-яких змінах
    useEffect(() => {
        // Не зберігаємо, поки кошик не завантажено
        if (!isCartLoaded) return; 
        
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            if (cartRestaurantId) {
                localStorage.setItem('cartRestaurantId', cartRestaurantId);
            } else {
                localStorage.removeItem('cartRestaurantId');
            }
        } catch (error) {
            console.error("Failed to save cart to localStorage", error);
        }
    }, [cartItems, cartRestaurantId, isCartLoaded]);

    /**
     * 💡 4. ОНОВЛЕНА ФУНКЦІЯ addToCart
     * Тепер приймає 'dish' (об'єкт страви) та 'restaurantId' (ID ресторану)
     */
    const addToCart = (dish, restaurantId) => {
        // Перевіряємо, чи ресторан збігається
        if (cartItems.length > 0 && cartRestaurantId !== restaurantId) {
            alert(
                'Ваш кошик містить страви з іншого ресторану. ' +
                'Будь ласка, очистіть кошик, перш ніж додавати нові страви.'
            );
            return; // ⬅️ Зупиняємо виконання
        }

        // Якщо кошик був порожній, "блокуємо" його під цей ресторан
        if (cartItems.length === 0) {
            setCartRestaurantId(restaurantId);
        }

        // Логіка додавання товару
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === dish.id);
            
            if (existingItem) {
                // Збільшуємо кількість
                return prevItems.map(item =>
                    item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // Додаємо новий товар
                return [...prevItems, { ...dish, quantity: 1 }];
            }
        });
    };

    /**
     * 💡 5. ОНОВЛЕНА ФУНКЦІЯ clearCart
     * Тепер також очищує ID ресторану
     */
    const clearCart = () => {
        setCartItems([]);
        setCartRestaurantId(null); 
        // localStorage очиститься автоматично завдяки useEffect
    };

    // --- Інші функції кошика (оновлені, щоб скидати restaurantId) ---

    const removeFromCart = (dishId) => {
        setCartItems(prevItems => {
            const newItems = prevItems.filter(item => item.id !== dishId);
            // Якщо кошик став порожнім, скидаємо ID ресторану
            if (newItems.length === 0) {
                setCartRestaurantId(null);
            }
            return newItems;
        });
    };

    const updateQuantity = (dishId, quantity) => {
        if (quantity <= 0) {
            // Якщо кількість 0 або менше, видаляємо товар
            removeFromCart(dishId);
            return;
        }

        setCartItems(prevItems => 
            prevItems.map(item =>
                item.id === dishId ? { ...item, quantity: quantity } : item
            )
        );
    };

    // --- Обчислювані значення ---

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartRestaurantId, // Можна використовувати для UI
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
                cartDetails: cartItems, // (З вашого CartModal)
                isCartLoaded, // Корисно, щоб не показувати 0 в кошику до завантаження
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Hook для легкого доступу до контексту
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
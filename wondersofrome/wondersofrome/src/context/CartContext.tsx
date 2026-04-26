'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: string;
    tourId: string;
    tourTitle: string;
    tourSlug: string;
    date: string;
    time: string;
    guestCounts: Record<string, number>;
    price: number;
    image?: string;
    addOns?: Array<{ name: string; price: number }>;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateItem: (id: string, updates: Partial<CartItem>) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = `${process.env.NEXT_PUBLIC_SITE_ID || 'wondersofrome'}-cart`;

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setItems(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load cart:', e);
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            } catch (e) {
                console.error('Failed to save cart:', e);
            }
        }
    }, [items, isLoaded]);

    const addToCart = (item: CartItem) => {
        setItems(prev => {
            const existingIndex = prev.findIndex(
                i => i.tourId === item.tourId && i.date === item.date && i.time === item.time
            );

            if (existingIndex >= 0) {
                const updated = [...prev];
                const existingItem = updated[existingIndex];
                const newGuestCounts = { ...existingItem.guestCounts };

                Object.entries(item.guestCounts).forEach(([type, count]) => {
                    newGuestCounts[type] = (newGuestCounts[type] || 0) + count;
                });

                updated[existingIndex] = {
                    ...existingItem,
                    guestCounts: newGuestCounts,
                    price: existingItem.price + item.price,
                };
                return updated;
            }

            return [...prev, item];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateItem = (id: string, updates: Partial<CartItem>) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((sum, item) =>
        sum + Object.values(item.guestCounts || {}).reduce((s, c) => s + (c || 0), 0), 0
    );

    const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateItem,
            clearCart,
            totalItems,
            totalPrice,
            isCartOpen,
            setIsCartOpen,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

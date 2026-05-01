import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'yuna_florist_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Gagal membaca keranjang:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
  const productId = product.id;

  if (!productId) {
    console.warn('Produk tidak punya ID, tidak bisa masuk keranjang.');
    return;
  }

  setItems((prevItems) => {
    const existingItem = prevItems.find((item) => item.productId === productId);

    if (existingItem) {
      return prevItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [
      ...prevItems,
      {
        productId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      }
    ];
  });
};

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const increaseQuantity = (productId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: string) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }

  return context;
}
/*

import { createContext, useState, ReactNode, useContext } from 'react';
import type { Book } from '../data/books';

interface CartItem {
  book: Book;
  quantity: number;
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (book: Book, quantity: number) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (book: Book, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.book.id === book.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { book, quantity }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.book.id !== bookId));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// useCart hook moved to a separate file (useCart.ts)

*/
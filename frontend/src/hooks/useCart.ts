import { useState, useEffect } from 'react';
import type { CartItem } from '../context/CartTypes';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const storedCart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    if (storedCart.length > 0) {
      const uniqueItems = storedCart.reduce((acc: CartItem[], item) => {
        const existingItem = acc.find((i) => i.id === item.id);
        if (existingItem) {
          existingItem.quantity += item.quantity > 0 ? item.quantity : 1;
        } else {
          acc.push({ ...item, quantity: item.quantity > 0 ? item.quantity : 1 });
        }
        return acc;
      }, []);

      setCartItems(uniqueItems);
      calculateSubtotal(uniqueItems);
      localStorage.setItem('cart', JSON.stringify(uniqueItems));
    }
  }, []);

  const calculateSubtotal = (items: CartItem[]) => {
    const total = items.reduce(
      (sum, item) => sum + parseFloat(item.price.replace('R$', '').replace(',', '.')) * item.quantity,
      0
    );
    setSubtotal(total);
  };

  const updateQuantity = (itemId: string, amount: number) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + amount;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 0 };
      }
      return item;
    }).filter(item => item.quantity > 0);

    setCartItems(updatedCart);
    calculateSubtotal(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return {
    cartItems,
    subtotal,
    updateQuantity,
    setCartItems,
    calculateSubtotal,
  };
};

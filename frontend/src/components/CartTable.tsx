import React from 'react';
import type { CartItem } from '../context/CartTypes';
import ButtonCountCart from './ButtonCountCart';
import { formatPrice } from '../utils/formatPrice';

interface CartTableProps {
  items: CartItem[];
  onQuantityChange: (itemId: string, amount: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const CartTable: React.FC<CartTableProps> = ({ items, onQuantityChange, onRemoveItem }) => {
  return (
    <table className="w-full mb-8 text-left border-collapse">
      <thead>
        <tr className="bg-primary text-text-primary">
          <th className="p-4">Produto</th>
          <th className="p-4">Preço</th>
          <th className="p-4">Quantidade</th>
          <th className="p-4">Subtotal</th>
          <th className="p-4">Ações</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-b border-gray-300">
            <td className="p-4 flex items-center gap-4">
              <img
                src={item.imageUrl}
                alt={`Imagem do produto ${item.title}`}
                className="w-16 h-20 rounded-md shadow-md"
              />
              <span className="text-text-primary">{item.title}</span>
            </td>

            <td className="p-4 text-text-primary">
              {formatPrice(item.price)}
            </td>

            <td className="p-4">
              <ButtonCountCart
                quantity={item.quantity}
                onDecrease={() => onQuantityChange(item.id, -1)}
                onIncrease={() => onQuantityChange(item.id, 1)}
                allowZero={true}  // Permite zerar no carrinho
              />
            </td>

            <td className="p-4 text-text-primary">
              {formatPrice(item.price * item.quantity)}
            </td>

            <td className="p-4">
              <button
                className="text-error"
                onClick={() => onRemoveItem(item.id)}
              >
                Remover
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CartTable;

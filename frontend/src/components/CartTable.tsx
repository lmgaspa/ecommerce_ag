import React from 'react';
import type { CartItem } from '../context/CartTypes';
import { formatPrice } from '../utils/formatPrice';

interface CartTableProps {
  items: CartItem[];
  onQuantityChange: (itemId: string, amount: number) => void;
}

const CartTable: React.FC<CartTableProps> = ({ items, onQuantityChange }) => {
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
          <tr key={item.id} className="border-b border-muted">
            {/* Coluna do Produto */}
            <td className="p-4 flex items-center gap-4">
              <img
                src={item.imageUrl}
                alt={`Imagem do produto ${item.title}`}
                className="w-16 h-20 rounded-md shadow-md"
              />
              <span className="text-text-primary">{item.title}</span>
            </td>

            {/* Coluna do Preço */}
            <td className="p-4 text-text-primary">
              {formatPrice(item.price)}
            </td>

            {/* Coluna de Quantidade */}
            <td className="p-4">
              <div className="flex items-center justify-center gap-2">
                <button
                  className="w-10 h-10 bg-primary text-background rounded-md shadow-sm flex items-center justify-center text-lg transition hover:bg-accent"
                  onClick={() => onQuantityChange(item.id, -1)}
                  disabled={item.quantity <= 1}
                  style={{ lineHeight: 1 }}
                >
                  -
                </button>
                <span
                  className="text-text-primary text-lg min-w-[2rem] text-center flex items-center justify-center"
                  style={{ height: '2.5rem', lineHeight: '2.5rem' }}
                >
                  {item.quantity}
                </span>
                <button
                  className="w-10 h-10 bg-primary text-background rounded-md shadow-sm flex items-center justify-center text-lg transition hover:bg-accent"
                  onClick={() => onQuantityChange(item.id, 1)}
                  style={{ lineHeight: 1 }}
                >
                  +
                </button>
              </div>
            </td>

            {/* Coluna do Subtotal */}
            <td className="p-4 text-text-primary">
              {formatPrice((parseFloat(item.price.replace('R$', '').replace(',', '.')) * item.quantity).toString())}
            </td>

            {/* Coluna de Ações */}
            <td className="p-4">
              <button
                className="text-error"
                onClick={() => onQuantityChange(item.id, -item.quantity)}
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

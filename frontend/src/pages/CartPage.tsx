/*

import { useCart } from '../hooks/useCart';
import type { CartItem } from '../context/CartTypes';

const CartPage = () => {
  const { items } = useCart();

  return (
    <div>
      <h1>Seu Carrinho</h1>
      {items.map((item: CartItem) => (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <p>Quantidade: {item.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default CartPage;

*/
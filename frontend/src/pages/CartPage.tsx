import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartTable from '../components/CartTable';
import CouponInput from '../components/CouponInput';
import CartSummary from '../components/CartSummary';
import { useCart } from '../hooks/useCart';
import { BUTTON_COUNT_CART_STYLES } from '../styles/buttonCountCart';

const CartPage = () => {
  const { cartItems, subtotal, updateQuantity } = useCart();
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = () => {
    const validCoupon = import.meta.env.VITE_COUPON_CODE || 'DESCONTO10';
    const discountRate = parseFloat(import.meta.env.VITE_COUPON_DISCOUNT || '0.1');

    if (coupon === validCoupon) {
      const discountValue = subtotal * discountRate;
      setDiscount(discountValue);
      alert('Cupom aplicado com sucesso!');
    } else {
      alert('Cupom inválido.');
    }
  };

  const handleCheckout = () => {
    alert('Finalizando compra...');
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto my-16 px-4 bg-background rounded-md shadow-lg p-8">
      <h1 className="text-4xl font-bold mb-8 text-text-primary">Carrinho de Compras</h1>
      {cartItems.length === 0 ? (
        <p className="text-text-secondary">Seu carrinho está vazio.</p>
      ) : (
        <>
          <CartTable items={cartItems} onQuantityChange={updateQuantity} />
          <div className="flex justify-between mb-8">
            <CouponInput value={coupon} onChange={setCoupon} onApply={handleApplyCoupon} />
            <CartSummary subtotal={subtotal} discount={discount} onCheckout={handleCheckout} />
          </div>
          <button
            onClick={() => navigate('/books')}
            className={`${BUTTON_COUNT_CART_STYLES.base} ${BUTTON_COUNT_CART_STYLES.accent}`}
          >
            Continuar Comprando
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;

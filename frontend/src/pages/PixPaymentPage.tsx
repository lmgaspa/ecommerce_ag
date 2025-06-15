import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { formatPrice } from '../utils/formatPrice';
import CartTable from '../components/cart/CartTable';
import type { CartItem } from '../context/CartTypes';
import { calcularFreteComBaseEmCarrinho } from '../utils/freteUtils';

const PixPaymentPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [payload, setPayload] = useState('');

  // Recupera carrinho do localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    const cart = stored ? JSON.parse(stored) : [];
    setCartItems(cart);
  }, []);

  // Calcula total e payload do Pix
  useEffect(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalValue = subtotal + shipping;
    setTotal(totalValue);

    const simulatedPayload = `00020126580014BR.GOV.BCB.PIX0136email@email.com5204000053039865405${totalValue
      .toFixed(2)
      .replace('.', '')}5802BR5920Loja AG Livros6009SaoPaulo62070503***6304ABCD`;

    setPayload(simulatedPayload);
  }, [cartItems, shipping]);

  // Calcula frete manual com base no carrinho
  useEffect(() => {
    const saved = localStorage.getItem('checkoutForm');
    const form = saved ? JSON.parse(saved) : { cep: '', cpf: '' };

    calcularFreteComBaseEmCarrinho(form, cartItems).then(setShipping);
  }, [cartItems]);

  // Atualiza quantidade de livros
  const handleQuantityChange = (itemId: string, amount: number) => {
    const updated = cartItems
      .map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleRemoveItem = (itemId: string) => {
    const updated = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  if (cartItems.length === 0 || !payload) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h1 className="text-xl font-bold text-red-600">Carrinho vazio</h1>
        <p className="mt-4">Adicione produtos ao carrinho antes de pagar com Pix.</p>
        <button
          className="mt-6 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => navigate('/books')}
        >
          Voltar para a loja
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Pagamento via Pix</h1>

      <p className="text-sm text-red-600 mb-4">Aceitamos apenas Pix como forma de pagamento.</p>

      <div className="mb-8">
        <CartTable
          items={cartItems}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveItem}
        />
        <div className="text-right pr-4">
          <p className="text-sm">Frete: {formatPrice(shipping)}</p>
          <p className="text-xl font-bold">Total: {formatPrice(total)}</p>
        </div>
      </div>

      <div className="inline-block bg-white p-4 rounded shadow-md mb-6">
        <QRCode value={payload} size={200} />
      </div>

      <p className="text-base font-medium mb-6">
        Escaneie o QR Code ou copie o código para pagar via Pix.
      </p>

      <div className="flex justify-center">
        <button
          onClick={() => navigate('/books')}
          className="px-6 py-2 bg-green-600 text-white rounded-md shadow-md transition hover:bg-green-700"
        >
          Continuar comprando
        </button>
      </div>
    </div>
  );
};

export default PixPaymentPage;

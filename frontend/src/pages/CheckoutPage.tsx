import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatCep, formatCpf, formatCelular } from '../utils/masks';
import CheckoutForm from './CheckoutForm';
import type { CartItem } from '../context/CartTypes';

const weightByBookKg: Record<string, number> = {
  extase: 1.300,
  regressantes: 1.300,
  sempre: 1.300,
};

function calculateShippingByCep(destination: string, totalWeight: number): number {
  if (!destination || totalWeight === 0) return 0;

  const originPrefix = 456;
  const destinationPrefix = parseInt(destination.substring(0, 3));

  if (isNaN(destinationPrefix)) return 0;

  const distance = Math.abs(originPrefix - destinationPrefix);
  const base = 10 + distance * 0.4;
  const shipping = base * totalWeight;

  // Aplica o valor mínimo de R$ 15,00
  return Math.max(15, Math.round(shipping * 100) / 100);
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { getCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    cpf: '',
    country: 'Brasil',
    cep: '',
    address: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    note: '',
    delivery: '',
    payment: '', // Se não usar, pode remover
  });

  const onNavigateBack = () => navigate('/');

  useEffect(() => {
  const cart = getCart();
  setCartItems(cart);
}, []);

  useEffect(() => {
    const totalWeight = cartItems.reduce((acc, item) => {
      const unitWeight = weightByBookKg[item.id] || 0.3; // padrão: 300g
      return acc + unitWeight * item.quantity;
    }, 0);

    const cpfNumeros = form.cpf.replace(/\D/g, '');
    if (cpfNumeros === '00000000000') {
      setShipping(0);
    } else {
      setShipping(totalWeight > 0 ? calculateShippingByCep(form.cep, totalWeight) : 0);
    }
  }, [form.cep, form.cpf, cartItems]);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + delta } : item
    ).filter(item => item.quantity > 0);

    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    const sum = updated.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    const sum = updated.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === 'cep') value = formatCep(value);
    if (name === 'cpf') value = formatCpf(value);
    if (name === 'phone') value = formatCelular(value);

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'cep' && value.replace(/\D/g, '').length === 8) {
      fetch(`https://viacep.com.br/ws/${value.replace(/\D/g, '')}/json/`)
        .then((res) => res.json())
        .then((data) => {
          setForm((prev) => ({
            ...prev,
            address: data.logradouro || '',
            district: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
          }));
        });
    }
  };

  return (
    <CheckoutForm
      cartItems={cartItems}
      total={total}
      shipping={shipping}
      form={form}
      updateQuantity={updateQuantity}
      removeItem={removeItem}
      handleChange={handleChange}
      onNavigateBack={onNavigateBack}
    />
  );
};

export default CheckoutPage;

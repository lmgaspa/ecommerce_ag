import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatCep, formatCpf, formatCelular } from '../utils/masks';
import { formatPrice } from '../utils/formatPrice';
import type { CartItem } from '../context/CartTypes';

const weightByBookKg: Record<string, number> = {
  extase: 0.11,
  regressantes: 0.2,
  sempre: 0.096,
};

function calculateShippingByCep(destination: string, totalWeight: number): number {
  if (!destination || totalWeight === 0) return 0;

  const originPrefix = 456;
  const destinationPrefix = parseInt(destination.substring(0, 3));

  if (isNaN(destinationPrefix)) return 0;

  const distance = Math.abs(originPrefix - destinationPrefix);
  const base = 10 + distance * 0.4;
  const shipping = base * totalWeight;

  return Math.round(shipping * 100) / 100;
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
    payment: 'boleto',
  });

  useEffect(() => {
    const cart = getCart();
    setCartItems(cart);
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  const totalWeight = cartItems.reduce((acc, item) => {
    const unitWeight = weightByBookKg[item.id] || 0;
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
    <div className="max-w-5xl mx-auto py-12 px-4">
      <button onClick={() => navigate('/books')} className="px-6 py-2 mt-2 bg-green-600 text-white rounded-md shadow-md transition hover:bg-green-700">
        Continuar comprando
      </button>

      <p className="mb-4 text-sm">
        Possui um cupom de desconto?{' '}
        <a href="#" className="text-blue-600 underline">
          Clique aqui para inserir seu código de desconto
        </a>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold">DADOS DE COBRANÇA E ENTREGA</h2>
          <div className="grid grid-cols-2 gap-4">
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Nome" className="border p-2" />
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Sobrenome" className="border p-2" />
            <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="CPF (opcional)" className="border p-2 col-span-2" />
            <input value="Brasil" disabled className="border p-2 col-span-2" />
            <input name="cep" value={form.cep} onChange={handleChange} placeholder="CEP (Ex: 00000-000)" className="border p-2 col-span-2" />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Endereço" className="border p-2 col-span-2" />
            <input name="number" value={form.number} onChange={handleChange} placeholder="Número" className="border p-2" />
            <input name="complement" value={form.complement} onChange={handleChange} placeholder="Complemento (opcional)" className="border p-2" />
            <input name="district" value={form.district} onChange={handleChange} placeholder="Bairro" className="border p-2" />
            <input name="city" value={form.city} onChange={handleChange} placeholder="Cidade" className="border p-2" />
            <input name="state" value={form.state} onChange={handleChange} placeholder="Estado" className="border p-2" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Celular (opcional)" className="border p-2 col-span-2" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="E-mail" className="border p-2 col-span-2" />
          </div>

          <div>
            <h2 className="text-lg font-bold mt-6">INFORMAÇÕES ADICIONAIS</h2>
            <textarea name="note" value={form.note} onChange={handleChange} placeholder="Observações sobre seu pedido..." className="border w-full p-2 h-24"></textarea>
          </div>
        </div>

        <div className="border p-4 rounded space-y-4">
          <h2 className="text-lg font-bold">SEU PEDIDO</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 border-b pb-2">
              <img src={item.imageUrl} alt={item.title} className="w-12 h-16 object-cover rounded shadow" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300" onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span className="text-sm">{item.quantity}</span>
                  <button className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300" onClick={() => updateQuantity(item.id, 1)}>+</button>
                  <button className="ml-2 text-red-500 text-xs hover:underline" onClick={() => removeItem(item.id)}>Remover</button>
                </div>
              </div>
              <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}

          <div className="flex justify-between">
            <span>Entrega</span>
            <span>{shipping > 0 ? formatPrice(shipping) : '---'}</span>
          </div>

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(total + shipping)}</span>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="boleto" checked={form.payment === 'boleto'} onChange={handleChange} /> Boleto
            </label>
            <p className="text-xs text-gray-600 mt-1">
              Após clicar em "Finalizar pedido" você receberá seu boleto. Ele pode ser impresso ou pago online. O pedido será confirmado após o pagamento.
            </p>

            <label className="flex items-center gap-2 mt-4">
              <input type="radio" name="payment" value="cartao" checked={form.payment === 'cartao'} onChange={handleChange} /> Cartão de crédito
            </label>
          </div>

          <button className="bg-red-600 text-white py-2 w-full mt-4 rounded">Finalizar pedido</button>
        </div>
      </div>

      <button onClick={() => navigate('/books')} className="px-6 py-2 mt-2 bg-green-600 text-white rounded-md shadow-md transition hover:bg-green-700">
        Continuar comprando
      </button>
    </div>
  );
};

export default CheckoutPage;

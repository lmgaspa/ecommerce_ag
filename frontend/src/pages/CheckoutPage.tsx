import { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { formatCep, formatCpf, formatCelular } from '../utils/masks';
import { formatPrice } from '../utils/formatPrice';
import type { CartItem } from '../context/CartTypes';

const CheckoutPage = () => {
  const { getCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    cpf: '',
    pais: 'Brasil',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    celular: '',
    email: '',
    observacao: '',
    entrega: '',
    pagamento: 'boleto',
  });

  useEffect(() => {
    const cart = getCart();
    setCartItems(cart);
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  }, [getCart]);

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
    if (name === 'celular') value = formatCelular(value);

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'cep' && value.replace(/\D/g, '').length === 8) {
      fetch(`https://viacep.com.br/ws/${value.replace(/\D/g, '')}/json/`)
        .then((res) => res.json())
        .then((data) => {
          setForm((prev) => ({
            ...prev,
            endereco: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
          }));
        });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <button className="px-6 py-2 mt-2 bg-green-600 text-white rounded-md shadow-md transition hover:bg-green-700">
        Continuar comprando
      </button>

      <p className="mb-4 text-sm">
        Você tem um cupom de desconto?{' '}
        <a href="#" className="text-blue-600 underline">
          Clique aqui e informe o código do seu cupom de desconto
        </a>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold">COBRANÇA & ENTREGA</h2>
          <div className="grid grid-cols-2 gap-4">
            <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="border p-2" />
            <input name="sobrenome" value={form.sobrenome} onChange={handleChange} placeholder="Sobrenome" className="border p-2" />
            <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="CPF (opcional)" className="border p-2 col-span-2" />
            <input value="Brasil" disabled className="border p-2 col-span-2" />
            <input name="cep" value={form.cep} onChange={handleChange} placeholder="CEP (Ex: 00000-000)" className="border p-2 col-span-2" />
            <input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Endereço" className="border p-2 col-span-2" />
            <input name="numero" value={form.numero} onChange={handleChange} placeholder="Número" className="border p-2" />
            <input name="complemento" value={form.complemento} onChange={handleChange} placeholder="Complemento (opcional)" className="border p-2" />
            <input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" className="border p-2" />
            <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" className="border p-2" />
            <input name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" className="border p-2" />
            <input name="celular" value={form.celular} onChange={handleChange} placeholder="Celular (opcional)" className="border p-2 col-span-2" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Endereço de e-mail" className="border p-2 col-span-2" />
          </div>

          <div>
            <h2 className="text-lg font-bold mt-6">INFORMAÇÃO ADICIONAL</h2>
            <textarea name="observacao" value={form.observacao} onChange={handleChange} placeholder="Observações sobre seu pedido..." className="border w-full p-2 h-24"></textarea>
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
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>

          <div className="flex justify-between">
            <span>Entrega</span>
            <input type="text" className="border px-2 py-1 text-sm" placeholder="Digite seu endereço..." name="entrega" value={form.entrega} onChange={handleChange} />
          </div>

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input type="radio" name="pagamento" value="boleto" checked={form.pagamento === 'boleto'} onChange={handleChange} /> Boleto bancário
            </label>
            <p className="text-xs text-gray-600 mt-1">
              Após clicar em "Finalizar compra" você receberá o seu boleto bancário. Pode ser impresso ou pago no banco ou online. O pedido será confirmado após o pagamento.
            </p>

            <label className="flex items-center gap-2 mt-4">
              <input type="radio" name="pagamento" value="cartao" checked={form.pagamento === 'cartao'} onChange={handleChange} /> Cartão de crédito
            </label>
          </div>

          <button className="bg-red-600 text-white py-2 w-full mt-4 rounded">Finalizar pedido</button>
        </div>
      </div>

      <button className="px-6 py-2 mt-2 bg-green-600 text-white rounded-md shadow-md transition hover:bg-green-700">
        Continuar comprando
      </button>
    </div>
  );
};

export default CheckoutPage;

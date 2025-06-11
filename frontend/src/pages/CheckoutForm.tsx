import React from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { formatPrice } from "../utils/formatPrice";
import { generatePixPayload } from "../utils/pixPayload";
import type { CartItem } from "../context/CartTypes";

interface CheckoutFormProps {
  cartItems: CartItem[];
  total: number;
  shipping: number;
  form: {
    firstName: string;
    lastName: string;
    cpf: string;
    country: string;
    cep: string;
    address: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    note: string;
    delivery: string;
    payment: string;
  };
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onNavigateBack: () => void;
}

const CheckoutForm = ({
  cartItems,
  total,
  shipping,
  form,
  updateQuantity,
  removeItem,
  handleChange,
}: CheckoutFormProps) => {
  const navigate = useNavigate();
  const totalComFrete = (total + shipping).toFixed(2);

  const payload = generatePixPayload({
    key: "29322022000",
    name: "Agenor Gasparetto",
    city: "ITABUNA",
    amount: parseFloat(totalComFrete),
  });

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="mb-4">
            <button
              onClick={() => navigate("/books")}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              ← Continuar comprando
            </button>
          </div>

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
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Observações sobre seu pedido..."
              className="border w-full p-2 h-24"
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold">SEU PEDIDO</h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b pb-2"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-12 h-16 object-cover rounded shadow"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    -
                  </button>
                  <span className="text-sm">{item.quantity}</span>
                  <button
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                  <button
                    className="ml-2 text-red-500 text-xs hover:underline"
                    onClick={() => removeItem(item.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>
              <span className="text-sm font-medium">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}

          <div className="flex justify-between">
            <span>Entrega</span>
            <span>{shipping > 0 ? formatPrice(shipping) : "---"}</span>
          </div>

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(total + shipping)}</span>
          </div>

          <div className="mt-4 text-center flex flex-col items-center">
            <h3 className="text-sm font-bold mb-2">Pagamento via PIX</h3>
            <QRCode value={payload} size={180} />
          </div>

          <button className="bg-red-600 text-white py-2 w-full mt-4 rounded hover:bg-red-500 transition">
            Finalizar pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;

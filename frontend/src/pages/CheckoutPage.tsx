import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { formatCep, formatCpf, formatCelular } from "../utils/masks";
import CheckoutForm from "./CheckoutForm";
import type { CartItem } from "../context/CartTypes";

const weightByBookKg: Record<string, number> = {
  extase: 0.3,
  regressantes: 0.3,
  sempre: 0.3,
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { getCart } = useCart();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("checkoutForm");
    return saved
      ? JSON.parse(saved)
      : {
          firstName: "",
          lastName: "",
          cpf: "",
          country: "Brasil",
          cep: "",
          address: "",
          number: "",
          complement: "",
          district: "",
          city: "",
          state: "",
          phone: "",
          email: "",
          note: "",
          delivery: "",
          payment: "pix",
        };
  });

  const onNavigateBack = () => navigate("/");

  useEffect(() => {
  const cart = getCart();
  setCartItems(cart);
  const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  setTotal(sum);
}, []);

  useEffect(() => {
    const totalWeight = cartItems.reduce((acc, item) => {
      const unitWeight = weightByBookKg[item.id] || 0.3;
      return acc + unitWeight * item.quantity;
    }, 0);

    const cep = form.cep.replace(/\D/g, "");
    const cpfNumeros = form.cpf.replace(/\D/g, "");

    if (cpfNumeros === "00000000000") {
      setShipping(0);
      return;
    }

    if (cep.length === 8 && totalWeight > 0) {
      fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep, weight: totalWeight }),
      })
        .then((res) => res.json())
        .then((data) => setShipping(data.valor || 0))
        .catch(() => setShipping(0));
    } else {
      setShipping(0);
    }
  }, [form.cep, form.cpf, cartItems]);

  useEffect(() => {
    localStorage.setItem("checkoutForm", JSON.stringify(form));
  }, [form]);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));

    const sum = updated.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(sum);
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));

    const sum = updated.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(sum);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value: inputValue } = e.target;
    let value = inputValue;

    if (name === "cep") value = formatCep(value);
    if (name === "cpf") value = formatCpf(value);
    if (name === "phone") value = formatCelular(value);

    setForm((prev: typeof form) => ({ ...prev, [name]: value }));

    if (name === "cep" && value.replace(/\D/g, "").length === 8) {
      fetch(`https://viacep.com.br/ws/${value.replace(/\D/g, "")}/json/`)
        .then((res) => res.json())
        .then((data) => {
          setForm((prev: typeof form) => ({
            ...prev,
            address: data.logradouro || "",
            district: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));
        })
        .catch(() => {});
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

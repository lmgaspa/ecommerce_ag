import React from "react";
import { useNavigate } from "react-router-dom";
import { generatePixPayload } from "../utils/pixPayload";
import type { CartItem } from "../context/CartTypes";
import type { CheckoutFormData } from "../types/CheckoutTypes";
import CheckoutFormView from "../components/checkout/CheckoutFormView";

interface CheckoutFormProps {
  cartItems: CartItem[];
  total: number;
  shipping: number;
  form: CheckoutFormData;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onNavigateBack: () => void;
}

const CheckoutForm = (props: CheckoutFormProps) => {
  const navigate = useNavigate();
  const totalComFrete = (props.total + props.shipping).toFixed(2);

  const payload = generatePixPayload({
    key: "29322022000",
    name: "Agenor Gasparetto",
    city: "ITABUNA",
    amount: parseFloat(totalComFrete),
  });

  const handlePixCheckout = () => {
    const requiredFields: (keyof CheckoutFormData)[] = [
      "firstName",
      "lastName",
      "cep",
      "address",
      "number",
      "district",
      "city",
      "state",
      "email",
    ];

    const missingField = requiredFields.find(
      (field) => !props.form[field].trim()
    );

    if (missingField) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    navigate("/pix", {
      state: {
        form: props.form,
        cartItems: props.cartItems,
        total: props.total,
        shipping: props.shipping,
        payload,
      },
    });
  };

  return (
    <CheckoutFormView
      {...props}
      handlePixCheckout={handlePixCheckout}
    />
  );
};

export default CheckoutForm;
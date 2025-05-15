interface CartSummaryProps {
  total: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ total }) => {
  return (
    <div className="bg-background rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-primary mb-4">Total no Carrinho</h2>
      <div className="border-t border-b py-4 mb-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span className="font-semibold text-secondary">R${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Entrega</span>
          <span className="text-sm text-gray-500">Calcular entrega</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span className="font-bold text-primary">R${total.toFixed(2)}</span>
        </div>
      </div>
      <button className="w-full bg-primary text-white py-3 rounded-lg font-bold">
        Continuar para Finalização
      </button>
    </div>
  );
};

export default CartSummary;

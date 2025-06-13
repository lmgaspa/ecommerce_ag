import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { formatPrice } from '../utils/formatPrice';

const PixPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { payload, total } = location.state || {};

  if (!payload || !total) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h1 className="text-xl font-bold text-red-600">Erro</h1>
        <p className="mt-4">Informações de pagamento não encontradas.</p>
        <button
          className="mt-6 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => navigate('/')}
        >
          Voltar para a loja
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Pagamento via Pix</h1>

      <p className="text-lg mb-2">
        Valor: <span className="font-semibold">{formatPrice(total)}</span>
      </p>

      <p className="text-sm text-red-600 mb-6">Aceitamos apenas Pix como forma de pagamento.</p>

      <div className="inline-block bg-white p-4 rounded shadow-md mb-6">
        <QRCode value={payload} size={200} />
      </div>

      <p className="text-base font-medium mb-6">Pague pelo Pix para concluir a compra.</p>

      <div className="flex justify-center">
        <button
          onClick={() => navigate('/books')}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
        >
          Continuar comprando
        </button>
      </div>
    </div>
  );
};

export default PixPaymentPage;

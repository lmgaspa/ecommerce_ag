import { calcularPesoConsiderado } from './pesoLivros';

export async function calcularFreteViaCorreios(
  cepDestino: string,
  cartItems: { id: string; quantity: number }[]
): Promise<number> {
  try {
    const pesoTotalKg = cartItems.reduce((acc, item) => {
      return acc + calcularPesoConsiderado(item.id) * item.quantity;
    }, 0);

    const origemPrefix = 456;
    const destinoPrefix = parseInt(cepDestino.substring(0, 3));
    const distancia = isNaN(destinoPrefix) ? 0 : Math.abs(origemPrefix - destinoPrefix);

    const base = 15;
    const adicionalPorDistancia = Math.ceil(distancia / 50) * 3; // A cada 50 de distância, R$3 a mais
    const extra = Math.max(0, pesoTotalKg - 0.3);
    const adicionalPorPeso = Math.ceil(extra / 0.1) * 4;

    return base + adicionalPorDistancia + adicionalPorPeso;
  } catch (error) {
    console.error("Erro ao calcular frete:", error);
    return 0;
  }
}

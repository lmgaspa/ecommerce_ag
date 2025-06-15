import type { CartItem } from '../context/CartTypes';

const livros: Record<string, { pesoRealKg: number; larguraCm: number; alturaCm: number; comprimentoCm: number }> = {
  extase: { pesoRealKg: 0.11, larguraCm: 13.5, alturaCm: 19.5, comprimentoCm: 1 },
  regressantes: { pesoRealKg: 0.2, larguraCm: 14, alturaCm: 21, comprimentoCm: 1 },
  sempre: { pesoRealKg: 0.06, larguraCm: 20.5, alturaCm: 28, comprimentoCm: 1 },
};

export function calcularFreteManual(cartItems: CartItem[]): number {
  const pesoTotal = cartItems.reduce((acc, item) => {
    const key = item.id.toLowerCase();
    const livro = livros[key];
    if (!livro) return acc;

    const pesoVol = (livro.larguraCm * livro.alturaCm * livro.comprimentoCm) / 6000;
    const pesoUsado = Math.max(pesoVol, livro.pesoRealKg);
    return acc + pesoUsado * item.quantity;
  }, 0);

  const valorFrete = pesoTotal > 0 ? 10 + pesoTotal * 10 : 0;
  return Math.ceil(valorFrete);
}

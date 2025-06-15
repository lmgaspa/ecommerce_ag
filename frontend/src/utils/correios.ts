const livrosDimensoes = {
  extase: { pesoRealKg: 0.11, larguraCm: 13.5, alturaCm: 19.5, comprimentoCm: 1 },
  regressantes: { pesoRealKg: 0.2, larguraCm: 14, alturaCm: 21, comprimentoCm: 1 },
  sempre: { pesoRealKg: 0.06, larguraCm: 20.5, alturaCm: 28, comprimentoCm: 1 },
};

type LivroId = keyof typeof livrosDimensoes;

function calcularPesoConsiderado(id: string): number {
  if (!(id in livrosDimensoes)) return 0.3;
  const livro = livrosDimensoes[id as LivroId];
  const { larguraCm, alturaCm, comprimentoCm, pesoRealKg } = livro;
  const pesoVol = (larguraCm * alturaCm * comprimentoCm) / 6000;
  return Math.max(pesoRealKg, pesoVol);
}

export async function calcularFreteViaCorreios(
  cepDestino: string,
  cartItems: { id: string; quantity: number }[]
): Promise<number> {
  try {
    const pesoTotalKg = cartItems.reduce((acc, item) => {
      return acc + calcularPesoConsiderado(item.id) * item.quantity;
    }, 0);

    const base = 15;
    const extra = Math.max(0, pesoTotalKg - 0.3);
    const adicional = Math.ceil(extra / 0.1) * 4;

    return base + adicional;
  } catch (error) {
    console.error("Erro ao calcular frete:", error);
    return 0;
  }
}


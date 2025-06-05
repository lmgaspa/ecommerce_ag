interface LivroDimensoes {
  titulo: string;
  pesoRealKg: number;
  larguraCm: number;
  alturaCm: number;
  comprimentoCm: number;
}

function calcularPesoVolumetrico(livro: LivroDimensoes): number {
  const { larguraCm, alturaCm, comprimentoCm } = livro;
  return (larguraCm * alturaCm * comprimentoCm) / 6000;
}

const livros: LivroDimensoes[] = [
  {
    titulo: "Êxtase",
    pesoRealKg: 0.11,
    larguraCm: 13.5,
    alturaCm: 19.5,
    comprimentoCm: 1
  },
  {
    titulo: "Regressantes",
    pesoRealKg: 0.2,
    larguraCm: 14,
    alturaCm: 21,
    comprimentoCm: 1
  },
  {
    titulo: "Para sempre felizes",
    pesoRealKg: 0.06,
    larguraCm: 20.5,
    alturaCm: 28,
    comprimentoCm: 1
  }
];

livros.forEach((livro) => {
  const pesoVol = calcularPesoVolumetrico(livro);
  const pesoConsiderado = Math.max(livro.pesoRealKg, pesoVol);

  console.log(`Livro: ${livro.titulo}`);
  console.log(`  Peso real: ${livro.pesoRealKg.toFixed(3)} kg`);
  console.log(`  Peso volumétrico: ${pesoVol.toFixed(3)} kg`);
  console.log(`  Peso considerado para frete: ${pesoConsiderado.toFixed(3)} kg\n`);
});
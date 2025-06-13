import { calcularPrecoPrazo } from 'correios-brasil';

export const calcularFreteModico = async (cepDestino: string, pesoKg: number) => {
  try {
    const args = {
      sCepOrigem: '45600000',
      sCepDestino: cepDestino.replace(/\D/g, ''),
      nVlPeso: pesoKg.toFixed(2).replace('.', ','),
      nCdFormato: '1',
      nCdServico: ['41068'],
      nVlComprimento: '16',
      nVlAltura: '2',
      nVlLargura: '11',
      nVlDiametro: '0',
      sCdMaoPropria: 'N',
      nVlValorDeclarado: 0,
      sCdAvisoRecebimento: 'N',
    };

    const resultado = await calcularPrecoPrazo(args);
    const valor = parseFloat(
      resultado[0]?.Valor?.replace(',', '.') || '0'
    );

    return isNaN(valor) ? 0 : valor;
  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    return 0;
  }
};

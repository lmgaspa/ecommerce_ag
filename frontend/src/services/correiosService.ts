import axios from 'axios';
import { parseStringPromise } from 'xml2js';

interface FreteParams {
  sCepOrigem: string;
  sCepDestino: string;
  nVlPeso: string; // Ex: '1'
  nCdServico: '04014' | '04510'; // Sedex ou PAC
  nVlComprimento: string;
  nVlAltura: string;
  nVlLargura: string;
  nVlDiametro: string;
  nVlValorDeclarado?: string;
}

export async function calcularFrete(params: FreteParams) {
  const baseURL = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx';
  const fullURL = `${baseURL}?nCdEmpresa=&sDsSenha=&nCdServico=${params.nCdServico}&sCepOrigem=${params.sCepOrigem}&sCepDestino=${params.sCepDestino}&nVlPeso=${params.nVlPeso}&nCdFormato=1&nVlComprimento=${params.nVlComprimento}&nVlAltura=${params.nVlAltura}&nVlLargura=${params.nVlLargura}&nVlDiametro=${params.nVlDiametro}&sCdMaoPropria=n&nVlValorDeclarado=${params.nVlValorDeclarado ?? '0'}&sCdAvisoRecebimento=n&StrRetorno=xml`;

  const { data } = await axios.get(fullURL);
  const json = await parseStringPromise(data);
  const result = json?.Servicos?.cServico?.[0];

  return {
    valor: result.Valor?.[0],
    prazo: result.PrazoEntrega?.[0],
    erro: result.Erro?.[0] !== '0' ? result.MsgErro?.[0] : null,
  };
}

import type { CartItem } from '../context/CartTypes';
import { calcularFreteViaCorreios } from './correios';

export async function calcularFreteComBaseEmCarrinho(form: { cep: string; cpf: string }, cartItems: CartItem[]): Promise<number> {
  const cep = form.cep.replace(/\D/g, '');
  const cpfNumeros = form.cpf.replace(/\D/g, '');

  if (cpfNumeros === '00000000000') return 0;
  if (cep.length !== 8 || cartItems.length === 0) return 0;

  return await calcularFreteViaCorreios(cep, cartItems);
}

/** Formata em Real brasileiro: 18.9 → "R$ 18,90" */
export function brl(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

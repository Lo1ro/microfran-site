import { SITE } from '../config';
import { brl } from './money';

export interface ItemPedido {
  nome: string;
  preco: number;
  qty: number;
  variacao?: string;
}

/** Monta o link wa.me com a mensagem já codificada. */
export function waLink(mensagem: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/** Conversa genérica (botão flutuante, contato). */
export function waPadrao(): string {
  return waLink('Olá, Micro Fran! Vim pelo site e quero um atendimento.');
}

/** Pedido do carrinho — formato definido no brief, chega pronto no WhatsApp da loja. */
export function mensagemPedido(itens: ItemPedido[], total: number): string {
  const linhas = itens.map(
    (i) => `• ${i.qty}x ${i.nome}${i.variacao ? ` (${i.variacao})` : ''} — ${brl(i.preco * i.qty)}`,
  );
  return [
    'Olá, Micro Fran! Quero fazer um pedido:',
    '',
    ...linhas,
    '',
    `Total: ${brl(total)}`,
    '',
    'Nome:',
    'Forma de pagamento:',
    'Retirada na loja ou entrega:',
  ].join('\n');
}

/** Orçamento de serviço gráfico — sem preço fixo, a loja responde com valor e prazo. */
export function mensagemOrcamento(servico: string): string {
  return [
    `Olá, Micro Fran! Quero um orçamento de ${servico}.`,
    '',
    'O que eu preciso:',
    'Quantidade:',
    'Pra quando:',
  ].join('\n');
}

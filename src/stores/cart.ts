/**
 * Carrinho — estado compartilhado entre as ilhas (header, botões, página).
 * Persistido em localStorage: sobrevive se o cliente fechar a aba.
 */
import { computed } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

export interface CartItem {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  variacao?: string;
  qty: number;
}

export const cart = persistentAtom<CartItem[]>('microfran:carrinho', [], {
  encode: JSON.stringify,
  decode: (valor) => {
    try {
      const lista = JSON.parse(valor);
      return Array.isArray(lista) ? lista : [];
    } catch {
      return [];
    }
  },
});

/** Mesmo produto em variações diferentes = linhas diferentes no carrinho. */
export const chaveDe = (item: { id: string; variacao?: string }) =>
  item.variacao ? `${item.id}::${item.variacao}` : item.id;

export function adicionar(item: Omit<CartItem, 'qty'>, qty = 1) {
  const itens = [...cart.get()];
  const existente = itens.find((i) => chaveDe(i) === chaveDe(item));
  if (existente) {
    existente.qty += qty;
  } else {
    itens.push({ ...item, qty });
  }
  cart.set(itens);
}

export function mudarQtd(chave: string, qty: number) {
  if (qty <= 0) return remover(chave);
  cart.set(cart.get().map((i) => (chaveDe(i) === chave ? { ...i, qty } : i)));
}

export function remover(chave: string) {
  cart.set(cart.get().filter((i) => chaveDe(i) !== chave));
}

export function esvaziar() {
  cart.set([]);
}

export const totalItens = computed(cart, (itens) => itens.reduce((n, i) => n + i.qty, 0));
export const totalValor = computed(cart, (itens) => itens.reduce((n, i) => n + i.qty * i.preco, 0));

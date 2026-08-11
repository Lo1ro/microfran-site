/** Produto do catálogo (papelaria/informática) — schema rico já pensando no e-commerce da Fase 3. */
export interface Product {
  id: string;
  nome: string;
  categoria: 'papelaria' | 'informatica';
  subcategoria: string;
  preco: number;
  /**
   * Código de barras (ou código interno) do produto no sistema da loja.
   * É o que permite buscar o preço real no PDV. Vazio = usa o preço da planilha.
   */
  codigo?: string;
  descricao: string;
  imagens: string[];
  /** Opções simples (ex.: ["Capa azul", "Capa rosa"]). Vazio = sem variação. */
  variacoes: string[];
  /** Reservado pra Fase 3 (controle de estoque). null = não controlado. */
  estoque: number | null;
  ativo: boolean;
  destaque: boolean;
}

/** Serviço gráfico — sob orçamento, nunca vai pro carrinho. */
export interface Service {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  exemplos: string[];
}

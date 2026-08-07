/** Produto do catálogo (papelaria/informática) — schema rico já pensando no e-commerce da Fase 3. */
export interface Product {
  id: string;
  nome: string;
  categoria: 'papelaria' | 'informatica';
  subcategoria: string;
  preco: number;
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

/** Rótulos de exibição das categorias/subcategorias (os slugs ficam sem acento). */
export const CATEGORIAS: Record<string, string> = {
  papelaria: 'Papelaria',
  informatica: 'Informática',
};

export const SUBCATEGORIAS: Record<string, string> = {
  cadernos: 'Cadernos',
  escrita: 'Escrita',
  papel: 'Papéis',
  escolar: 'Material escolar',
  perifericos: 'Periféricos',
  armazenamento: 'Armazenamento',
  cabos: 'Cabos e adaptadores',
  audio: 'Áudio',
  suprimentos: 'Suprimentos de impressão',
};

export const rotuloCategoria = (slug: string) => CATEGORIAS[slug] ?? slug;
export const rotuloSub = (slug: string) => SUBCATEGORIAS[slug] ?? slug;

/** Remove acentos e baixa a caixa — usado na busca do catálogo. */
export const normalizar = (texto: string) =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

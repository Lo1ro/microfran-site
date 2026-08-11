/**
 * Camada de dados do catálogo.
 *
 * As páginas SÓ conversam com getProducts()/getServices() — nunca com a fonte
 * direto.
 *
 * De onde vem cada coisa:
 *   • **quais produtos aparecem** e como se apresentam (nome de vitrine, foto,
 *     descrição, destaque) → planilha do Google (`CATALOG_CSV_URL`);
 *   • **o preço** → sistema da loja, pela nuvem (`SUPABASE_*`), casando pelo
 *     código de barras.
 *
 * Assim o dono mexe no preço num lugar só — o PDV, onde ele trabalha — e o site
 * acompanha no build seguinte. Sem nenhuma das duas variáveis, roda com o JSON
 * de exemplo.
 */
import type { Product, Service } from './types';
import produtosExemplo from '../data/products.json';
import servicosData from '../data/services.json';
import { produtosDaPlanilha } from './sheets';
import { precosDaLoja } from './precos-pdv';

let cacheProdutos: Product[] | null = null;

export async function getProducts(): Promise<Product[]> {
  if (!cacheProdutos) {
    const csvUrl = import.meta.env.CATALOG_CSV_URL as string | undefined;
    const todos = csvUrl ? await produtosDaPlanilha(csvUrl) : (produtosExemplo as Product[]);
    cacheProdutos = await comPrecoDaLoja(todos.filter((p) => p.ativo));
  }
  return cacheProdutos;
}

/**
 * Substitui o preço da planilha pelo preço real do PDV, quando houver.
 *
 * Produto sem código, ou código que a loja não conhece, fica com o preço da
 * planilha. Vitrine com preço um pouco velho é melhor que vitrine sem preço.
 */
async function comPrecoDaLoja(produtos: Product[]): Promise<Product[]> {
  const url = import.meta.env.SUPABASE_URL as string | undefined;
  const chave = import.meta.env.SUPABASE_ANON_KEY as string | undefined;
  if (!url || !chave) return produtos;

  const precos = await precosDaLoja(url, chave);
  if (precos.size === 0) return produtos;

  let atualizados = 0;
  let semPreco = 0;
  const saida = produtos.map((p) => {
    const codigo = p.codigo?.trim();
    const daLoja = codigo ? precos.get(codigo) : undefined;
    if (daLoja === undefined) {
      if (codigo) semPreco++;
      return p;
    }
    if (daLoja !== p.preco) atualizados++;
    return { ...p, preco: daLoja };
  });

  console.log(`[catalogo] ${atualizados} preço(s) atualizados pelo PDV`);
  if (semPreco > 0) {
    console.warn(
      `[catalogo] ${semPreco} produto(s) da planilha têm código que a loja não reconhece — ` +
      'ficaram com o preço da planilha. Confira a coluna "codigo".',
    );
  }
  return saida;
}

export async function getProductsDestaque(): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.destaque).slice(0, 8);
}

export async function getServices(): Promise<Service[]> {
  return servicosData as Service[];
}

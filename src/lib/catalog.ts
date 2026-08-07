/**
 * Camada de dados do catálogo.
 *
 * As páginas SÓ conversam com getProducts()/getServices() — nunca com a fonte
 * direto. Hoje a fonte é o JSON de exemplo; com CATALOG_CSV_URL no .env passa
 * a ser a planilha do Google publicada em CSV. Na Fase 3 (e-commerce), troca-se
 * por banco/CMS mexendo só neste arquivo.
 */
import type { Product, Service } from './types';
import produtosExemplo from '../data/products.json';
import servicosData from '../data/services.json';
import { produtosDaPlanilha } from './sheets';

let cacheProdutos: Product[] | null = null;

export async function getProducts(): Promise<Product[]> {
  if (!cacheProdutos) {
    const csvUrl = import.meta.env.CATALOG_CSV_URL as string | undefined;
    const todos = csvUrl ? await produtosDaPlanilha(csvUrl) : (produtosExemplo as Product[]);
    cacheProdutos = todos.filter((p) => p.ativo);
  }
  return cacheProdutos;
}

export async function getProductsDestaque(): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.destaque).slice(0, 8);
}

export async function getServices(): Promise<Service[]> {
  return servicosData as Service[];
}

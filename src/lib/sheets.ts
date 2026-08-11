/**
 * Adaptador Google Sheets → catálogo.
 *
 * O dono edita uma planilha com as colunas:
 *   id | codigo | nome | categoria | subcategoria | descricao | foto_url | variacoes | ativo | destaque | preco(opcional)
 * e publica como CSV (Arquivo → Compartilhar → Publicar na web → CSV).
 * O link publicado vai em CATALOG_CSV_URL no .env. A leitura acontece no build.
 */
import type { Product } from './types';

export async function produtosDaPlanilha(csvUrl: string): Promise<Product[]> {
  const res = await fetch(csvUrl);
  if (!res.ok) {
    throw new Error(
      `Não consegui ler a planilha do catálogo (HTTP ${res.status}). Confira o CATALOG_CSV_URL no .env.`,
    );
  }
  const linhas = parseCsv(await res.text());
  if (linhas.length < 2) return [];

  const cabecalho = linhas[0].map((c) => c.trim().toLowerCase());
  const idx = (nome: string) => cabecalho.indexOf(nome);
  const col = (linha: string[], nome: string) => {
    const i = idx(nome);
    return i >= 0 ? (linha[i] ?? '').trim() : '';
  };

  return linhas
    .slice(1)
    .filter((l) => col(l, 'id') !== '')
    .map((l) => ({
      id: col(l, 'id'),
      nome: col(l, 'nome'),
      categoria: (col(l, 'categoria') || 'papelaria') as Product['categoria'],
      subcategoria: col(l, 'subcategoria'),
      preco: parsePreco(col(l, 'preco')),
      codigo: col(l, 'codigo') || undefined,
      descricao: col(l, 'descricao'),
      imagens: [col(l, 'foto_url') || '/img/produtos/placeholder.svg'],
      variacoes: col(l, 'variacoes')
        ? col(l, 'variacoes').split('|').map((v) => v.trim()).filter(Boolean)
        : [],
      estoque: null,
      ativo: simNao(col(l, 'ativo'), true),
      destaque: simNao(col(l, 'destaque'), false),
    }));
}

/**
 * Aceita "18,90", "R$ 18,90", "1.234,56", "18.90" e "1.500".
 *
 * O caso "1.500" é o motivo desta função ser mais longa que o óbvio: quem preenche
 * planilha no Brasil escreve mil e quinhentos como "1.500", sem centavos. Tratando
 * o ponto como decimal (Number("1.500") === 1.5), um notebook de R$ 1.500 aparecia
 * no site por R$ 1,50. A regra abaixo desempata pelo formato dos grupos de dígitos.
 */
function parsePreco(texto: string): number {
  const limpo = texto.replace(/[^\d,.-]/g, '');
  if (limpo === '') return 0;

  let normalizado: string;

  if (limpo.includes(',')) {
    // Tem vírgula => formato brasileiro. Ponto é milhar, vírgula é decimal.
    // "1.234,56" -> "1234.56"
    normalizado = limpo.replace(/\./g, '').replace(',', '.');
  } else if (/^-?\d{1,3}(\.\d{3})+$/.test(limpo)) {
    // Sem vírgula, mas todo ponto é seguido de exatamente 3 dígitos:
    // "1.500" e "1.234.567" são milhar. Some com os pontos.
    normalizado = limpo.replace(/\./g, '');
  } else {
    // "18.90", "18.9", "1234.56" — aqui o ponto é decimal mesmo.
    normalizado = limpo;
  }

  const n = Number(normalizado);
  return Number.isFinite(n) ? n : 0;
}

/** "sim", "s", "true", "1", "x" → true (vazio usa o padrão). */
function simNao(texto: string, padrao: boolean): boolean {
  if (texto === '') return padrao;
  return /^(sim|s|true|verdadeiro|1|x)$/i.test(texto);
}

/** Parser CSV mínimo com suporte a aspas e quebras de linha dentro de campos. */
function parseCsv(texto: string): string[][] {
  const linhas: string[][] = [];
  let linha: string[] = [];
  let campo = '';
  let entreAspas = false;

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (entreAspas) {
      if (c === '"') {
        if (texto[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          entreAspas = false;
        }
      } else {
        campo += c;
      }
    } else if (c === '"') {
      entreAspas = true;
    } else if (c === ',') {
      linha.push(campo);
      campo = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      linha.push(campo);
      campo = '';
      if (linha.some((v) => v !== '')) linhas.push(linha);
      linha = [];
    } else {
      campo += c;
    }
  }
  linha.push(campo);
  if (linha.some((v) => v !== '')) linhas.push(linha);
  return linhas;
}

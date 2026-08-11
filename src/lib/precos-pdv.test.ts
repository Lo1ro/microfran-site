/**
 * Testes do cruzamento planilha × preço do PDV.
 *
 * O que importa aqui: o site nunca pode ficar SEM preço por causa da nuvem, e
 * nunca pode mostrar preço diferente do que a loja cobra quando os dois se
 * conhecem.
 */
import { describe, expect, it, vi, afterEach } from 'vitest';
import { precosDaLoja } from './precos-pdv';

const URL_FAKE = 'https://exemplo.supabase.co';
const CHAVE = 'chave-de-teste';

function respostaOk(dados: unknown) {
  return { ok: true, status: 200, json: async () => dados } as Response;
}

afterEach(() => vi.unstubAllGlobals());

describe('preços vindos do PDV', () => {
  it('casa pelo código de barras e pelo código interno', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.includes('/products')) {
        return respostaOk([
          { id: 'p1', codigo_interno: '7891', preco_venda: 680, ativo: true },
          { id: 'p2', codigo_interno: null, preco_venda: 1290, ativo: true },
        ]);
      }
      return respostaOk([
        { codigo: '7891000111', product_id: 'p1' },
        { codigo: '7891000222', product_id: 'p2' },
      ]);
    }));

    const precos = await precosDaLoja(URL_FAKE, CHAVE);

    expect(precos.get('7891')).toBe(6.8);        // código interno
    expect(precos.get('7891000111')).toBe(6.8);  // código de barras
    expect(precos.get('7891000222')).toBe(12.9); // produto sem código interno
  });

  it('centavos viram reais corretamente', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) =>
      url.includes('/products')
        ? respostaOk([{ id: 'p1', codigo_interno: '1', preco_venda: 3, ativo: true }])
        : respostaOk([])));

    const precos = await precosDaLoja(URL_FAKE, CHAVE);
    expect(precos.get('1')).toBe(0.03); // 3 centavos, não 3 reais
  });

  it('nuvem fora do ar NÃO derruba o build', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('sem rede'); }));
    await expect(precosDaLoja(URL_FAKE, CHAVE)).resolves.toEqual(new Map());
  });

  it('nuvem respondendo erro NÃO derruba o build', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 401 } as Response)));
    await expect(precosDaLoja(URL_FAKE, CHAVE)).resolves.toEqual(new Map());
  });

  it('se os códigos de barras falharem, os preços por código interno continuam valendo', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) =>
      url.includes('/products')
        ? respostaOk([{ id: 'p1', codigo_interno: '999', preco_venda: 500, ativo: true }])
        : ({ ok: false, status: 500 } as Response)));

    const precos = await precosDaLoja(URL_FAKE, CHAVE);
    expect(precos.get('999')).toBe(5);
  });
});

/**
 * Preços vindos do sistema da loja (PDV), pela nuvem.
 *
 * A planilha diz QUAIS produtos aparecem no site e como eles se apresentam
 * (nome de vitrine, foto, descrição). O **preço** vem daqui — do mesmo lugar
 * onde a loja vende todo dia.
 *
 * Por que não deixar o preço na planilha: o dono atualiza preço no PDV, que é
 * onde ele trabalha. Se o site tivesse a própria cópia, o cliente veria R$ 6,80
 * na tela e pagaria R$ 7,50 no balcão — e a culpa seria do site.
 *
 * A ligação é o **código de barras** (ou o código interno do produto), que é o
 * mesmo nos dois lados porque veio da mesma migração.
 *
 * Se a nuvem estiver fora do ar ou o produto não for encontrado, o site cai
 * pro preço da planilha (coluna opcional `preco`). Vitrine sem preço é pior
 * que vitrine com preço um pouco velho.
 */

/** codigo (barras ou interno) → preço em reais */
export type TabelaDePrecos = Map<string, number>;

interface LinhaProduto {
  codigo_interno: string | null;
  preco_venda: number; // centavos
  ativo: boolean;
}

interface LinhaBarras {
  codigo: string;
  product_id: string;
}

interface LinhaProdutoComId extends LinhaProduto {
  id: string;
}

/**
 * Busca a tabela de preços da loja. Roda **no build**, não no navegador —
 * a chave nunca chega ao visitante.
 *
 * Devolve um mapa vazio (nunca lança) se a nuvem não responder: o site precisa
 * continuar sendo gerado mesmo com a loja offline.
 */
export async function precosDaLoja(url: string, chave: string): Promise<TabelaDePrecos> {
  const tabela: TabelaDePrecos = new Map();
  const base = url.replace(/\/$/, '');
  const cabecalhos = { apikey: chave, Authorization: `Bearer ${chave}` };

  try {
    const resProdutos = await fetch(
      `${base}/rest/v1/products?select=id,codigo_interno,preco_venda,ativo&ativo=eq.true&preco_venda=gt.0`,
      { headers: cabecalhos },
    );
    if (!resProdutos.ok) {
      console.warn(`[precos] a nuvem respondeu ${resProdutos.status} — usando os preços da planilha`);
      return tabela;
    }
    const produtos: LinhaProdutoComId[] = await resProdutos.json();

    const porId = new Map<string, number>();
    for (const p of produtos) {
      const reais = p.preco_venda / 100;
      porId.set(p.id, reais);
      // o código interno também serve de chave: na loja, muitos produtos usam
      // o próprio EAN como código
      if (p.codigo_interno) tabela.set(p.codigo_interno.trim(), reais);
    }

    const resBarras = await fetch(
      `${base}/rest/v1/product_barcodes?select=codigo,product_id`,
      { headers: cabecalhos },
    );
    if (resBarras.ok) {
      const barras: LinhaBarras[] = await resBarras.json();
      for (const b of barras) {
        const preco = porId.get(b.product_id);
        if (preco !== undefined) tabela.set(b.codigo.trim(), preco);
      }
    }

    console.log(`[precos] ${tabela.size} códigos com preço vindos do PDV`);
  } catch (e) {
    console.warn(`[precos] não consegui falar com a nuvem (${e}) — usando os preços da planilha`);
  }

  return tabela;
}

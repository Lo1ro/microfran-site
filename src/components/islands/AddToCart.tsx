import { useState } from 'preact/hooks';
import { adicionar } from '../../stores/cart';
import { brl } from '../../lib/money';

interface ProdutoMin {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  variacoes?: string[];
}

interface Props {
  produto: ProdutoMin;
  /** compact = botão único no card do catálogo; completo = página do produto. */
  compact?: boolean;
}

export default function AddToCart({ produto, compact = false }: Props) {
  const temVariacoes = (produto.variacoes?.length ?? 0) > 0;
  const [qty, setQty] = useState(1);
  const [variacao, setVariacao] = useState(produto.variacoes?.[0] ?? '');
  const [ok, setOk] = useState(false);

  function add(quantidade: number) {
    adicionar(
      {
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagem,
        variacao: temVariacoes ? variacao : undefined,
      },
      quantidade,
    );
    setOk(true);
    setTimeout(() => setOk(false), 1800);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => add(1)}
        class={`btn btn-sm w-full ${ok ? 'btn-ok' : 'btn-primary'}`}
        aria-live="polite"
      >
        {ok ? 'Adicionado ✓' : 'Adicionar'}
      </button>
    );
  }

  return (
    <div class="space-y-4">
      {temVariacoes && (
        <label class="block">
          <span class="mb-1.5 block text-sm font-bold">Opção</span>
          <select
            class="input !pl-4"
            value={variacao}
            onChange={(e) => setVariacao((e.target as HTMLSelectElement).value)}
          >
            {produto.variacoes!.map((v) => (
              <option value={v}>{v}</option>
            ))}
          </select>
        </label>
      )}

      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center rounded-full border-[1.5px] border-line bg-surface">
          <button
            type="button"
            class="grid h-11 w-11 place-items-center rounded-full text-lg font-bold hover:text-brand-deep"
            onClick={() => setQty(Math.max(1, qty - 1))}
            aria-label="Diminuir quantidade"
          >
            −
          </button>
          <span class="w-8 text-center font-display text-lg font-extrabold" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            class="grid h-11 w-11 place-items-center rounded-full text-lg font-bold hover:text-brand-deep"
            onClick={() => setQty(qty + 1)}
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => add(qty)}
          class={`btn flex-1 whitespace-nowrap ${ok ? 'btn-ok' : 'btn-primary'}`}
        >
          {ok ? 'Adicionado ✓' : `Adicionar · ${brl(produto.preco * qty)}`}
        </button>
      </div>

      <p class="text-sm" aria-live="polite">
        {ok ? (
          <a href="/carrinho" class="font-bold text-brand-deep underline underline-offset-4">
            Ver carrinho e finalizar no WhatsApp →
          </a>
        ) : (
          <span class="text-ink-soft">Sem cadastro: o pedido é finalizado no WhatsApp da loja.</span>
        )}
      </p>
    </div>
  );
}

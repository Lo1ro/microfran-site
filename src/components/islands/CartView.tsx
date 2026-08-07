import { useStore } from '@nanostores/preact';
import {
  cart,
  chaveDe,
  esvaziar,
  mudarQtd,
  remover,
  totalItens,
  totalValor,
} from '../../stores/cart';
import { brl } from '../../lib/money';
import { mensagemPedido, waLink } from '../../lib/whatsapp';

/** Página do carrinho: revisar itens e finalizar no WhatsApp. */
export default function CartView() {
  const itens = useStore(cart);
  const qtdTotal = useStore(totalItens);
  const total = useStore(totalValor);

  if (itens.length === 0) {
    return (
      <div class="card mx-auto max-w-lg px-8 py-14 text-center">
        <p class="font-display text-2xl font-extrabold">Seu carrinho está vazio</p>
        <p class="mt-2 text-ink-soft">
          Dá uma olhada no catálogo — papelaria e informática com preço na etiqueta.
        </p>
        <a href="/catalogo" class="btn btn-primary mt-6">
          Ver catálogo
        </a>
      </div>
    );
  }

  const linkPedido = waLink(mensagemPedido(itens, total));

  return (
    <div class="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      <ul class="space-y-3">
        {itens.map((item) => {
          const chave = chaveDe(item);
          return (
            <li key={chave} class="card flex items-center gap-4 p-3 sm:p-4">
              <img
                src={item.imagem}
                alt=""
                width="72"
                height="72"
                loading="lazy"
                class="h-16 w-16 shrink-0 rounded-xl border border-line bg-surface object-cover sm:h-[72px] sm:w-[72px]"
              />
              <div class="min-w-0 flex-1">
                <p class="truncate font-bold leading-snug">{item.nome}</p>
                {item.variacao && <p class="text-sm text-ink-soft">{item.variacao}</p>}
                <p class="mt-0.5 text-sm text-ink-soft">{brl(item.preco)} cada</p>
              </div>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="grid h-8 w-8 place-items-center rounded-full border-[1.5px] border-line font-bold hover:border-brand hover:text-brand-deep"
                  onClick={() => mudarQtd(chave, item.qty - 1)}
                  aria-label={`Diminuir quantidade de ${item.nome}`}
                >
                  −
                </button>
                <span class="w-7 text-center font-display font-extrabold" aria-live="polite">
                  {item.qty}
                </span>
                <button
                  type="button"
                  class="grid h-8 w-8 place-items-center rounded-full border-[1.5px] border-line font-bold hover:border-brand hover:text-brand-deep"
                  onClick={() => mudarQtd(chave, item.qty + 1)}
                  aria-label={`Aumentar quantidade de ${item.nome}`}
                >
                  +
                </button>
              </div>
              <p class="hidden w-24 text-right font-display font-extrabold sm:block">
                {brl(item.preco * item.qty)}
              </p>
              <button
                type="button"
                class="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-red-50 hover:text-red-700"
                onClick={() => remover(chave)}
                aria-label={`Remover ${item.nome} do carrinho`}
                title="Remover"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-4.5 w-4.5" aria-hidden="true">
                  <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>

      <aside class="card sticky top-24 p-6">
        <h2 class="font-display text-xl font-extrabold">Resumo do pedido</h2>
        <dl class="mt-4 space-y-2 text-sm">
          <div class="flex justify-between text-ink-soft">
            <dt>Itens</dt>
            <dd>{qtdTotal}</dd>
          </div>
          <div class="flex justify-between border-t border-line pt-3 text-base">
            <dt class="font-bold">Total</dt>
            <dd class="font-display text-xl font-extrabold">{brl(total)}</dd>
          </div>
        </dl>
        <a href={linkPedido} target="_blank" rel="noopener" class="btn btn-wa mt-5 w-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true">
            <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z" />
            <path d="M9.1 8.2c.3-.7.9-.75 1.2-.1l.55 1.1c.12.25.07.55-.11.78l-.5.62a6.1 6.1 0 0 0 2.86 2.86l.62-.5c.23-.18.53-.23.78-.11l1.1.55c.65.32.6.95-.1 1.3-.72.36-1.55.44-2.32.18a8.2 8.2 0 0 1-4.66-4.66c-.26-.77-.15-1.62.58-2.02Z" />
          </svg>
          Finalizar pedido no WhatsApp
        </a>
        <p class="mt-3 text-xs leading-relaxed text-ink-soft">
          O pedido abre prontinho no WhatsApp da loja — você só completa seu nome, a forma de
          pagamento e se prefere retirar ou combinar entrega.
        </p>
        <button
          type="button"
          class="mt-4 text-xs font-semibold text-ink-soft underline underline-offset-4 hover:text-red-700"
          onClick={() => {
            if (confirm('Esvaziar o carrinho?')) esvaziar();
          }}
        >
          Esvaziar carrinho
        </button>
      </aside>
    </div>
  );
}

import { useStore } from '@nanostores/preact';
import { totalItens } from '../../stores/cart';

/** Bolinha com a contagem de itens, no ícone do carrinho do header. */
export default function CartIndicator() {
  const total = useStore(totalItens);
  if (total === 0) return null;
  return (
    <span
      class="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[11px] font-extrabold leading-none text-brand-ink"
      aria-label={`${total} ${total === 1 ? 'item' : 'itens'} no carrinho`}
    >
      {total > 99 ? '99+' : total}
    </span>
  );
}

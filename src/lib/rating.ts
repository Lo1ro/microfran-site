/**
 * Nota do Google (Places API v1) com fallback estático.
 *
 * Com GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID no .env, a nota e o total de
 * avaliações vêm do Google a cada build (o deploy diário agendado — ver README —
 * faz o papel do cache de 1x/dia). Sem as chaves, usa o fallback do config.ts.
 */
import { SITE } from '../config';

export interface Rating {
  nota: number;
  total: number;
  url: string;
  aoVivo: boolean;
}

let cache: Rating | null = null;

export async function getGoogleRating(): Promise<Rating> {
  if (cache) return cache;

  const key = import.meta.env.GOOGLE_PLACES_API_KEY as string | undefined;
  const placeId = import.meta.env.GOOGLE_PLACE_ID as string | undefined;
  const url = placeId
    ? `https://search.google.com/local/reviews?placeid=${placeId}`
    : SITE.google.reviewsUrl;

  if (key && placeId) {
    try {
      const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
        headers: {
          'X-Goog-Api-Key': key,
          'X-Goog-FieldMask': 'rating,userRatingCount',
        },
      });
      if (res.ok) {
        const dados = (await res.json()) as { rating?: number; userRatingCount?: number };
        if (typeof dados.rating === 'number') {
          cache = { nota: dados.rating, total: dados.userRatingCount ?? 0, url, aoVivo: true };
          return cache;
        }
      }
      console.warn('[rating] Places API não respondeu como esperado — usando fallback.');
    } catch (erro) {
      console.warn('[rating] Falha ao consultar a Places API — usando fallback.', erro);
    }
  }

  cache = {
    nota: SITE.google.notaFallback,
    total: SITE.google.avaliacoesFallback,
    url,
    aoVivo: false,
  };
  return cache;
}

/** "4.4" → "4,4" para exibição. */
export const notaFormatada = (nota: number) =>
  nota.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

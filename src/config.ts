/**
 * Configuração central da Micro Fran.
 * É AQUI que o dono (ou quem mantém o site) mexe: WhatsApp, endereço,
 * horário, redes sociais. Nenhuma página precisa ser editada pra isso.
 */
export const SITE = {
  nome: 'Micro Fran',
  tagline: 'Informática, Papelaria e Soluções Gráficas',
  descricao:
    'Papelaria, informática e soluções gráficas em Jeriquara/SP. Monte seu pedido pelo site e finalize no WhatsApp — retirada na loja ou entrega combinada.',
  url: 'https://microfran.com.br',

  // WhatsApp da loja (formato internacional, só dígitos)
  whatsapp: '5516993724446',
  whatsappDisplay: '(16) 99372-4446',

  endereco: {
    rua: 'R. Cap. Antônio Joaquim, 406',
    bairro: 'Centro',
    cidade: 'Jeriquara',
    uf: 'SP',
    cep: '14450-000',
  },

  // {{PLACEHOLDER}} — confirmar com o dono os dias e o horário de abertura.
  // Enquanto isso o site só afirma o que já se sabe: fecha às 18h.
  horario: {
    resumo: 'Aberto de segunda a sexta, até as 18h',
    observacao: 'Chame no WhatsApp pra confirmar horários de sábado e feriados.',
  },

  redes: {
    instagram: 'https://www.instagram.com/papelariamicrofran/',
    facebook: 'https://www.facebook.com/papelariamicrofran/',
  },

  maps: {
    // Link "Como chegar" e iframe do mapa (não precisa de chave de API)
    busca: 'Micro Fran, R. Cap. Antônio Joaquim, 406, Jeriquara - SP',
  },

  google: {
    // Fallback exibido quando a Places API não está configurada (ver .env.example).
    // Números reais do perfil em jul/2026 — a API mantém isso atualizado sozinha.
    notaFallback: 4.4,
    avaliacoesFallback: 35,
    // {{PLACEHOLDER}} — trocar pelo link curto de avaliações do perfil da loja
    reviewsUrl: 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('Micro Fran Jeriquara SP'),
  },

  anosDeLoja: 20, // {{PLACEHOLDER}} — confirmar ano exato de fundação
} as const;

export const mapsComoChegar = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.maps.busca)}`;

export const mapsEmbed = () =>
  `https://www.google.com/maps?q=${encodeURIComponent(SITE.maps.busca)}&output=embed`;

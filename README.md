# Site Micro Fran — Informática, Papelaria e Soluções Gráficas

Vitrine/catálogo com carrinho que finaliza o pedido no **WhatsApp da loja** (sem pagamento online nesta fase). Construído em **Astro + Tailwind CSS 4 + ilhas Preact**, mobile-first, PT-BR, pensado pra evoluir pra e-commerce completo (Fase 3) sem reescrita.

- **Papelaria e Informática** → produtos com preço → catálogo + carrinho → `wa.me`.
- **Soluções Gráficas** → serviço personalizado → botão **"Pedir orçamento no WhatsApp"** (sem carrinho).

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # gera o site estático em dist/
npm run preview    # serve o dist/ localmente
```

Scripts auxiliares:

```bash
npm run placeholders   # regenera os SVGs de exemplo em public/img/produtos/
npm run og             # regenera public/og.png (imagem de compartilhamento)
```

## Onde mexer em cada coisa

| O quê | Onde |
|---|---|
| WhatsApp, endereço, horário, redes, nota fallback | `src/config.ts` |
| Produtos (dados de exemplo) | `src/data/products.json` |
| Serviços gráficos | `src/data/services.json` |
| Cores, fontes, botões, tags | `src/styles/global.css` (tokens no `@theme`) |
| Logo (recriada em SVG) | `src/components/Logo.astro` + `public/favicon.svg` |
| Textos das páginas | `src/pages/*.astro` |
| Mensagens de WhatsApp (pedido/orçamento) | `src/lib/whatsapp.ts` |

As páginas **nunca** leem a fonte de dados direto — tudo passa por `getProducts()` / `getServices()` em `src/lib/catalog.ts`. Pra trocar a fonte (JSON → planilha → banco na Fase 3), mexe só ali.

## Catálogo editável pelo dono (Google Sheets)

1. Crie uma planilha no Google Sheets com o cabeçalho exatamente assim (1ª linha):
   `id | nome | categoria | subcategoria | preco | descricao | foto_url | variacoes | ativo | destaque`
2. Preencha os produtos:
   - `categoria`: `papelaria` ou `informatica` (sem acento);
   - `preco`: aceita `18,90`, `R$ 18,90` ou `18.90`;
   - `variacoes`: opções separadas por barra vertical — ex.: `Capa azul|Capa rosa`;
   - `ativo`/`destaque`: `sim` ou `não` (vazio = ativo sim, destaque não);
   - `foto_url`: link da foto (ou caminho `/img/produtos/arquivo.jpg` se a foto estiver no site).
3. **Arquivo → Compartilhar → Publicar na web → formato CSV** e copie o link.
4. No projeto (ou nas variáveis do Vercel/Netlify): `CATALOG_CSV_URL=<link>` (veja `.env.example`).
5. O site lê a planilha **no build**. Configure um *Deploy Hook* no Vercel/Netlify e um agendador gratuito (ex.: cron-job.org) chamando o hook 1–2x por dia — ou clique em "Redeploy" quando quiser publicar mudanças na hora.

Sem `CATALOG_CSV_URL`, o site usa `src/data/products.json` (dados de exemplo atuais).

## Avaliações do Google (dinâmicas)

A Home e o Sobre mostram "4,4★ · N avaliações no Google". Pra esse número se atualizar sozinho:

1. No Google Cloud: criar projeto → ativar **Places API (New)** → criar chave de API (restrinja à Places API).
2. Descobrir o **Place ID** da loja: <https://developers.google.com/maps/documentation/places/web-service/place-id>
3. Preencher `GOOGLE_PLACES_API_KEY` e `GOOGLE_PLACE_ID` no ambiente de build.
4. A consulta acontece 1x por build — o mesmo deploy diário do catálogo faz o papel do cache de 1x/dia (custo praticamente zero).

Sem as chaves, vale o fallback de `src/config.ts` (hoje: 4,4★ · 35).

## Deploy (Vercel ou Netlify — plano grátis serve)

1. Suba o projeto pra um repositório no GitHub (`git init`, commit, push).
2. No Vercel/Netlify: **Import project** → framework Astro é detectado sozinho (build `npm run build`, saída `dist/`).
3. Adicione as variáveis de ambiente que for usar (`CATALOG_CSV_URL`, `GOOGLE_*`, `PUBLIC_GA4_ID`).
4. **Domínio:** registrar `microfran.com.br` no [registro.br](https://registro.br) (~R$ 40/ano) e apontar o DNS conforme a instrução do Vercel/Netlify.
5. **Google Business Profile (importante!):** o perfil da loja já existe (4,4★). Assim que o site estiver no ar, entrar no perfil e **"Adicionar website"** com a URL — pra loja física de cidade pequena, esse perfil traz mais cliente que o próprio site. Aproveitar pra completar horário e subir fotos.
6. **GA4:** criar propriedade no Google Analytics e colocar o ID em `PUBLIC_GA4_ID`.

## {{PLACEHOLDERS}} — o que o dono ainda precisa fornecer

| Item | Onde entra |
|---|---|
| Horário completo (dias + abertura; hoje só se sabe "fecha às 18h") | `src/config.ts` → `horario` |
| Ano exato de fundação / história real, nomes | `src/config.ts` → `anosDeLoja` + `src/pages/sobre.astro` |
| Catálogo real (produtos, preços, fotos) | planilha (seção acima) ou `src/data/products.json` |
| Lista final de serviços gráficos | `src/data/services.json` |
| Fotos reais da loja/produtos | `public/img/produtos/` (quadradas ~800×800) + seção de foto em `sobre.astro` |
| Logo original (arquivo) | substituir `src/components/Logo.astro` e `public/favicon.svg` |
| Link curto de avaliações do Google | `src/config.ts` → `google.reviewsUrl` (ou só configurar o Place ID) |
| Confirmar se informática inclui assistência técnica | ajustar copy da Home/Catálogo |

## Fase 3 (e-commerce) — o que já está pronto pra isso

- Schema do produto já tem `estoque`, `variacoes` e `imagens[]` (múltiplas fotos).
- Fonte de dados atrás de `getProducts()` — troca por banco/CMS sem tocar nas páginas.
- Carrinho é um store isolado (`src/stores/cart.ts`) — o checkout Mercado Pago (Pix/cartão) entra como um segundo botão ao lado do "Finalizar no WhatsApp".
- Páginas de produto já têm JSON-LD `Product` (SEO pronto pra rich results).

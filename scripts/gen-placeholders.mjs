/**
 * Gera as imagens placeholder (SVG) dos produtos de exemplo em
 * public/img/produtos/. Rode com: npm run placeholders
 *
 * Quando as fotos reais chegarem, é só colocar os arquivos (jpg/png/webp,
 * quadrados) no mesmo lugar e apontar o campo "imagens"/foto_url pra eles.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const destino = path.join(raiz, 'public', 'img', 'produtos');

// pétalas da marca
const P = {
  rosa: '#e85d9c',
  roxo: '#8a5bc7',
  azul: '#3e6fd9',
  ciano: '#27b5db',
  agua: '#2fbfa3',
  verde: '#72c247',
  amarelo: '#f2bb2f',
  laranja: '#f5821f',
};

// ícones em traço (grade 24×24)
const icones = {
  caderno:
    '<path d="M4 19.5V6a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2Z"/><path d="M20 20H6a2 2 0 0 1-2-2"/><path d="M9 4v16"/>',
  caneta:
    '<path d="m4 20 1-4L16.5 4.5a2.12 2.12 0 0 1 3 3L8 19l-4 1Z"/><path d="m14.5 6.5 3 3"/>',
  canetinhas:
    '<path d="M7 21V8l1.5-4h1L11 8v13Z"/><path d="M14 21V8l1.5-4h1L18 8v13Z"/><path d="M7 11h4M14 11h4"/>',
  lapis:
    '<path d="m4 20 1-4L16.5 4.5a2.12 2.12 0 0 1 3 3L8 19l-4 1Z"/><path d="m13 5.5 5.5 5.5"/>',
  borracha:
    '<rect x="4" y="9" width="16" height="9" rx="2.5" transform="rotate(-12 12 13.5)"/><path d="m10.2 8.2 3 10.4"/>',
  papel: '<path d="M6 2.5h9L19 7v14.5H6Z"/><path d="M14.5 2.5V7H19"/><path d="M9 12h6M9 15.5h6"/>',
  cola: '<rect x="8.5" y="8" width="7" height="12.5" rx="1.5"/><path d="M9.5 8V5.5a2.5 2.5 0 0 1 5 0V8"/><path d="M8.5 17h7"/>',
  tesoura:
    '<circle cx="6" cy="6" r="2.4"/><circle cx="6" cy="18" r="2.4"/><path d="m8 7.6 12 10.2M8 16.4 20 6.2"/>',
  estojo:
    '<rect x="3.5" y="8" width="17" height="10.5" rx="3"/><path d="M3.5 13.2h17"/><path d="M9 5.5h6a2 2 0 0 1 2 2V8H7v-.5a2 2 0 0 1 2-2Z"/>',
  mouse:
    '<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 7v3.5"/>',
  teclado:
    '<rect x="2.5" y="7" width="19" height="10" rx="2"/><path d="M6 10.5h.01M9.5 10.5h.01M13 10.5h.01M16.5 10.5h.01M6 13.5h.01M9 13.5h6M17.5 13.5h.01"/>',
  pendrive:
    '<rect x="9" y="8.5" width="6" height="12" rx="1.8"/><path d="M10.5 8.5V4h3v4.5"/><path d="M11.5 5.5h.01M13 5.5h.01"/>',
  cabo: '<path d="M4 20c4 0 3.5-6 8-6s4.5 4 8 4"/><rect x="2.5" y="4" width="7" height="6.5" rx="1.5"/><path d="M4.5 10.5V13M8 10.5V13"/>',
  fone: '<path d="M4 14.5v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4.2" height="6.5" rx="1.6"/><rect x="16.8" y="14" width="4.2" height="6.5" rx="1.6"/>',
  cartucho:
    '<path d="M7 3.5h10V9l1.5 1.5v10h-13v-10L7 9Z"/><path d="M7 9h10"/><path d="M12 13a1.8 1.8 0 0 1 1.8 1.8c0 1-1.8 2.7-1.8 2.7s-1.8-1.7-1.8-2.7A1.8 1.8 0 0 1 12 13Z"/>',
  flor: '',
};

// produto → [ícone, cor1, cor2]
const produtos = {
  'cad-univ-96': ['caderno', P.rosa, P.amarelo],
  'cad-broch-80': ['caderno', P.roxo, P.rosa],
  'caneta-esferografica': ['caneta', P.azul, P.ciano],
  'kit-canetinhas-12': ['canetinhas', P.rosa, P.verde],
  'lapis-hb': ['lapis', P.amarelo, P.laranja],
  'borracha-macia': ['borracha', P.agua, P.amarelo],
  'sulfite-a4-500': ['papel', P.ciano, P.rosa],
  'cola-bastao-40': ['cola', P.verde, P.amarelo],
  'tesoura-escolar': ['tesoura', P.laranja, P.rosa],
  'estojo-duplo': ['estojo', P.roxo, P.ciano],
  'mouse-sem-fio': ['mouse', P.azul, P.agua],
  'teclado-abnt2': ['teclado', P.ciano, P.azul],
  'pendrive-64gb': ['pendrive', P.agua, P.azul],
  'cabo-hdmi-2m': ['cabo', P.azul, P.roxo],
  'fone-microfone': ['fone', P.ciano, P.roxo],
  'cartucho-hp-664': ['cartucho', P.azul, P.laranja],
};

function svgProduto(icone, c1, c2) {
  const desenho =
    icone === 'flor'
      ? [0, 45, 90, 135, 180, 225, 270, 315]
          .map(
            (a, i) =>
              `<ellipse cx="400" cy="245" rx="115" ry="170" fill="${Object.values(P)[i]}" fill-opacity="0.55" transform="rotate(${a} 400 400)"/>`,
          )
          .join('')
      : `<g transform="translate(268 240) scale(11)" fill="none" stroke="#3a352e" stroke-opacity="0.85" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icones[icone]}</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#faf6ef"/>
  <circle cx="630" cy="170" r="250" fill="${c1}" opacity="0.16"/>
  <circle cx="720" cy="330" r="230" fill="${c2}" opacity="0.14"/>
  <circle cx="90" cy="720" r="200" fill="${c2}" opacity="0.10"/>
  ${desenho}
  <text x="400" y="706" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="600" fill="#a3988a">imagem ilustrativa</text>
</svg>
`;
}

await mkdir(destino, { recursive: true });
for (const [id, [icone, c1, c2]] of Object.entries(produtos)) {
  await writeFile(path.join(destino, `${id}.svg`), svgProduto(icone, c1, c2));
}
// placeholder genérico (usado quando a planilha não tem foto_url)
await writeFile(path.join(destino, 'placeholder.svg'), svgProduto('flor', P.rosa, P.ciano));

console.log(`✔ ${Object.keys(produtos).length + 1} placeholders gerados em public/img/produtos/`);

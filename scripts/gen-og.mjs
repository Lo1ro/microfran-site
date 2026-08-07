/**
 * Gera public/og.png (1200×630) — a imagem que aparece quando o link do site
 * é compartilhado no WhatsApp/redes. Rode com: npm run og
 * Requer a devDependency `sharp`.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const petalas = [
  '#e85d9c',
  '#8a5bc7',
  '#3e6fd9',
  '#27b5db',
  '#2fbfa3',
  '#72c247',
  '#f2bb2f',
  '#f5821f',
];

const flor = (cx, cy, escala, opacidade) =>
  petalas
    .map(
      (cor, i) =>
        `<ellipse cx="${cx}" cy="${cy - 14.5 * escala}" rx="${10.5 * escala}" ry="${15.5 * escala}" fill="${cor}" fill-opacity="${opacidade}" transform="rotate(${i * 45} ${cx} ${cy})"/>`,
    )
    .join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#faf6ef"/>
  ${flor(985, 315, 14, 0.75)}
  ${flor(1160, 40, 5, 0.35)}
  ${flor(60, 600, 4, 0.3)}
  <text x="90" y="255" font-family="Segoe UI, Arial, sans-serif" font-size="96" font-weight="800" fill="#dd6c0d">Micro Fran</text>
  <text x="92" y="325" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700" fill="#2b2b2b">Informática · Papelaria · Soluções Gráficas</text>
  <text x="92" y="395" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="400" fill="#6e655b">Monte seu pedido pelo site e finalize no WhatsApp.</text>
  <rect x="92" y="440" rx="26" width="330" height="52" fill="#f5821f"/>
  <text x="257" y="475" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="700" fill="#3f1d02">microfran.com.br</text>
  <text x="92" y="560" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="600" fill="#a3988a">Jeriquara/SP · há 20 anos na cidade</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(path.join(raiz, 'public', 'og.png'));
console.log('✔ public/og.png gerado (1200×630)');

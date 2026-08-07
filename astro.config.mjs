import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://microfran.com.br',
  trailingSlash: 'ignore',
  integrations: [preact(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});

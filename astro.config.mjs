// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://convergencia.pro',
  build: {
    // Hojas de estilo pequeñas van inline en el HTML: elimina
    // solicitudes CSS que bloquean el render (Logo.css, etc.)
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});

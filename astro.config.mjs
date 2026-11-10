import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://hubizan.github.io',

  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },

  integrations: [react()],

  // Politica de seguridad de contenido en un <meta>: GitHub Pages no deja poner cabeceras.
  // Los scripts solo pueden ser los de la propia web (Astro calcula sus huellas). Los estilos
  // admiten 'unsafe-inline' porque las animaciones ponen variables CSS en atributos style.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self' data:", // Vite mete dentro del CSS los trozos de fuente mas pequenos.
        "connect-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ],
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
});
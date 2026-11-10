// Mapa del sitio sin dependencias: las paginas son pocas y fijas.
import type { APIRoute } from 'astro';

const paginas = [
  { ruta: '/', alternas: { es: '/', en: '/en/' } },
  { ruta: '/en/', alternas: { es: '/', en: '/en/' } },
  { ruta: '/aviso-legal/' },
  { ruta: '/privacidad/' },
  { ruta: '/cookies/' },
];

export const GET: APIRoute = ({ site }) => {
  const url = (ruta: string) => new URL(ruta, site).href;
  const entradas = paginas.map((p) => {
    const alternas = p.alternas
      ? Object.entries(p.alternas).map(([lang, ruta]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${url(ruta)}"/>`).join('\n') + '\n'
      : '';
    return `  <url>\n    <loc>${url(p.ruta)}</loc>\n${alternas}  </url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entradas.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

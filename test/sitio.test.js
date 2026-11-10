// Comprueba la web ya compilada (dist/): SEO, accesibilidad, seguridad, textos legales y enlaces.
// Se lanza con `npm test`, que compila antes. Solo usa modulos de Node: no necesita dependencias.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { test } from 'node:test';

const SITIO = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DOMINIO = 'https://hubizan.github.io';

async function archivos(dir) {
  const salida = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) salida.push(...(await archivos(ruta)));
    else salida.push(ruta);
  }
  return salida;
}

const todos = await archivos(SITIO);
const paginas = await Promise.all(
  todos.filter((f) => f.endsWith('.html')).map(async (f) => ({ ruta: relative(SITIO, f).replaceAll('\\', '/'), html: await readFile(f, 'utf8') })),
);
const portadas = paginas.filter((p) => p.ruta === 'index.html' || p.ruta === 'en/index.html');
const legales = ['aviso-legal/index.html', 'privacidad/index.html', 'cookies/index.html'];
const texto = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('estan todas las paginas', () => {
  for (const r of ['index.html', 'en/index.html', ...legales]) assert.ok(paginas.some((p) => p.ruta === r), `falta ${r}`);
});

test('cada pagina: idioma, viewport, titulo, descripcion, canonical y un solo h1', () => {
  for (const { ruta, html } of paginas) {
    assert.match(html, /<html lang="(es|en)"/, `${ruta}: sin lang`);
    assert.match(html, /<meta name="viewport"/, `${ruta}: sin viewport`);
    const titulo = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    assert.ok(titulo.length >= 10 && titulo.length <= 70, `${ruta}: titulo de ${titulo.length} caracteres`);
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
    assert.ok(desc.length >= 50 && desc.length <= 170, `${ruta}: descripcion de ${desc.length} caracteres`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${DOMINIO}/`), `${ruta}: canonical que no es del dominio`);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${ruta}: debe tener un solo h1`);
    assert.match(html, /property="og:title"/, `${ruta}: sin Open Graph`);
  }
});

test('las dos portadas se enlazan entre si (hreflang) y llevan datos estructurados', () => {
  for (const { ruta, html } of portadas) {
    for (const lang of ['es', 'en', 'x-default']) assert.match(html, new RegExp(`hreflang="${lang}"`), `${ruta}: sin hreflang ${lang}`);
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(ld, `${ruta}: sin datos estructurados`);
    const datos = JSON.parse(ld[1]);
    assert.equal(datos['@context'], 'https://schema.org');
    assert.equal(datos['@type'], 'Person');
    assert.equal(datos.name, 'Izan Trompeta');
  }
});

test('accesibilidad basica: alt en imagenes y salto al contenido', () => {
  for (const { ruta, html } of paginas) {
    for (const img of html.match(/<img\b[^>]*>/g) || []) assert.match(img, /\balt="[^"]+"/, `${ruta}: imagen sin alt`);
    assert.match(html, /class="saltar" href="#contenido"/, `${ruta}: sin salto al contenido`);
    assert.match(html, /id="contenido"/, `${ruta}: el salto no lleva a ningun sitio`);
  }
});

test('seguridad: politica de contenido estricta para scripts y nada de terceros', () => {
  for (const { ruta, html } of paginas) {
    const csp = html.match(/<meta http-equiv="content-security-policy" content="([^"]*)"/i)?.[1];
    assert.ok(csp, `${ruta}: sin politica de seguridad de contenido`);
    assert.match(csp, /default-src 'self'/, `${ruta}: default-src no es 'self'`);
    assert.match(csp, /object-src 'none'/, `${ruta}: object-src abierto`);
    const scriptSrc = csp.match(/script-src([^;]*)/)?.[1] ?? '';
    assert.doesNotMatch(scriptSrc, /unsafe-inline|unsafe-eval|https?:|\*/, `${ruta}: script-src demasiado abierto: ${scriptSrc}`);
    for (const s of html.match(/<script\b[^>]*\bsrc="([^"]+)"/g) || []) {
      assert.doesNotMatch(s, /src="(https?:)?\/\//, `${ruta}: script de terceros: ${s}`);
    }
    for (const l of html.match(/<link\b[^>]*rel="stylesheet"[^>]*>/g) || []) {
      assert.doesNotMatch(l, /href="(https?:)?\/\//, `${ruta}: hoja de estilos de terceros: ${l}`);
    }
  }
});

test('enlaces internos que existen', () => {
  for (const { ruta, html } of paginas) {
    for (const [, enlace] of html.matchAll(/<a\b[^>]*href="([^"#]*)(#[^"]*)?"/g)) {
      if (!enlace || /^([a-z]+:|\/\/)/i.test(enlace)) continue;
      const destino = enlace.endsWith('/') ? join(SITIO, enlace, 'index.html') : join(SITIO, enlace);
      assert.ok(existsSync(destino), `${ruta}: enlace roto a ${enlace}`);
    }
  }
});

test('textos legales enlazados desde todas las paginas y con el titular', async () => {
  for (const { ruta, html } of paginas) {
    for (const r of ['/aviso-legal/', '/privacidad/', '/cookies/']) assert.ok(html.includes(`href="${r}"`), `${ruta}: no enlaza ${r}`);
  }
  const aviso = texto(paginas.find((p) => p.ruta === 'aviso-legal/index.html').html);
  assert.match(aviso, /Titular: Izan Trompeta/);
  assert.match(aviso, /izan\.trompeta@gmail\.com/);
  const privacidad = texto(paginas.find((p) => p.ruta === 'privacidad/index.html').html);
  assert.match(privacidad, /Oficina correo/, 'la politica de privacidad debe explicar la app de Gmail (la pide Google)');
  assert.match(privacidad, /requisitos de uso limitado/);
});

test('nada de datos que no deben salir: ni telefono ni direcciones', () => {
  for (const { ruta, html } of paginas) {
    assert.doesNotMatch(texto(html), /(\+34[\s.]?)?[6789]\d{2}[\s.]?\d{3}[\s.]?\d{3}\b/, `${ruta}: parece que hay un telefono`);
  }
});

test('buscadores: sitemap, robots y llms.txt', async () => {
  const sitemap = await readFile(join(SITIO, 'sitemap.xml'), 'utf8');
  for (const r of ['/', '/en/', '/aviso-legal/', '/privacidad/', '/cookies/']) assert.ok(sitemap.includes(`<loc>${DOMINIO}${r}</loc>`), `sitemap sin ${r}`);
  const robots = await readFile(join(SITIO, 'robots.txt'), 'utf8');
  assert.match(robots, new RegExp(`Sitemap: ${DOMINIO}/sitemap.xml`));
  const llms = await readFile(join(SITIO, 'llms.txt'), 'utf8');
  assert.match(llms, /^# Izan Trompeta/);
});

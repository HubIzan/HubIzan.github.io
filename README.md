# Portfolio de Izan Trompeta

Web estática en español e inglés, hecha con Astro.

## Comandos

- `npm install`: instala las dependencias.
- `npm run dev`: abre la web en local, en http://localhost:4321.
- `npm run build`: genera la versión final en `dist/`.

## Dónde cambiar cada cosa

- Textos, enlaces y tecnologías: `src/data/content.ts`.
- Estructura de la página: `src/components/Portfolio.astro`.
- Estilos, colores y animaciones: `src/styles/global.css`.

Para mostrar el botón del CV, deja el PDF en `public/` e indica su ruta en `links.cv`. El PDF de la web no debe incluir el teléfono.

## Publicación

`.github/workflows/deploy.yml` publica la web al subir cambios a `main`. Antes hay que elegir GitHub Actions como origen en Settings > Pages del repositorio.

import { cloneElement } from 'react';
import './LogoLoop.css';

// Debe coincidir con el max-width de .logo-loop en LogoLoop.css.
const MAX_WIDTH = 448;

// Carrusel horizontal solo con CSS: se renderiza en el servidor y no envía JavaScript al navegador.
export default function LogoLoop({
  id,
  logos,
  ariaLabel,
  speed = 40,
  gap = 24,
  logoHeight = 20,
  fadeOut = true,
  scaleOnHover = true,
  labels = 'hover'
}) {
  const groupWidth = logos.length * (logoHeight + gap);
  // Una copia más de las que caben para que nunca quede un hueco al avanzar.
  const copies = Math.ceil(MAX_WIDTH / groupWidth) + 1;
  const className = ['logo-loop', fadeOut && 'logo-loop--fade', scaleOnHover && 'logo-loop--scale']
    .filter(Boolean)
    .join(' ');
  const style = {
    '--logo-gap': `${gap / 16}rem`,
    '--logo-height': `${logoHeight / 16}rem`,
    '--logo-duration': `${groupWidth / speed}s`
  };

  return (
    <div className={className} style={style}>
      {Array.from({ length: copies }, (_, copy) => (
        <ul
          key={copy}
          className="logo-loop__group"
          aria-label={copy === 0 ? ariaLabel : undefined}
          aria-hidden={copy === 0 ? undefined : 'true'}
        >
          {logos.map(({ node, title }, index) => (
            <li key={title} className="logo-loop__item">
              {/* Las copias reutilizan el icono de la primera para no repetir sus trazados en el HTML */}
              {copy === 0 ? (
                cloneElement(node, { id: `${id}-${index}` })
              ) : (
                <svg width="1em" height="1em">
                  <use href={`#${id}-${index}`} />
                </svg>
              )}
              {labels === 'hover' ? <span className="logo-loop__label">{title}</span> : <span className="logo-loop__sr">{title}</span>}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

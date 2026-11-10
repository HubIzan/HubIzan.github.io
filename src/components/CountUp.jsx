import { useEffect, useRef } from 'react';

const DURATION = 2000;

const easeOutCubic = t => 1 - (1 - t) ** 3;

const format = (value, prefix, separator) =>
  prefix + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);

// Cuenta desde 0 hasta `to` la primera vez que el número aparece en pantalla.
export default function CountUp({ to, prefix, separator, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    const write = value => {
      node.textContent = format(value, prefix, separator);
    };
    let frame;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        write(to);
        return;
      }

      const start = performance.now();
      const tick = now => {
        const progress = Math.min(1, Math.max(0, (now - start) / DURATION));
        write(to * easeOutCubic(progress));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, prefix, separator]);

  return (
    <span ref={ref} className={className}>
      {format(0, prefix, separator)}
    </span>
  );
}

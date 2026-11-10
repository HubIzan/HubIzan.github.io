import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './TextType.css';

const NEIGHBORS = {
  a: 'qwsz',
  b: 'vghn',
  c: 'xdfv',
  d: 'serfcx',
  e: 'wsdr',
  f: 'drtgvc',
  g: 'ftyhbv',
  h: 'gyujnb',
  i: 'ujko',
  j: 'huikmn',
  k: 'jiolm',
  l: 'kop',
  m: 'njk',
  n: 'bhjm',
  o: 'iklp',
  p: 'ol',
  q: 'wa',
  r: 'edft',
  s: 'awedxz',
  t: 'rfgy',
  u: 'yhji',
  v: 'cfgb',
  w: 'qase',
  x: 'zsdc',
  y: 'tghu',
  z: 'asx'
};

const FADE_IN = [{ opacity: 0 }, { opacity: 1 }];
const FADE_OPTIONS = { duration: 360, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' };
const BLINK = 0.5;
const GLIDE = 0.12;

const typoFor = char => {
  const keys = NEIGHBORS[char.toLowerCase()];
  if (!keys) return null;
  const pick = keys[Math.floor(Math.random() * keys.length)];
  return char === char.toLowerCase() ? pick : pick.toUpperCase();
};

const animateChar = node => {
  if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  node.animate(FADE_IN, FADE_OPTIONS);
};

// Basado en TextType de React Bits, reducido a lo que usa esta web.
export default function TextType({
  text,
  className = '',
  style,
  typingSpeed,
  pauseDuration,
  deletingSpeed,
  mistakes,
  cursorColor,
  onSentenceComplete
}) {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [typo, setTypo] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const containerRef = useRef(null);
  const caretRef = useRef(null);
  const cursorRef = useRef(null);
  const blinkRef = useRef(null);
  const blinkTimeline = useRef(null);
  const blinkResume = useRef(null);
  const caretPosition = useRef(null);
  const placeCursor = useRef(() => {});
  const lastTypo = useRef(-1);

  const chars = useMemo(() => Array.from(text[index]), [text, index]);
  const total = chars.length;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const blink = blinkRef.current;
    gsap.set(blink, { opacity: 1 });
    if (reduceMotion) return;

    const hold = BLINK * 0.7;
    const fade = BLINK * 0.45;
    const timeline = gsap.timeline({ repeat: -1 });
    timeline
      .to(blink, { opacity: 0, duration: fade, ease: 'sine.inOut' }, hold)
      .to(blink, { opacity: 1, duration: fade, ease: 'sine.inOut' }, hold + fade + BLINK * 0.4);
    blinkTimeline.current = timeline;

    return () => {
      timeline.kill();
      blinkResume.current?.kill();
      gsap.killTweensOf(blink);
      blinkTimeline.current = null;
    };
  }, [reduceMotion]);

  useLayoutEffect(() => {
    placeCursor.current = instant => {
      const caret = caretRef.current;
      const cursor = cursorRef.current;
      const x = caret.offsetLeft;
      const y = caret.offsetTop;
      const last = caretPosition.current;
      if (last && Math.abs(last.x - x) < 0.5 && Math.abs(last.y - y) < 0.5) return;
      caretPosition.current = { x, y };

      if (instant || !last || reduceMotion || Math.abs(last.y - y) > 1) {
        gsap.killTweensOf(cursor);
        gsap.set(cursor, { x, y });
      } else {
        gsap.to(cursor, { x, y, duration: GLIDE, ease: 'power3.out', overwrite: true });
      }

      const timeline = blinkTimeline.current;
      const blink = blinkRef.current;
      if (instant || !timeline) return;
      timeline.pause();
      blinkResume.current?.kill();
      gsap.to(blink, { opacity: 1, duration: 0.12, ease: 'power1.out' });
      blinkResume.current = gsap.delayedCall(0.12, () => timeline.restart());
    };
    placeCursor.current(false);
  });

  useEffect(() => {
    const observer = new ResizeObserver(() => placeCursor.current(true));
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let timeout;
    const wait = (ms, next) => {
      timeout = setTimeout(next, ms);
    };

    if (!isDeleting) {
      if (typo) {
        if (reduceMotion) {
          wait(0, () => setTypo(null));
        } else if (!typo.fixing) {
          if (typo.tail.length < typo.plan.length) {
            wait(typingSpeed, () => setTypo({ ...typo, tail: typo.plan.slice(0, typo.tail.length + 1) }));
          } else {
            wait(260 + Math.random() * 320, () => setTypo({ ...typo, fixing: true }));
          }
        } else if (typo.tail.length) {
          wait(Math.max(45, deletingSpeed), () => setTypo({ ...typo, tail: typo.tail.slice(0, -1) }));
        } else {
          wait(90 + Math.random() * 140, () => setTypo(null));
        }
      } else if (count < total) {
        const wrong = count > 0 && lastTypo.current !== count ? typoFor(chars[count]) : null;

        if (reduceMotion) {
          wait(0, () => setCount(total));
        } else if (wrong && Math.random() < mistakes * 0.16) {
          lastTypo.current = count;
          const plan = [wrong];
          const follow = chars[count + 1];
          if (follow && follow.trim() && Math.random() < 0.4) plan.push(follow);
          wait(typingSpeed, () => setTypo({ plan, tail: [wrong], fixing: false }));
        } else {
          wait(typingSpeed, () => setCount(count + 1));
        }
      } else if (index < text.length - 1) {
        wait(pauseDuration, () => setIsDeleting(true));
      }
    } else if (count > 0) {
      wait(reduceMotion ? 0 : deletingSpeed, () => setCount(reduceMotion ? 0 : count - 1));
    } else {
      onSentenceComplete(index);
      lastTypo.current = -1;
      setIsDeleting(false);
      setIndex(index + 1);
    }

    return () => clearTimeout(timeout);
  }, [
    isDeleting,
    count,
    total,
    chars,
    typo,
    index,
    text,
    deletingSpeed,
    pauseDuration,
    typingSpeed,
    mistakes,
    reduceMotion,
    onSentenceComplete
  ]);

  return (
    <span ref={containerRef} className={`text-type ${className}`} style={style}>
      <span className="text-type__sr">{text.join(' ')}</span>
      <span aria-hidden="true">
        <span>
          {chars.slice(0, count).map((char, i) => (
            <span key={i} ref={animateChar} className="text-type__char">
              {char}
            </span>
          ))}
          {(typo?.tail ?? []).map((char, i) => (
            <span key={`typo-${i}`} ref={animateChar} className="text-type__char">
              {char}
            </span>
          ))}
        </span>
        <span ref={caretRef} className="text-type__caret">
          {'​'}
        </span>
      </span>
      <span ref={cursorRef} aria-hidden="true" className="text-type__cursor" style={{ color: cursorColor }}>
        <span ref={blinkRef} className="text-type__blink">
          <span className="text-type__shape" />
        </span>
      </span>
    </span>
  );
}

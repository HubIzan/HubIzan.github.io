import { useCallback, useState } from 'react';
import TextType from './TextType';

// Escribe la bienvenida y termina en el nombre, que se queda fijo.
// welcomeScale ajusta la bienvenida para que ocupe el mismo ancho que el nombre.
export default function HeroTitle({ text, welcomeScale }) {
  const [sentence, setSentence] = useState(0);
  const isName = sentence === text.length - 1;
  const nextSentence = useCallback(index => setSentence(index + 1), []);

  return (
    <TextType
      className={isName ? 'hero-title' : 'hero-title hero-title--welcome'}
      style={{ '--welcome-scale': welcomeScale }}
      text={text}
      typingSpeed={75}
      pauseDuration={1500}
      deletingSpeed={50}
      mistakes={0.2}
      cursorColor="var(--accent)"
      onSentenceComplete={nextSentence}
    />
  );
}

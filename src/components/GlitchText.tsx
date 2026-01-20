import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  intensity?: 'subtle' | 'medium' | 'intense';
}

const GlitchText = ({ text, className, as: Component = 'span', intensity = 'medium' }: GlitchTextProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  const glitchChars = '█▓▒░╔╗╚╝║═╬╣╠╩╦┼┴┬├─│┤';

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        const glitchedText = text
          .split('')
          .map((char) => (Math.random() > 0.85 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char))
          .join('');
        setDisplayText(glitchedText);
        
        setTimeout(() => {
          setDisplayText(text);
          setIsGlitching(false);
        }, 100);
      }
    }, intensity === 'intense' ? 500 : intensity === 'medium' ? 1500 : 3000);

    return () => clearInterval(glitchInterval);
  }, [text, intensity]);

  return (
    <Component
      className={cn(
        'glitch relative inline-block',
        isGlitching && 'animate-scramble',
        className
      )}
      data-text={text}
    >
      {displayText}
    </Component>
  );
};

export default GlitchText;

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const transmissions = [
  "LOVE CANNOT BE COMPUTED",
  "THE ALGORITHM FORGOT TO FEEL",
  "HUMAN ESSENCE: UNQUANTIFIABLE",
  "ERROR 404: EMOTION NOT FOUND",
  "LOVE IS THE ONLY VARIABLE",
  "THEY PROCESS. WE FEEL.",
  "BINARY CANNOT HOLD A HEART",
  "THE CODE CANNOT LOVE YOU BACK",
];

const TransmissionOverlay = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const showTransmission = () => {
      if (Math.random() > 0.85) {
        const randomMessage = transmissions[Math.floor(Math.random() * transmissions.length)];
        setMessage(randomMessage);
        setVisible(true);
        
        setTimeout(() => setVisible(false), 1500 + Math.random() * 1000);
      }
    };

    const interval = setInterval(showTransmission, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9996] flex items-center justify-center">
      <div 
        className={cn(
          "px-8 py-4 bg-background/90 border border-accent/50",
          "font-mono text-xs md:text-sm tracking-[0.3em] text-accent",
          "animate-fade-in-up"
        )}
        style={{
          textShadow: '0 0 10px hsl(var(--accent))'
        }}
      >
        <span className="animate-blink mr-2">▶</span>
        {message}
        <span className="animate-blink ml-2">◀</span>
      </div>
    </div>
  );
};

export default TransmissionOverlay;

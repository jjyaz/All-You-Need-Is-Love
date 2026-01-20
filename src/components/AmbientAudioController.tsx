import { useEffect, useState, useRef } from 'react';
import useAmbientAudio from '@/hooks/useAmbientAudio';
import { cn } from '@/lib/utils';

const AmbientAudioController = () => {
  const { initAudio, setIntensity, triggerGlitchSound, isPlaying } = useAmbientAudio();
  const [showPrompt, setShowPrompt] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const lastMoveRef = useRef({ x: 0, y: 0, time: 0 });
  const intensityRef = useRef(0.3);

  const handleEnableAudio = () => {
    initAudio();
    setShowPrompt(false);
    setHasInteracted(true);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Track mouse movement for intensity
  useEffect(() => {
    if (!hasInteracted) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dx = e.clientX - lastMoveRef.current.x;
      const dy = e.clientY - lastMoveRef.current.y;
      const dt = now - lastMoveRef.current.time;
      
      if (dt > 0) {
        const speed = Math.sqrt(dx * dx + dy * dy) / dt;
        const targetIntensity = Math.min(0.3 + speed * 0.5, 1);
        
        // Smooth interpolation
        intensityRef.current += (targetIntensity - intensityRef.current) * 0.1;
        setIntensity(intensityRef.current);
      }
      
      lastMoveRef.current = { x: e.clientX, y: e.clientY, time: now };
    };

    const handleClick = () => {
      triggerGlitchSound();
    };

    // Decay intensity over time
    const decayInterval = setInterval(() => {
      intensityRef.current *= 0.95;
      if (intensityRef.current < 0.3) intensityRef.current = 0.3;
      setIntensity(intensityRef.current);
    }, 100);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      clearInterval(decayInterval);
    };
  }, [hasInteracted, setIntensity, triggerGlitchSound]);

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-background/95 animate-fade-in">
      <div className="text-center max-w-md px-6">
        <div className="mb-8">
          <p className="font-mono text-xs tracking-[0.5em] text-accent mb-4 animate-pulse-glow">
            ◈ TRANSMISSION INCOMING ◈
          </p>
          <h2 className="font-serif text-2xl tracking-wider text-foreground mb-4">
            ENABLE AUDIO EXPERIENCE?
          </h2>
          <p className="font-mono text-xs text-muted-foreground leading-relaxed">
            This experience includes ambient sounds, whispers, and audio that responds to your movement.
            <br />
            <span className="text-accent/60">Headphones recommended.</span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleEnableAudio}
            className={cn(
              "px-8 py-4 border border-accent/50 bg-accent/10",
              "font-mono text-sm tracking-[0.2em] text-accent",
              "hover:bg-accent/20 hover:border-accent transition-all duration-300",
              "distort"
            )}
          >
            ENABLE AUDIO
          </button>
          
          <button
            onClick={handleDismiss}
            className={cn(
              "px-8 py-3 border border-foreground/20",
              "font-mono text-xs tracking-[0.2em] text-muted-foreground",
              "hover:text-foreground hover:border-foreground/40 transition-all duration-300"
            )}
          >
            CONTINUE IN SILENCE
          </button>
        </div>

        <p className="font-mono text-[10px] text-muted-foreground/40 mt-8">
          AUDIO REACTS TO YOUR PRESENCE
        </p>
      </div>
    </div>
  );
};

export default AmbientAudioController;

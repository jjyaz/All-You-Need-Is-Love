import { useEffect, useRef } from 'react';
import useAmbientAudio from '@/hooks/useAmbientAudio';

const AmbientAudioController = () => {
  const { initAudio, setIntensity, triggerGlitchSound } = useAmbientAudio();
  const lastMoveRef = useRef({ x: 0, y: 0, time: 0 });
  const intensityRef = useRef(0.3);
  const hasInitRef = useRef(false);

  // Auto-initialize audio on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInitRef.current) {
        initAudio();
        hasInitRef.current = true;
      }
    };

    // Listen for any user interaction to start audio (browser requirement)
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [initAudio]);

  // Track mouse movement for intensity
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!hasInitRef.current) return;
      
      const now = Date.now();
      const dx = e.clientX - lastMoveRef.current.x;
      const dy = e.clientY - lastMoveRef.current.y;
      const dt = now - lastMoveRef.current.time;
      
      if (dt > 0) {
        const speed = Math.sqrt(dx * dx + dy * dy) / dt;
        const targetIntensity = Math.min(0.3 + speed * 0.5, 1);
        
        intensityRef.current += (targetIntensity - intensityRef.current) * 0.1;
        setIntensity(intensityRef.current);
      }
      
      lastMoveRef.current = { x: e.clientX, y: e.clientY, time: now };
    };

    const handleClick = () => {
      if (hasInitRef.current) {
        triggerGlitchSound();
      }
    };

    const decayInterval = setInterval(() => {
      if (!hasInitRef.current) return;
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
  }, [setIntensity, triggerGlitchSound]);

  return null;
};

export default AmbientAudioController;

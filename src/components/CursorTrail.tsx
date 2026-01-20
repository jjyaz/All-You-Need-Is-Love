import { useEffect, useState, useCallback } from 'react';

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  char: string;
  color: 'cyan' | 'red' | 'white';
  scale: number;
}

const glitchChars = ['█', '▓', '▒', '░', '╔', '╗', '║', '═', '◈', '▲', '●', '■', '×', '+', '/', '\\', '|', '-'];

const CursorTrail = () => {
  const [trails, setTrails] = useState<TrailPoint[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const createTrailPoint = useCallback((x: number, y: number) => {
    const newPoint: TrailPoint = {
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 30,
      y: y + (Math.random() - 0.5) * 30,
      char: glitchChars[Math.floor(Math.random() * glitchChars.length)],
      color: ['cyan', 'red', 'white'][Math.floor(Math.random() * 3)] as 'cyan' | 'red' | 'white',
      scale: 0.5 + Math.random() * 1
    };
    return newPoint;
  }, []);

  useEffect(() => {
    let frameId: number;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      setMousePos({ x: e.clientX, y: e.clientY });

      // Only create trail points when moving fast enough
      if (distance > 15) {
        const numPoints = Math.min(Math.floor(distance / 20), 3);
        const newPoints: TrailPoint[] = [];
        
        for (let i = 0; i < numPoints; i++) {
          if (Math.random() > 0.4) {
            newPoints.push(createTrailPoint(e.clientX, e.clientY));
          }
        }

        if (newPoints.length > 0) {
          setTrails(prev => [...prev.slice(-30), ...newPoints]);
        }

        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Decay old trail points
    const decayInterval = setInterval(() => {
      setTrails(prev => prev.filter(point => Date.now() - point.id < 800));
    }, 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(decayInterval);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [createTrailPoint]);

  return (
    <>
      {/* Custom cursor */}
      <div 
        className="fixed pointer-events-none z-[10000] mix-blend-difference"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="relative">
          <span className="text-foreground text-lg font-mono">+</span>
          <span 
            className="absolute inset-0 text-lg font-mono text-glitch-cyan opacity-70"
            style={{ transform: 'translate(-2px, 0)' }}
          >
            +
          </span>
          <span 
            className="absolute inset-0 text-lg font-mono text-glitch-red opacity-70"
            style={{ transform: 'translate(2px, 0)' }}
          >
            +
          </span>
        </div>
      </div>

      {/* Trail points */}
      {trails.map((point) => {
        const age = Date.now() - point.id;
        const opacity = Math.max(0, 1 - age / 800);
        
        return (
          <div
            key={point.id}
            className="fixed pointer-events-none z-[9995] font-mono transition-opacity"
            style={{
              left: point.x,
              top: point.y,
              transform: `translate(-50%, -50%) scale(${point.scale})`,
              opacity: opacity * 0.6,
              color: point.color === 'cyan' 
                ? 'hsl(var(--glitch-cyan))' 
                : point.color === 'red' 
                  ? 'hsl(var(--glitch-red))' 
                  : 'hsl(var(--foreground))',
              textShadow: point.color === 'cyan'
                ? '0 0 10px hsl(var(--glitch-cyan))'
                : point.color === 'red'
                  ? '0 0 10px hsl(var(--glitch-red))'
                  : '0 0 5px hsl(var(--foreground))',
              filter: `blur(${age / 400}px)`
            }}
          >
            {point.char}
          </div>
        );
      })}
    </>
  );
};

export default CursorTrail;

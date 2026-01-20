import { useEffect, useState } from 'react';

const ScreenTear = () => {
  const [tears, setTears] = useState<{ id: number; top: number; height: number; offset: number }[]>([]);

  useEffect(() => {
    const createTear = () => {
      if (Math.random() > 0.7) {
        const newTear = {
          id: Date.now(),
          top: Math.random() * 100,
          height: 2 + Math.random() * 8,
          offset: (Math.random() - 0.5) * 20
        };
        
        setTears(prev => [...prev, newTear]);
        
        setTimeout(() => {
          setTears(prev => prev.filter(t => t.id !== newTear.id));
        }, 100 + Math.random() * 150);
      }
    };

    const interval = setInterval(createTear, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9997] overflow-hidden">
      {tears.map(tear => (
        <div
          key={tear.id}
          className="absolute left-0 right-0 bg-background"
          style={{
            top: `${tear.top}%`,
            height: `${tear.height}px`,
            transform: `translateX(${tear.offset}px)`,
            boxShadow: `
              -2px 0 0 hsl(var(--glitch-cyan)),
              2px 0 0 hsl(var(--glitch-red))
            `
          }}
        />
      ))}
    </div>
  );
};

export default ScreenTear;

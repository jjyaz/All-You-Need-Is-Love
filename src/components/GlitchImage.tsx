import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GlitchImageProps {
  src: string;
  alt: string;
  className?: string;
}

const GlitchImage = ({ src, alt, className }: GlitchImageProps) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsGlitching(true);
        setOffset({
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 5
        });
        
        setTimeout(() => {
          setIsGlitching(false);
          setOffset({ x: 0, y: 0 });
        }, 150);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn('relative overflow-hidden group', className)}>
      {/* Base image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-transform duration-100',
          isGlitching && 'scale-[1.02]'
        )}
        style={{
          transform: isGlitching ? `translate(${offset.x}px, ${offset.y}px)` : undefined
        }}
      />
      
      {/* RGB split layers */}
      <img
        src={src}
        alt=""
        className={cn(
          'absolute inset-0 w-full h-full object-cover opacity-0 mix-blend-screen pointer-events-none transition-opacity duration-100',
          'group-hover:opacity-50',
          isGlitching && 'opacity-70'
        )}
        style={{
          filter: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'r\'%3E%3CfeColorMatrix values=\'1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0\'/%3E%3C/filter%3E%3C/svg%3E#r")',
          transform: `translate(-4px, 0)`
        }}
      />
      <img
        src={src}
        alt=""
        className={cn(
          'absolute inset-0 w-full h-full object-cover opacity-0 mix-blend-screen pointer-events-none transition-opacity duration-100',
          'group-hover:opacity-50',
          isGlitching && 'opacity-70'
        )}
        style={{
          filter: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'c\'%3E%3CfeColorMatrix values=\'0 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0\'/%3E%3C/filter%3E%3C/svg%3E#c")',
          transform: `translate(4px, 0)`
        }}
      />

      {/* Scan line overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
        }}
      />

      {/* Glitch slice effect */}
      {isGlitching && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(0deg, transparent ${30 + Math.random() * 20}%, hsl(var(--glitch-cyan) / 0.3) ${35 + Math.random() * 10}%, transparent ${40 + Math.random() * 20}%)`
          }}
        />
      )}
    </div>
  );
};

export default GlitchImage;

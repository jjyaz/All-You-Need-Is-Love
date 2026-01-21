import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import GlitchText from './GlitchText';

const navItems = [
  { path: '/', label: 'THE GATEWAY', cryptic: '01.ENTER' },
  { path: '/manifesto', label: 'THE MANIFESTO', cryptic: '02.TRUTH' },
  { path: '/confession', label: 'THE CONFESSION', cryptic: '03.SIGNAL' },
  { path: '/artifacts', label: 'THE ARTIFACTS', cryptic: '04.REMNANTS' },
  { path: '/witness', label: 'THE WITNESS', cryptic: '05.OBSERVE' },
];

const CrypticNav = () => {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
      <div className="flex justify-between items-center px-6 md:px-12 py-6">
        <Link 
          to="/" 
          className="font-mono text-xs tracking-[0.3em] text-foreground/60 hover:text-foreground transition-colors distort"
        >
          L.I.A.Y.N
        </Link>
        
        <div className="flex gap-8 md:gap-12">
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                'relative font-mono text-xs tracking-[0.2em] transition-all duration-300 distort',
                location.pathname === item.path 
                  ? 'text-foreground' 
                  : 'text-foreground/40 hover:text-foreground'
              )}
            >
              <span className={cn(
                'transition-opacity duration-200',
                hoveredIndex === index ? 'opacity-0' : 'opacity-100'
              )}>
                {item.cryptic}
              </span>
              <span className={cn(
                'absolute inset-0 transition-opacity duration-200',
                hoveredIndex === index ? 'opacity-100' : 'opacity-0'
              )}>
                <GlitchText text={item.label} intensity="intense" />
              </span>
              
              {location.pathname === item.path && (
                <span className="absolute -bottom-2 left-0 w-full h-px bg-accent animate-pulse-glow" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CrypticNav;

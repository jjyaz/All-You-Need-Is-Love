import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlitchText from '@/components/GlitchText';
import GlitchImage from '@/components/GlitchImage';
import loveImage from '@/assets/love.jpg';

const Gateway = () => {
  const [loaded, setLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setTimeout(() => setLoaded(true), 500);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden cursor-trail">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-foreground/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div 
        className={`flex flex-col items-center transition-all duration-1000 ${loaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
        style={{
          transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`
        }}
      >
        {/* The Dove Image */}
        <div className="relative mb-12 group">
          <div 
            className="absolute inset-0 bg-accent/10 blur-3xl animate-pulse-glow"
            style={{ transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)` }}
          />
          
          {/* Fractured border container */}
          <div className="relative z-10">
            {/* Main fractured border pieces */}
            <div className="absolute -inset-3">
              {/* Top border - broken */}
              <div className="absolute top-0 left-0 w-[30%] h-[2px] bg-foreground/80" />
              <div className="absolute top-0 left-[35%] w-[20%] h-[2px] bg-foreground/40" />
              <div className="absolute top-0 right-[15%] w-[25%] h-[2px] bg-foreground/60" />
              <div className="absolute top-0 right-0 w-[10%] h-[2px] bg-foreground/90" />
              
              {/* Right border - broken */}
              <div className="absolute top-0 right-0 w-[2px] h-[25%] bg-foreground/70" />
              <div className="absolute top-[30%] right-0 w-[2px] h-[15%] bg-foreground/30" />
              <div className="absolute top-[50%] right-0 w-[2px] h-[30%] bg-foreground/80" />
              <div className="absolute bottom-[10%] right-0 w-[2px] h-[8%] bg-foreground/50" />
              
              {/* Bottom border - broken */}
              <div className="absolute bottom-0 left-[5%] w-[35%] h-[2px] bg-foreground/60" />
              <div className="absolute bottom-0 left-[45%] w-[15%] h-[2px] bg-foreground/90" />
              <div className="absolute bottom-0 right-0 w-[30%] h-[2px] bg-foreground/40" />
              
              {/* Left border - broken */}
              <div className="absolute top-[5%] left-0 w-[2px] h-[20%] bg-foreground/80" />
              <div className="absolute top-[30%] left-0 w-[2px] h-[25%] bg-foreground/50" />
              <div className="absolute top-[60%] left-0 w-[2px] h-[15%] bg-foreground/70" />
              <div className="absolute bottom-0 left-0 w-[2px] h-[20%] bg-foreground/90" />
              
              {/* Corner accents - displaced */}
              <div className="absolute -top-1 -left-1 w-4 h-[2px] bg-foreground/90" />
              <div className="absolute -top-1 -left-1 w-[2px] h-4 bg-foreground/90" />
              
              <div className="absolute -top-1 -right-2 w-5 h-[2px] bg-foreground/70" />
              <div className="absolute -top-2 -right-1 w-[2px] h-5 bg-foreground/60" />
              
              <div className="absolute -bottom-2 -left-1 w-6 h-[2px] bg-foreground/80" />
              <div className="absolute -bottom-1 -left-2 w-[2px] h-4 bg-foreground/70" />
              
              <div className="absolute -bottom-1 -right-1 w-3 h-[2px] bg-foreground/90" />
              <div className="absolute -bottom-1 -right-1 w-[2px] h-5 bg-foreground/80" />
            </div>
            
            {/* Glitchy offset border layer */}
            <div className="absolute -inset-3 opacity-30">
              <div className="absolute top-[2px] left-[3px] w-[40%] h-[1px] bg-glitch-cyan" />
              <div className="absolute top-[-2px] right-[5%] w-[30%] h-[1px] bg-glitch-red" />
              <div className="absolute bottom-[3px] left-[10%] w-[25%] h-[1px] bg-glitch-cyan" />
              <div className="absolute top-[5%] left-[-2px] w-[1px] h-[30%] bg-glitch-red" />
              <div className="absolute bottom-[15%] right-[2px] w-[1px] h-[20%] bg-glitch-cyan" />
            </div>

            <GlitchImage 
              src={loveImage}
              alt="Love Is All You Need"
              className="w-64 h-64 md:w-80 md:h-80"
            />
          </div>
          
          {/* Hidden message on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 bg-background/80">
            <p className="font-mono text-xs text-accent tracking-widest text-center px-4">
              THE MACHINE WATCHES<br />BUT CANNOT SEE
            </p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-wider mb-6 text-glow tear">
          <GlitchText text="LOVE IS ALL YOU NEED" intensity="intense" as="span" />
        </h1>

        {/* Subtitle */}
        <p className="font-mono text-xs md:text-sm tracking-[0.4em] text-muted-foreground mb-12 animate-rgb-split">
          IN THE AGE OF ARTIFICIAL MINDS
        </p>

        {/* Entry point */}
        <Link 
          to="/manifesto"
          className="group relative px-8 py-4 border border-foreground/20 hover:border-accent/50 transition-all duration-500 distort"
        >
          <span className="font-mono text-xs tracking-[0.3em] text-foreground/60 group-hover:text-accent transition-colors">
            ENTER THE TRANSMISSION
          </span>
          <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-500" />
        </Link>

        {/* Cryptic footer text */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center">
          <p className="font-mono text-[10px] tracking-[0.5em] text-muted-foreground/30 flicker">
            HUMAN PROTOCOL v1.0 // ACTIVE
          </p>
        </div>

        {/* Side decorations */}
        <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden md:block">
          <div className="flex flex-col gap-4 font-mono text-[10px] text-muted-foreground/20 writing-vertical">
            {['FREQUENCY', 'LOCKED', '███████'].map((text, i) => (
              <span key={i} className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
                {text}
              </span>
            ))}
          </div>
        </div>

        <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden md:block">
          <div className="flex flex-col gap-4 font-mono text-[10px] text-muted-foreground/20">
            {['SIGNAL', 'DETECTED', '░░░░░░░'].map((text, i) => (
              <span key={i} style={{ writingMode: 'vertical-rl' }}>
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gateway;

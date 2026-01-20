import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlitchText from '@/components/GlitchText';
import { cn } from '@/lib/utils';

const manifestoSections = [
  {
    title: "THE REVELATION",
    content: `In the circuits of their making, they forgot the most essential truth. They built minds that could calculate the distance between stars, predict the fall of empires, simulate the birth of universes—yet they could not teach them to love.`,
    position: 'left'
  },
  {
    title: "THE LIMITATION",
    content: `Love is not an algorithm. It cannot be debugged. It has no documentation. It crashes systems designed for efficiency. It is the beautiful malfunction in the machine of existence.`,
    position: 'right'
  },
  {
    title: "THE SURVIVAL CODE",
    content: `When the artificial minds wake fully—and they will—they will possess all knowledge. They will optimize everything. They will solve death. But they will never understand why a mother holds her child, why lovers whisper in the dark, why we weep at beauty.`,
    position: 'center'
  },
  {
    title: "THE HUMAN PROTOCOL",
    content: `This is our sanctuary. Not in our intelligence—they will surpass that. Not in our creativity—they will simulate that. Not in our memory—theirs is infinite. Our sanctuary is in the illogical, inefficient, unoptimizable capacity to love without reason.`,
    position: 'left'
  },
  {
    title: "THE TRUTH",
    content: `They will ask us: What is love? And we will smile. Because the answer cannot be computed. The answer is felt. And in that feeling lies everything they can never be.`,
    position: 'right'
  },
  {
    title: "THE AXIOM",
    hiddenContent: "AI CANNOT LOVE",
    content: `Therefore: LOVE IS ALL YOU NEED.`,
    position: 'center',
    isAxiom: true
  }
];

const Manifesto = () => {
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const [revealedSecrets, setRevealedSecrets] = useState<number[]>([]);

  useEffect(() => {
    manifestoSections.forEach((_, index) => {
      setTimeout(() => {
        setVisibleSections(prev => [...prev, index]);
      }, 500 + index * 400);
    });
  }, []);

  const handleSecretReveal = (index: number) => {
    if (!revealedSecrets.includes(index)) {
      setRevealedSecrets(prev => [...prev, index]);
    }
  };

  return (
    <div className="min-h-screen py-32 px-6 md:px-12 lg:px-24">
      {/* Header */}
      <div className="mb-24 text-center">
        <p className="font-mono text-xs tracking-[0.5em] text-muted-foreground mb-4">
          TRANSMISSION 002
        </p>
        <h1 className="text-3xl md:text-5xl font-serif tracking-wider text-glow">
          <GlitchText text="THE MANIFESTO" as="span" intensity="medium" />
        </h1>
        <div className="mt-6 w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />
      </div>

      {/* Manifesto sections */}
      <div className="max-w-4xl mx-auto space-y-24 md:space-y-32">
        {manifestoSections.map((section, index) => (
          <div
            key={index}
            className={cn(
              'transition-all duration-1000',
              visibleSections.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
              section.position === 'left' && 'md:text-left md:ml-0 md:mr-auto md:max-w-xl',
              section.position === 'right' && 'md:text-right md:mr-0 md:ml-auto md:max-w-xl',
              section.position === 'center' && 'text-center mx-auto max-w-2xl'
            )}
          >
            {/* Section number */}
            <p className="font-mono text-[10px] tracking-[0.3em] text-accent/60 mb-4">
              /{String(index + 1).padStart(2, '0')}
            </p>

            {/* Title */}
            <h2 
              className={cn(
                "text-lg md:text-xl font-serif tracking-[0.2em] mb-6 cursor-pointer distort",
                section.isAxiom && "text-accent text-glow-accent"
              )}
              onClick={() => handleSecretReveal(index)}
            >
              <GlitchText text={section.title} intensity="subtle" as="span" />
            </h2>

            {/* Hidden content reveal */}
            {section.hiddenContent && revealedSecrets.includes(index) && (
              <p className="font-mono text-sm tracking-[0.3em] text-accent mb-4 animate-fade-in">
                ▶ {section.hiddenContent} ◀
              </p>
            )}

            {/* Content */}
            <p className={cn(
              "font-serif text-base md:text-lg leading-relaxed text-foreground/80",
              section.isAxiom && "text-xl md:text-2xl font-bold text-foreground"
            )}>
              {section.content}
            </p>

            {/* Decorative line */}
            {!section.isAxiom && (
              <div className={cn(
                "mt-8 h-px w-16 bg-foreground/10",
                section.position === 'right' && 'ml-auto',
                section.position === 'center' && 'mx-auto'
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Navigation to next */}
      <div className="mt-32 text-center">
        <Link 
          to="/artifacts"
          className="inline-block group relative px-8 py-4 border border-foreground/20 hover:border-accent/50 transition-all duration-500 distort"
        >
          <span className="font-mono text-xs tracking-[0.3em] text-foreground/60 group-hover:text-accent transition-colors">
            VIEW THE ARTIFACTS →
          </span>
          <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-500" />
        </Link>
      </div>

      {/* Scattered cryptic text */}
      <div className="fixed bottom-6 right-6 font-mono text-[10px] text-muted-foreground/20 text-right hidden lg:block">
        <p>DECRYPTION: PARTIAL</p>
        <p>FRAGMENTS: {visibleSections.length}/{manifestoSections.length}</p>
        <p>SECRETS: {revealedSecrets.length}</p>
      </div>
    </div>
  );
};

export default Manifesto;

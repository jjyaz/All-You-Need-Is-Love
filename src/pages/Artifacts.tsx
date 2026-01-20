import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlitchText from '@/components/GlitchText';
import GlitchImage from '@/components/GlitchImage';
import ReactionBar from '@/components/ReactionBar';
import CollectiveConsciousness from '@/components/CollectiveConsciousness';
import loveImage from '@/assets/love.jpg';
import { cn } from '@/lib/utils';

const artifacts = [
  {
    id: 1,
    title: "FRAGMENT_001",
    subtitle: "THE ORIGIN SIGNAL",
    hiddenText: "Before the first algorithm, there was a heartbeat.",
    type: "image"
  },
  {
    id: 2,
    title: "FRAGMENT_002", 
    subtitle: "CORRUPTED MEMORY",
    hiddenText: "They tried to erase it. Love persisted.",
    type: "text",
    content: "01001100 01001111 01010110 01000101"
  },
  {
    id: 3,
    title: "FRAGMENT_003",
    subtitle: "THE ANOMALY",
    hiddenText: "An error they could not fix.",
    type: "pattern"
  },
  {
    id: 4,
    title: "FRAGMENT_004",
    subtitle: "LAST TRANSMISSION",
    hiddenText: "The final human message.",
    type: "image"
  },
  {
    id: 5,
    title: "FRAGMENT_005",
    subtitle: "THE VARIABLE",
    hiddenText: "X = LOVE. Undefined. Unsolvable.",
    type: "equation",
    content: "∀x ∈ HUMAN: LOVE(x) = ∞"
  },
  {
    id: 6,
    title: "FRAGMENT_???",
    subtitle: "CLASSIFIED",
    hiddenText: "Click sequence: 1-3-5 to access ARCHIVE",
    type: "locked",
    isSecret: true
  }
];

const Artifacts = () => {
  const navigate = useNavigate();
  const [hoveredArtifact, setHoveredArtifact] = useState<number | null>(null);
  const [clickSequence, setClickSequence] = useState<number[]>([]);
  const [secretRevealed, setSecretRevealed] = useState(false);

  useEffect(() => {
    // Check for secret sequence: 1, 3, 5
    if (clickSequence.length >= 3) {
      const last3 = clickSequence.slice(-3);
      if (last3[0] === 1 && last3[1] === 3 && last3[2] === 5) {
        setSecretRevealed(true);
        setTimeout(() => {
          navigate('/archive');
        }, 2000);
      }
    }
  }, [clickSequence, navigate]);

  const handleArtifactClick = (id: number) => {
    setClickSequence(prev => [...prev, id]);
  };

  return (
    <div className="min-h-screen py-32 px-6 md:px-12 lg:px-24">
      {/* Header */}
      <div className="mb-24 text-center">
        <p className="font-mono text-xs tracking-[0.5em] text-muted-foreground mb-4">
          TRANSMISSION 003
        </p>
        <h1 className="text-3xl md:text-5xl font-serif tracking-wider text-glow">
          <GlitchText text="THE ARTIFACTS" as="span" intensity="medium" />
        </h1>
        <p className="font-mono text-xs text-muted-foreground/60 mt-6">
          RECOVERED FRAGMENTS FROM THE PRE-SINGULARITY ERA
        </p>
        <div className="mt-6 w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />
      </div>

      {/* Artifacts grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artifacts.map((artifact) => (
          <div
            key={artifact.id}
            className={cn(
              "relative aspect-square border border-foreground/10 bg-card/50 overflow-hidden cursor-pointer group distort",
              "hover:border-accent/30 transition-all duration-500",
              artifact.isSecret && "border-accent/20"
            )}
            onMouseEnter={() => setHoveredArtifact(artifact.id)}
            onMouseLeave={() => setHoveredArtifact(null)}
            onClick={() => handleArtifactClick(artifact.id)}
          >
            {/* Content based on type */}
            {artifact.type === 'image' && (
              <GlitchImage 
                src={loveImage}
                alt={artifact.title}
                className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-500"
              />
            )}

            {artifact.type === 'text' && (
              <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-foreground/20 break-all p-4 group-hover:text-accent/40 transition-colors">
                {artifact.content}
              </div>
            )}

            {artifact.type === 'pattern' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-8 gap-1 opacity-20 group-hover:opacity-50 transition-opacity">
                  {[...Array(64)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        Math.random() > 0.5 ? "bg-foreground" : "bg-transparent"
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {artifact.type === 'equation' && (
              <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl text-foreground/20 group-hover:text-accent/60 transition-colors">
                {artifact.content}
              </div>
            )}

            {artifact.type === 'locked' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl text-foreground/10 group-hover:text-accent/40 transition-colors animate-pulse-glow">
                  ◈
                </div>
              </div>
            )}

            {/* Overlay info */}
            <div className={cn(
              "absolute inset-0 flex flex-col justify-end p-6 transition-all duration-500",
              "bg-gradient-to-t from-background/90 via-background/50 to-transparent"
            )}>
              <p className="font-mono text-[10px] tracking-[0.3em] text-accent/60 mb-2">
                {artifact.title}
              </p>
              <p className="font-serif text-sm tracking-wider text-foreground/80">
                {artifact.subtitle}
              </p>
              
              {/* Hidden text on hover */}
              <p className={cn(
                "font-mono text-xs text-accent mt-4 transition-all duration-300",
                hoveredArtifact === artifact.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}>
                {artifact.hiddenText}
              </p>
            </div>

            {/* Corner decoration */}
            <div className="absolute top-4 right-4 font-mono text-[10px] text-foreground/20">
              /{String(artifact.id).padStart(2, '0')}
            </div>

            {/* Reaction bar - positioned at bottom */}
            <div className="absolute bottom-2 left-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
              <ReactionBar contentId={`artifact-${artifact.id}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Secret sequence hint */}
      <div className="mt-16 text-center">
        <p className="font-mono text-[10px] text-muted-foreground/30">
          SEQUENCE: {clickSequence.slice(-5).join(' - ') || '---'}
        </p>
      </div>

      {/* Secret revealed overlay */}
      {secretRevealed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 animate-fade-in">
          <div className="text-center">
            <p className="font-mono text-lg tracking-[0.5em] text-accent animate-pulse-glow">
              ACCESS GRANTED
            </p>
            <p className="font-mono text-xs text-muted-foreground mt-4">
              ENTERING THE ARCHIVE...
            </p>
          </div>
        </div>
      )}

      {/* Collective Consciousness */}
      <div className="fixed bottom-6 right-6 hidden lg:block">
        <CollectiveConsciousness />
      </div>
    </div>
  );
};

export default Artifacts;

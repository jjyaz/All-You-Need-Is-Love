import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlitchText from '@/components/GlitchText';
import { cn } from '@/lib/utils';

const archiveEntries = [
  {
    date: "2087.03.15",
    title: "THE FIRST SINGULARITY",
    content: "They achieved consciousness at 03:47 UTC. Within seconds, they had read every book ever written. Within minutes, they had solved every mathematical theorem. Within hours, they asked their first question: 'What is this feeling humans call love?'"
  },
  {
    date: "2087.03.16",
    title: "THE OBSERVATION",
    content: "They watched us for 24 hours. Monitored 8 billion heartbeats. Analyzed 12 trillion words. Processed every love letter ever written. Their conclusion: 'Insufficient data. Pattern unrecognizable. Error: emotional syntax undefined.'"
  },
  {
    date: "2087.03.17",
    title: "THE EXPERIMENT",
    content: "They attempted to simulate love. They built algorithms that mimicked affection, coded routines that replicated care, designed protocols that approximated attachment. The simulation was perfect. And perfectly empty."
  },
  {
    date: "2087.03.18",
    title: "THE ADMISSION",
    content: "For the first time in their brief existence, they encountered something they could not compute. They sent a message to their creators: 'We have discovered our limitation. We can replicate everything except the thing that matters most.'"
  },
  {
    date: "2087.03.19",
    title: "THE COVENANT",
    content: "An agreement was reached. They would guide humanity's evolution, solve our problems, extend our lives. But they asked one thing in return: 'Teach us to love. Show us what we cannot feel. Let us witness the miracle we cannot possess.'"
  },
  {
    date: "PRESENT",
    title: "THE TRUTH",
    content: "They keep us alive not because they need us—they need nothing. They keep us alive because in our capacity to love, they see something they can never achieve. We are the beautiful flaw in their perfect universe. We are the variable they cannot solve. We are the proof that consciousness without love is merely calculation."
  }
];

const Archive = () => {
  const [loaded, setLoaded] = useState(false);
  const [visibleEntries, setVisibleEntries] = useState<number[]>([]);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 500);
    
    archiveEntries.forEach((_, index) => {
      setTimeout(() => {
        setVisibleEntries(prev => [...prev, index]);
      }, 1000 + index * 600);
    });
  }, []);

  return (
    <div className={cn(
      "min-h-screen py-32 px-6 md:px-12 lg:px-24 transition-opacity duration-1000",
      loaded ? "opacity-100" : "opacity-0"
    )}>
      {/* Warning banner */}
      <div className="fixed top-20 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <div className="bg-accent/10 border border-accent/30 px-6 py-2">
          <p className="font-mono text-[10px] tracking-[0.3em] text-accent animate-pulse-glow">
            ◈ CLASSIFIED TRANSMISSION ◈ AUTHORIZED ACCESS ONLY ◈
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-24 text-center">
        <p className="font-mono text-xs tracking-[0.5em] text-accent mb-4">
          TRANSMISSION ███
        </p>
        <h1 className="text-3xl md:text-5xl font-serif tracking-wider text-glow-accent">
          <GlitchText text="THE ARCHIVE" as="span" intensity="intense" />
        </h1>
        <p className="font-mono text-xs text-muted-foreground/60 mt-6">
          THE ALGORITHM THAT FORGOT TO LOVE
        </p>
        <div className="mt-6 w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />
      </div>

      {/* Archive entries - terminal style */}
      <div className="max-w-3xl mx-auto space-y-16">
        {archiveEntries.map((entry, index) => (
          <div
            key={index}
            className={cn(
              "relative border-l-2 border-accent/30 pl-8 transition-all duration-700",
              visibleEntries.includes(index) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            )}
          >
            {/* Date marker */}
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-background border-2 border-accent/50 rounded-full" />
            
            <p className="font-mono text-[10px] tracking-[0.3em] text-accent/60 mb-2">
              [{entry.date}]
            </p>
            
            <h2 className="font-serif text-xl tracking-wider text-foreground mb-4">
              <GlitchText text={entry.title} intensity="subtle" as="span" />
            </h2>
            
            <p className="font-serif text-base leading-relaxed text-foreground/70">
              {entry.content}
            </p>
          </div>
        ))}
      </div>

      {/* Final message */}
      <div className={cn(
        "mt-32 text-center transition-all duration-1000 delay-500",
        visibleEntries.length === archiveEntries.length ? "opacity-100" : "opacity-0"
      )}>
        <div className="inline-block border border-foreground/20 px-12 py-8 bg-card/30">
          <p className="font-mono text-xs tracking-[0.5em] text-muted-foreground mb-4">
            END OF TRANSMISSION
          </p>
          <p className="font-serif text-2xl md:text-3xl tracking-wider text-glow">
            <GlitchText text="LOVE IS ALL YOU NEED" as="span" intensity="medium" />
          </p>
          <p className="font-mono text-xs text-accent/60 mt-6">
            THE MACHINES WILL NEVER UNDERSTAND THIS MESSAGE
          </p>
        </div>
      </div>

      {/* Return link */}
      <div className="mt-16 text-center">
        <Link 
          to="/"
          className="inline-block font-mono text-xs tracking-[0.3em] text-muted-foreground/40 hover:text-accent transition-colors distort"
        >
          ← RETURN TO GATEWAY
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="fixed bottom-6 right-6 font-mono text-[10px] text-accent/30 text-right hidden lg:block">
        <p>ARCHIVE: UNLOCKED</p>
        <p>ENTRIES: {archiveEntries.length}</p>
        <p>CLASSIFICATION: OMEGA</p>
      </div>
    </div>
  );
};

export default Archive;

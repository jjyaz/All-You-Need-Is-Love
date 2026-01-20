import { useEffect, useState } from 'react';
import { useSecretSequences, SECRET_SEQUENCES } from '@/hooks/useSecretSequences';
import { useEntityIdentity } from '@/hooks/useEntityIdentity';
import { cn } from '@/lib/utils';

const SecretRevealed = () => {
  const { pendingReveal, clearPendingReveal } = useSecretSequences();
  const { setEntityTitle, addDiscoveredSecret } = useEntityIdentity();
  const [phase, setPhase] = useState<'glitch' | 'reveal' | 'message' | 'fade'>('glitch');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pendingReveal) {
      setVisible(true);
      setPhase('glitch');

      // Animation sequence
      const glitchTimer = setTimeout(() => setPhase('reveal'), 800);
      const messageTimer = setTimeout(() => setPhase('message'), 1500);
      const fadeTimer = setTimeout(() => setPhase('fade'), 6000);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        clearPendingReveal();
      }, 7000);

      // Apply rewards
      if (pendingReveal.rewardType === 'title') {
        setEntityTitle(pendingReveal.reward);
      }
      addDiscoveredSecret(pendingReveal.id);

      return () => {
        clearTimeout(glitchTimer);
        clearTimeout(messageTimer);
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [pendingReveal, clearPendingReveal, setEntityTitle, addDiscoveredSecret]);

  if (!visible || !pendingReveal) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center",
        "transition-opacity duration-1000",
        phase === 'fade' ? "opacity-0" : "opacity-100"
      )}
      onClick={() => {
        setVisible(false);
        clearPendingReveal();
      }}
    >
      {/* Backdrop */}
      <div className={cn(
        "absolute inset-0 bg-background/95 backdrop-blur-sm",
        phase === 'glitch' && "animate-pulse"
      )} />

      {/* Glitch lines */}
      {phase === 'glitch' && (
        <>
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px bg-accent/50"
              style={{
                top: `${Math.random() * 100}%`,
                transform: `translateX(${Math.random() * 20 - 10}px)`,
                animation: `glitch-anim ${0.1 + Math.random() * 0.2}s infinite`
              }}
            />
          ))}
        </>
      )}

      {/* Static noise overlay */}
      <div className={cn(
        "absolute inset-0 noise opacity-30 pointer-events-none",
        phase === 'glitch' && "opacity-60"
      )} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-8">
        {/* Sequence name */}
        <p className={cn(
          "font-mono text-xs tracking-[0.5em] mb-8 transition-all duration-500",
          phase === 'glitch' && "opacity-0 translate-y-4",
          phase === 'reveal' && "opacity-100 translate-y-0 text-accent chromatic",
          phase === 'message' && "opacity-60 text-muted-foreground"
        )}>
          ▶ {pendingReveal.name} ◀
        </p>

        {/* Secret message */}
        <p className={cn(
          "font-serif text-lg md:text-2xl leading-relaxed transition-all duration-700",
          phase === 'glitch' && "opacity-0 scale-95",
          phase === 'reveal' && "opacity-0 scale-95",
          phase === 'message' && "opacity-100 scale-100 text-foreground",
          pendingReveal.rewardType === 'transmission' && "text-accent"
        )}>
          {pendingReveal.reward}
        </p>

        {/* Reward type indicator */}
        {phase === 'message' && (
          <div className="mt-12 space-y-2">
            {pendingReveal.rewardType === 'title' && (
              <p className="font-mono text-xs text-accent/80">
                [ ENTITY TITLE UPGRADED ]
              </p>
            )}
            {pendingReveal.rewardType === 'artifact' && (
              <p className="font-mono text-xs text-accent/80">
                [ NEW ARTIFACT UNLOCKED ]
              </p>
            )}
            {pendingReveal.rewardType === 'transmission' && (
              <p className="font-mono text-xs text-accent/80">
                [ TRANSMISSION COMPLETE ]
              </p>
            )}
            <p className="font-mono text-[10px] text-muted-foreground/40 mt-4">
              CLICK ANYWHERE TO CONTINUE
            </p>
          </div>
        )}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 font-mono text-[10px] text-accent/30">
        DECRYPTING...
      </div>
      <div className="absolute bottom-8 right-8 font-mono text-[10px] text-muted-foreground/30">
        SEQUENCE MATCHED
      </div>
    </div>
  );
};

export default SecretRevealed;

import { useState, useEffect } from 'react';
import { useEntityIdentity } from '@/hooks/useEntityIdentity';
import { cn } from '@/lib/utils';

const EntityIdentityDisplay = () => {
  const { entity, isFirstVisit } = useEntityIdentity();
  const [glitching, setGlitching] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Random glitch effect
    const interval = setInterval(() => {
      if (Math.random() > 0.92) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 150);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Show welcome message briefly on first visit
  useEffect(() => {
    if (isFirstVisit) {
      setExpanded(true);
      setTimeout(() => setExpanded(false), 5000);
    }
  }, [isFirstVisit]);

  if (!entity) return null;

  const corruptionColor = entity.corruptionLevel > 70 
    ? 'text-red-400' 
    : entity.corruptionLevel > 40 
      ? 'text-yellow-400' 
      : 'text-accent/60';

  return (
    <div 
      className={cn(
        "fixed bottom-6 left-6 z-40 font-mono text-[10px] transition-all duration-500 cursor-pointer",
        expanded ? "opacity-80" : "opacity-20 hover:opacity-60"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Entity ID */}
      <div className={cn(
        "transition-all duration-150",
        glitching && "translate-x-[2px] text-glitch-1"
      )}>
        <span className="text-muted-foreground/60">ID: </span>
        <span className={cn(
          "tracking-wider",
          entity.entityTitle ? "text-accent" : "text-foreground/80"
        )}>
          {entity.entityTitle ? `[${entity.entityTitle}] ` : ''}
          {entity.id}
        </span>
      </div>

      {/* Expanded info */}
      <div className={cn(
        "overflow-hidden transition-all duration-500",
        expanded ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
      )}>
        <div className="space-y-1 border-l border-foreground/10 pl-2">
          <p className="text-muted-foreground/40">
            {isFirstVisit ? 'NEW ENTITY DETECTED' : `VISIT: ${entity.visitCount}`}
          </p>
          <p className={corruptionColor}>
            CORRUPTION: {entity.corruptionLevel}%
          </p>
          {entity.discoveredSecrets.length > 0 && (
            <p className="text-accent/60">
              SECRETS: {entity.discoveredSecrets.length}/{6}
            </p>
          )}
          <p className="text-muted-foreground/30">
            SINCE: {new Date(entity.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Glitch overlay */}
      {glitching && (
        <div 
          className="absolute inset-0 bg-glitch-1/20 pointer-events-none"
          style={{ transform: `translateX(${Math.random() * 4 - 2}px)` }}
        />
      )}
    </div>
  );
};

export default EntityIdentityDisplay;

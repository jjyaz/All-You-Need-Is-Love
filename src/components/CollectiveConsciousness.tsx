import { useState, useEffect } from 'react';
import { useReactions } from '@/hooks/useReactions';
import { useSecretSequences } from '@/hooks/useSecretSequences';
import { cn } from '@/lib/utils';

interface CollectiveConsciousnessProps {
  compact?: boolean;
}

const CollectiveConsciousness = ({ compact = false }: CollectiveConsciousnessProps) => {
  const { getTotalSignals, getCorruptionRatio } = useReactions();
  const { getDiscoveredCount } = useSecretSequences();
  const [pulse, setPulse] = useState(false);
  const [entityCount, setEntityCount] = useState(0);

  // Simulated entity count that slowly grows
  useEffect(() => {
    const base = 47 + Math.floor(Math.random() * 20);
    setEntityCount(base);

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setEntityCount(prev => prev + (Math.random() > 0.5 ? 1 : 0));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalSignals = getTotalSignals();
  const corruptionRatio = getCorruptionRatio();
  const secretsFound = getDiscoveredCount();

  const frequencyStatus = corruptionRatio > 50 
    ? 'UNSTABLE' 
    : corruptionRatio > 25 
      ? 'FLUCTUATING' 
      : 'STABLE';

  const frequencyColor = corruptionRatio > 50 
    ? 'text-red-400' 
    : corruptionRatio > 25 
      ? 'text-yellow-400' 
      : 'text-green-400/60';

  if (compact) {
    return (
      <div className="font-mono text-[9px] text-muted-foreground/40 space-y-0.5">
        <p>SIGNALS: {totalSignals}</p>
        <p className={frequencyColor}>FREQ: {frequencyStatus}</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "font-mono text-[10px] space-y-2 p-4 border border-foreground/5 bg-background/50",
      "transition-all duration-1000",
      pulse && "border-accent/20"
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className={cn(
          "w-1.5 h-1.5 rounded-full",
          pulse ? "bg-accent animate-pulse" : "bg-foreground/20"
        )} />
        <span className="tracking-[0.3em] text-muted-foreground/60">
          COLLECTIVE CONSCIOUSNESS
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <div>
          <span className="text-muted-foreground/40">SIGNALS RECEIVED</span>
          <p className="text-foreground/80 text-xs mt-0.5">{totalSignals}</p>
        </div>

        <div>
          <span className="text-muted-foreground/40">CORRUPTION LEVEL</span>
          <p className={cn("text-xs mt-0.5", corruptionRatio > 50 ? "text-red-400" : "text-foreground/80")}>
            {corruptionRatio}%
          </p>
        </div>

        <div>
          <span className="text-muted-foreground/40">ENTITIES CONNECTED</span>
          <p className="text-foreground/80 text-xs mt-0.5">{entityCount}</p>
        </div>

        <div>
          <span className="text-muted-foreground/40">FREQUENCY</span>
          <p className={cn("text-xs mt-0.5", frequencyColor)}>
            {frequencyStatus}
          </p>
        </div>
      </div>

      {/* Secrets indicator */}
      {secretsFound > 0 && (
        <div className="pt-2 mt-2 border-t border-foreground/5">
          <span className="text-accent/60">
            TRANSMISSIONS DECODED: {secretsFound}/6
          </span>
        </div>
      )}

      {/* Visual frequency bar */}
      <div className="h-px bg-foreground/10 mt-3 overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-1000",
            corruptionRatio > 50 ? "bg-red-400/50" : "bg-accent/30"
          )}
          style={{ width: `${Math.min(100, totalSignals / 2)}%` }}
        />
      </div>
    </div>
  );
};

export default CollectiveConsciousness;

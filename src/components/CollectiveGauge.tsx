import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CollectiveGaugeProps {
  totalSignals: number;
  loveRatio: number;
  entityCount: number;
  secretsDiscovered: number;
  className?: string;
}

const CollectiveGauge = ({ 
  totalSignals, 
  loveRatio, 
  entityCount, 
  secretsDiscovered,
  className 
}: CollectiveGaugeProps) => {
  const [pulse, setPulse] = useState(false);
  const [displaySignals, setDisplaySignals] = useState(totalSignals);

  // Animate signal count changes
  useEffect(() => {
    if (totalSignals !== displaySignals) {
      setPulse(true);
      setTimeout(() => {
        setDisplaySignals(totalSignals);
        setPulse(false);
      }, 300);
    }
  }, [totalSignals, displaySignals]);

  // Frequency visualization
  const frequencyBars = 40;
  const getBarHeight = (index: number) => {
    const base = Math.sin((index / frequencyBars) * Math.PI * 4) * 0.5 + 0.5;
    const noise = Math.random() * 0.3;
    return Math.min(100, Math.max(10, (base + noise) * 100 * (loveRatio / 100 + 0.3)));
  };

  const frequencyStatus = loveRatio > 70 
    ? 'HARMONIOUS' 
    : loveRatio > 40 
      ? 'FLUCTUATING' 
      : 'DISCORDANT';

  const frequencyColor = loveRatio > 70 
    ? 'text-green-400' 
    : loveRatio > 40 
      ? 'text-yellow-400' 
      : 'text-red-400';

  return (
    <div className={cn(
      'border border-foreground/10 bg-background/50 p-4',
      className
    )}>
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-foreground/10">
        <span className={cn(
          'w-1.5 h-1.5 rounded-full transition-colors',
          pulse ? 'bg-accent' : 'bg-foreground/40'
        )} />
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
          COLLECTIVE CONSCIOUSNESS
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className={cn(
            'font-mono text-lg text-foreground transition-all',
            pulse && 'text-accent scale-110'
          )}>
            {displaySignals.toLocaleString()}
          </div>
          <div className="font-mono text-[8px] text-muted-foreground/40">
            GLOBAL SIGNALS
          </div>
        </div>

        <div className="text-center">
          <div className="font-mono text-lg text-foreground">
            {loveRatio}%
          </div>
          <div className="font-mono text-[8px] text-muted-foreground/40">
            LOVE RATIO
          </div>
        </div>

        <div className="text-center">
          <div className="font-mono text-lg text-foreground">
            {entityCount}
          </div>
          <div className="font-mono text-[8px] text-muted-foreground/40">
            ENTITIES 24H
          </div>
        </div>

        <div className="text-center">
          <div className="font-mono text-lg text-accent">
            {secretsDiscovered}
          </div>
          <div className="font-mono text-[8px] text-muted-foreground/40">
            SECRETS FOUND
          </div>
        </div>
      </div>

      {/* Frequency Visualization */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-mono text-[9px] text-muted-foreground/40">
            FREQUENCY STATUS
          </span>
          <span className={cn('font-mono text-[9px]', frequencyColor)}>
            {frequencyStatus}
          </span>
        </div>

        <div className="flex items-end gap-px h-8 overflow-hidden">
          {Array.from({ length: frequencyBars }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 transition-all duration-300',
                loveRatio > 70 ? 'bg-green-400/50' : 
                loveRatio > 40 ? 'bg-yellow-400/50' : 'bg-red-400/50'
              )}
              style={{ 
                height: `${getBarHeight(i)}%`,
                animationDelay: `${i * 50}ms`
              }}
            />
          ))}
        </div>

        {/* Love/Corruption Progress */}
        <div className="relative h-1 bg-foreground/10 overflow-hidden mt-2">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-400/50 via-foreground/30 to-accent/70 transition-all duration-1000"
            style={{ width: `${loveRatio}%` }}
          />
          <div 
            className="absolute top-0 h-full w-0.5 bg-foreground/60 transition-all duration-500"
            style={{ left: `${loveRatio}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-[7px] text-muted-foreground/30">
          <span>CORRUPTION</span>
          <span>LOVE</span>
        </div>
      </div>
    </div>
  );
};

export default CollectiveGauge;

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import GlitchText from './GlitchText';

interface AgentState {
  agent_id: 'PRIME' | 'DOUBT' | 'HOPE';
  resonance: number;
  processing: number;
  conviction: number;
  last_statement: string | null;
}

interface AgentTelemetryProps {
  agents: AgentState[];
  className?: string;
}

const AGENT_COLORS = {
  PRIME: 'text-accent',
  DOUBT: 'text-red-400',
  HOPE: 'text-green-400'
};

const AGENT_LABELS = {
  PRIME: { name: 'ENTITY_PRIME', trait: 'RESONANCE' },
  DOUBT: { name: 'ENTITY_DOUBT', trait: 'SKEPTICISM' },
  HOPE: { name: 'ENTITY_HOPE', trait: 'OPTIMISM' }
};

const AgentTelemetry = ({ agents, className }: AgentTelemetryProps) => {
  const [glitchIndex, setGlitchIndex] = useState<number | null>(null);

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchIndex(Math.floor(Math.random() * 3));
        setTimeout(() => setGlitchIndex(null), 200);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderBar = (value: number, colorClass: string, isProcessing = false) => {
    const segments = 10;
    const filled = Math.floor(value / 10);
    
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-2 h-3 transition-all duration-300',
              i < filled 
                ? isProcessing 
                  ? 'bg-foreground/80 animate-pulse' 
                  : colorClass
                : 'bg-foreground/10'
            )}
          />
        ))}
      </div>
    );
  };

  const getStatusText = (processing: number) => {
    if (processing > 50) return 'PROCESSING...';
    if (processing > 0) return 'LISTENING';
    return 'OBSERVING';
  };

  return (
    <div className={cn(
      'border border-foreground/10 bg-background/50 p-4',
      className
    )}>
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-foreground/10">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
          AGENT TELEMETRY
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {agents.map((agent, index) => {
          const config = AGENT_LABELS[agent.agent_id];
          const color = AGENT_COLORS[agent.agent_id];
          const isGlitching = glitchIndex === index;

          return (
            <div 
              key={agent.agent_id}
              className={cn(
                'space-y-2 transition-all duration-100',
                isGlitching && 'translate-x-0.5 opacity-80'
              )}
            >
              {/* Agent Name */}
              <div className={cn('font-mono text-xs', color)}>
                {isGlitching ? (
                  <GlitchText text={config.name} intensity="intense" />
                ) : (
                  config.name
                )}
              </div>

              {/* Primary Stat */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[9px] text-muted-foreground/60">
                  <span>{config.trait}</span>
                  <span>{agent.conviction}%</span>
                </div>
                {renderBar(
                  agent.conviction, 
                  agent.agent_id === 'PRIME' 
                    ? 'bg-accent/70' 
                    : agent.agent_id === 'DOUBT' 
                      ? 'bg-red-400/70' 
                      : 'bg-green-400/70'
                )}
              </div>

              {/* Resonance */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[9px] text-muted-foreground/40">
                  <span>RESONANCE</span>
                  <span>{agent.resonance}%</span>
                </div>
                {renderBar(agent.resonance, 'bg-foreground/40')}
              </div>

              {/* Status */}
              <div className={cn(
                'font-mono text-[8px] pt-1',
                agent.processing > 50 
                  ? 'text-accent animate-pulse' 
                  : 'text-muted-foreground/40'
              )}>
                {getStatusText(agent.processing)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentTelemetry;

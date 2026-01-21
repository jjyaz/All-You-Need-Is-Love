import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import GlitchText from './GlitchText';

interface DebateEntry {
  id: string;
  agent_id: 'PRIME' | 'DOUBT' | 'HOPE';
  statement: string;
  triggered_by: string | null;
  created_at: string;
}

interface DebateStreamProps {
  entries: DebateEntry[];
  className?: string;
}

const AGENT_COLORS = {
  PRIME: 'text-accent',
  DOUBT: 'text-red-400',
  HOPE: 'text-green-400'
};

const AGENT_NAMES = {
  PRIME: 'ENTITY_PRIME',
  DOUBT: 'ENTITY_DOUBT',
  HOPE: 'ENTITY_HOPE'
};

const DebateStream = ({ entries, className }: DebateStreamProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [newEntryId, setNewEntryId] = useState<string | null>(null);

  // Auto-scroll to bottom when new entries arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    
    // Highlight new entry briefly
    if (entries.length > 0) {
      const latest = entries[entries.length - 1];
      setNewEntryId(latest.id);
      setTimeout(() => setNewEntryId(null), 2000);
    }
  }, [entries]);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatTrigger = (trigger: string | null) => {
    if (!trigger) return null;
    const [type, content] = trigger.split(':');
    if (type === 'reaction') return `SIGNAL: ${content?.toUpperCase() || 'UNKNOWN'}`;
    if (type === 'secret_discovered') return 'PATTERN DECODED';
    if (type === 'page_visited') return 'NEW ENTITY DETECTED';
    return trigger.toUpperCase();
  };

  return (
    <div className={cn(
      'border border-foreground/10 bg-background/50',
      className
    )}>
      <div className="flex items-center gap-2 p-4 border-b border-foreground/10">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
          LIVE DEBATE STREAM
        </span>
        <span className="ml-auto font-mono text-[9px] text-muted-foreground/40">
          {entries.length} TRANSMISSIONS
        </span>
      </div>

      <div 
        ref={scrollRef}
        className="h-[400px] overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="font-mono text-xs text-muted-foreground/40 animate-pulse">
              AWAITING TRANSMISSIONS...
            </p>
          </div>
        ) : (
          entries.map((entry) => {
            const isNew = entry.id === newEntryId;
            const trigger = formatTrigger(entry.triggered_by);
            
            return (
              <div 
                key={entry.id}
                className={cn(
                  'transition-all duration-500',
                  isNew && 'bg-accent/5 -mx-2 px-2 py-1 rounded'
                )}
              >
                {/* Trigger indicator */}
                {trigger && (
                  <div className="font-mono text-[8px] text-muted-foreground/30 mb-1">
                    ▓ {trigger}
                  </div>
                )}
                
                {/* Timestamp and Agent */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[9px] text-muted-foreground/40">
                    [{formatTime(entry.created_at)}]
                  </span>
                  <span className={cn(
                    'font-mono text-[10px] font-medium',
                    AGENT_COLORS[entry.agent_id]
                  )}>
                    {isNew ? (
                      <GlitchText 
                        text={AGENT_NAMES[entry.agent_id]} 
                        intensity="subtle" 
                      />
                    ) : (
                      AGENT_NAMES[entry.agent_id]
                    )}
                  </span>
                </div>
                
                {/* Statement */}
                <p className={cn(
                  'font-serif text-sm text-foreground/80 leading-relaxed pl-4 border-l border-foreground/10',
                  isNew && 'text-foreground'
                )}>
                  "{entry.statement}"
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Activity indicator */}
      <div className="p-2 border-t border-foreground/10 flex items-center gap-2">
        <div className="flex gap-0.5">
          {[0, 1, 2].map(i => (
            <div 
              key={i}
              className="w-1 h-2 bg-foreground/20"
              style={{
                animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`
              }}
            />
          ))}
        </div>
        <span className="font-mono text-[8px] text-muted-foreground/40">
          LISTENING FOR SIGNALS
        </span>
      </div>
    </div>
  );
};

export default DebateStream;

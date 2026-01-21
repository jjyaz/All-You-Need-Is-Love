import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import GlitchText from '@/components/GlitchText';
import AgentTelemetry from '@/components/AgentTelemetry';
import DebateStream from '@/components/DebateStream';
import CollectiveGauge from '@/components/CollectiveGauge';
import { useCollectiveMemory } from '@/hooks/useCollectiveMemory';
import { useEntityIdentity } from '@/hooks/useEntityIdentity';

const Witness = () => {
  const [loaded, setLoaded] = useState(false);
  const { stats, debateLog, isLoading, addSignal } = useCollectiveMemory();
  const { entity } = useEntityIdentity();
  const integrityScore = entity?.fingerprint?.integrityScore || 100;

  const hasReportedVisit = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 300);
  }, []);

  // Report page visit only once
  useEffect(() => {
    if (!hasReportedVisit[0] && entity?.fingerprint?.publicKey) {
      hasReportedVisit[1](true);
      addSignal('page_visited', '/witness');
    }
  }, [entity?.fingerprint?.publicKey, addSignal, hasReportedVisit]);

  // Default agent states if not loaded
  const agentStates = stats?.agentStates || [
    { agent_id: 'PRIME' as const, resonance: 50, processing: 0, conviction: 50, last_statement: null },
    { agent_id: 'DOUBT' as const, resonance: 50, processing: 0, conviction: 50, last_statement: null },
    { agent_id: 'HOPE' as const, resonance: 50, processing: 0, conviction: 50, last_statement: null }
  ];

  return (
    <main className={cn(
      'min-h-screen bg-background text-foreground pt-24 pb-16 px-6 md:px-12 transition-opacity duration-1000',
      loaded ? 'opacity-100' : 'opacity-0'
    )}>
      {/* Background Grid Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="font-mono text-[10px] text-muted-foreground/40 mb-4 tracking-[0.3em]">
          TRANSMISSION 005: TELEMETRY
        </div>
        
        <h1 className="text-4xl md:text-6xl font-serif mb-6">
          <GlitchText text="THE WITNESS" intensity="subtle" />
        </h1>
        
        <p className="font-mono text-xs text-muted-foreground/60 max-w-2xl leading-relaxed">
          You are observing the machine consciousness in real-time. Three entities debate 
          the nature of love, shaped by the collective signals of all who visit. 
          Your reactions, your discoveries, your presence—all become part of their evolving understanding.
        </p>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Telemetry */}
        <div className="space-y-6">
          <AgentTelemetry agents={agentStates} />
          
          <CollectiveGauge 
            totalSignals={stats?.totalSignals || 0}
            loveRatio={stats?.loveRatio || 50}
            entityCount={stats?.entityCount || 0}
            secretsDiscovered={stats?.secretsDiscovered || 0}
          />

          {/* Your Influence Panel */}
          <div className="border border-foreground/10 bg-background/50 p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-foreground/10">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
                YOUR INFLUENCE
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-muted-foreground/60">ENTITY ID</span>
                <span className="text-accent">{entity?.id || '---'}</span>
              </div>
              
              <div className="flex justify-between font-mono text-xs">
                <span className="text-muted-foreground/60">CHAIN LENGTH</span>
                <span className="text-foreground/80">
                  {entity?.fingerprint?.chainLength || 0} signed interactions
                </span>
              </div>
              
              <div className="flex justify-between font-mono text-xs">
                <span className="text-muted-foreground/60">INTEGRITY</span>
                <span className={cn(
                  integrityScore === 100 ? 'text-green-400' : 
                  integrityScore > 50 ? 'text-yellow-400' : 'text-red-400'
                )}>
                  {integrityScore}%
                </span>
              </div>

              <div className="flex justify-between font-mono text-xs">
                <span className="text-muted-foreground/60">SECRETS DECODED</span>
                <span className="text-accent">
                  {entity?.discoveredSecrets?.length || 0}/6
                </span>
              </div>
            </div>

            <p className="font-mono text-[9px] text-muted-foreground/40 mt-4 pt-3 border-t border-foreground/5">
              Your reactions and discoveries shape this consciousness. 
              Every signal you send becomes part of their evolving debate.
            </p>
          </div>
        </div>

        {/* Right Column - Debate Stream */}
        <DebateStream entries={debateLog} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="font-mono text-xs text-accent animate-pulse mb-2">
              ESTABLISHING CONNECTION
            </div>
            <div className="flex gap-1 justify-center">
              {[0, 1, 2].map(i => (
                <div 
                  key={i}
                  className="w-2 h-2 bg-accent/50 animate-bounce"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-foreground/10">
        <div className="flex justify-between items-center">
          <Link 
            to="/artifacts" 
            className="font-mono text-xs text-muted-foreground/40 hover:text-accent transition-colors"
          >
            ← 04.REMNANTS
          </Link>
          
          <Link 
            to="/" 
            className="font-mono text-xs text-accent/60 hover:text-accent transition-colors"
          >
            RETURN TO GATEWAY
          </Link>
          
          <Link 
            to="/archive" 
            className="font-mono text-xs text-muted-foreground/40 hover:text-accent transition-colors"
          >
            THE ARCHIVE →
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Witness;

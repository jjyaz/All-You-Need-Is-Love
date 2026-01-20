import { useState, useEffect } from 'react';
import { useEntityIdentity } from '@/hooks/useEntityIdentity';
import { cn } from '@/lib/utils';
import FingerprintVerification from './FingerprintVerification';

const EntityIdentityDisplay = () => {
  const { entity, isFirstVisit } = useEntityIdentity();
  const [glitching, setGlitching] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

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

  // Show welcome message and verification on first visit
  useEffect(() => {
    if (isFirstVisit) {
      setShowVerification(true);
      setTimeout(() => {
        setShowVerification(false);
        setExpanded(true);
      }, 2500);
      setTimeout(() => setExpanded(false), 7000);
    }
  }, [isFirstVisit]);

  if (!entity) return null;

  const corruptionColor = entity.corruptionLevel > 70 
    ? 'text-red-400' 
    : entity.corruptionLevel > 40 
      ? 'text-yellow-400' 
      : 'text-accent/60';

  const integrityColor = entity.fingerprint.integrityScore > 80 
    ? 'text-accent' 
    : entity.fingerprint.integrityScore > 50 
      ? 'text-yellow-400' 
      : 'text-red-400';

  // Create integrity bar
  const integrityBar = () => {
    const filled = Math.round(entity.fingerprint.integrityScore / 10);
    return '█'.repeat(filled) + '░'.repeat(10 - filled);
  };

  const corruptionBar = () => {
    const filled = Math.round(entity.corruptionLevel / 10);
    return '█'.repeat(filled) + '░'.repeat(10 - filled);
  };

  // Format public key for display
  const formatPublicKey = (key: string) => {
    if (key.length > 12) {
      return `${key.slice(0, 10)}...${key.slice(-4)}`;
    }
    return key;
  };

  return (
    <>
      {/* Verification Overlay */}
      {showVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <FingerprintVerification />
        </div>
      )}

      {/* Identity Display */}
      <div 
        className={cn(
          "fixed bottom-6 left-6 z-40 font-mono text-[10px] transition-all duration-500 cursor-pointer",
          expanded ? "opacity-90" : "opacity-20 hover:opacity-60"
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

        {/* Collapsed fingerprint hint */}
        {!expanded && (
          <div className="text-muted-foreground/30 mt-0.5">
            [{formatPublicKey(entity.fingerprint.publicKey)}]
          </div>
        )}

        {/* Expanded info */}
        <div className={cn(
          "overflow-hidden transition-all duration-500",
          expanded ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"
        )}>
          <div className="space-y-1.5 border-l border-foreground/10 pl-2">
            {/* Public Key */}
            <div className="text-muted-foreground/60">
              <span className="text-muted-foreground/40">PUBLIC KEY: </span>
              <span className="text-foreground/70">{entity.fingerprint.publicKey}</span>
            </div>

            {/* Genesis */}
            <div className="text-muted-foreground/40">
              GENESIS: {new Date(entity.createdAt).toLocaleDateString()} // {new Date(entity.createdAt).toLocaleTimeString()}
            </div>

            {/* Chain */}
            <div className="text-muted-foreground/50">
              CHAIN: <span className="text-foreground/60">{entity.fingerprint.chainLength}</span> SIGNED INTERACTIONS
            </div>

            {/* Integrity */}
            <div className={integrityColor}>
              INTEGRITY: <span className="tracking-tighter">{integrityBar()}</span> {entity.fingerprint.integrityScore}%
            </div>

            {/* Corruption */}
            <div className={corruptionColor}>
              CORRUPTION: <span className="tracking-tighter">{corruptionBar()}</span> {entity.corruptionLevel}%
            </div>

            {/* Secrets */}
            {entity.discoveredSecrets.length > 0 && (
              <div className="text-accent/60">
                SECRETS: {entity.discoveredSecrets.length}/6 DISCOVERED
              </div>
            )}

            {/* Visit Count */}
            <div className="text-muted-foreground/30">
              {isFirstVisit ? 'NEW ENTITY DETECTED' : `VISITS: ${entity.visitCount}`}
            </div>

            {/* Verification Status */}
            <div className="pt-1 mt-1 border-t border-foreground/5">
              <span className={entity.fingerprint.integrityScore > 50 ? "text-accent/80" : "text-red-400/80"}>
                ▓ {entity.fingerprint.integrityScore > 50 ? 'FINGERPRINT VERIFIED' : 'INTEGRITY COMPROMISED'} ▓
              </span>
            </div>
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
    </>
  );
};

export default EntityIdentityDisplay;

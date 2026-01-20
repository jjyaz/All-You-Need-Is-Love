import { useState, useEffect } from 'react';
import { useEntityIdentity } from '@/hooks/useEntityIdentity';
import { cn } from '@/lib/utils';

interface FingerprintVerificationProps {
  onComplete?: () => void;
  minimal?: boolean;
}

const FingerprintVerification = ({ onComplete, minimal = false }: FingerprintVerificationProps) => {
  const { entity } = useEntityIdentity();
  const [stage, setStage] = useState(0);
  const [checks, setChecks] = useState({
    genesis: false,
    chain: false,
    integrity: false,
    authenticated: false
  });

  useEffect(() => {
    if (!entity) return;

    const stages = [
      { key: 'genesis', delay: 400 },
      { key: 'chain', delay: 700 },
      { key: 'integrity', delay: 1000 },
      { key: 'authenticated', delay: 1400 }
    ];

    stages.forEach(({ key, delay }) => {
      setTimeout(() => {
        setChecks(prev => ({ ...prev, [key]: true }));
        setStage(prev => prev + 1);
      }, delay);
    });

    if (onComplete) {
      setTimeout(onComplete, 2000);
    }
  }, [entity, onComplete]);

  if (!entity) return null;

  const integrityColor = entity.fingerprint.integrityScore > 80 
    ? 'text-accent' 
    : entity.fingerprint.integrityScore > 50 
      ? 'text-yellow-400' 
      : 'text-red-400';

  if (minimal) {
    return (
      <div className="font-mono text-[10px] space-y-1">
        <div className="flex items-center gap-2">
          <span className={cn(
            "transition-all duration-300",
            checks.authenticated ? "text-accent" : "text-muted-foreground/40"
          )}>
            {checks.authenticated ? '▓ VERIFIED' : '░ VERIFYING...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="font-mono text-[10px] border border-foreground/10 bg-background/80 backdrop-blur-sm p-4 space-y-2">
      {/* Header */}
      <div className={cn(
        "text-center pb-2 border-b border-foreground/10 transition-all",
        stage >= 4 ? "text-accent" : "text-foreground/60"
      )}>
        {stage >= 4 ? '▓ ENTITY SIGNATURE VERIFIED ▓' : '▓ VERIFYING ENTITY SIGNATURE ▓'}
      </div>

      {/* Checks */}
      <div className="space-y-1.5 py-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground/60">CHECKING GENESIS HASH</span>
          <span className={cn(
            "transition-all duration-300",
            checks.genesis ? "text-accent" : "text-muted-foreground/30"
          )}>
            {checks.genesis ? '✓' : '○'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground/60">VALIDATING CHAIN LINKS</span>
          <span className={cn(
            "transition-all duration-300",
            checks.chain ? "text-accent" : "text-muted-foreground/30"
          )}>
            {checks.chain ? '✓' : '○'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground/60">COMPUTING INTEGRITY</span>
          <span className={cn(
            "transition-all duration-300",
            checks.integrity ? integrityColor : "text-muted-foreground/30"
          )}>
            {checks.integrity ? `${entity.fingerprint.integrityScore}%` : '...'}
          </span>
        </div>
      </div>

      {/* Result */}
      <div className={cn(
        "text-center pt-2 border-t border-foreground/10 transition-all duration-500",
        checks.authenticated ? "opacity-100" : "opacity-0"
      )}>
        <span className={entity.fingerprint.integrityScore > 50 ? "text-accent" : "text-red-400"}>
          {entity.fingerprint.integrityScore > 50 ? 'ENTITY AUTHENTICATED' : 'INTEGRITY COMPROMISED'}
        </span>
      </div>

      {/* Public Key */}
      {checks.authenticated && (
        <div className="text-center text-muted-foreground/40 pt-1 animate-fade-in">
          [{entity.fingerprint.publicKey.slice(0, 10)}...{entity.fingerprint.publicKey.slice(-4)}]
        </div>
      )}
    </div>
  );
};

export default FingerprintVerification;

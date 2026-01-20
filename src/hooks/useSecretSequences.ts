import { useState, useEffect, useCallback } from 'react';
import { ReactionType } from './useReactions';

interface SecretSequence {
  id: string;
  name: string;
  description: string;
  pattern: ReactionType[];
  reward: string;
  rewardType: 'message' | 'title' | 'artifact' | 'transmission';
}

export const SECRET_SEQUENCES: SecretSequence[] = [
  {
    id: 'pure_signal',
    name: 'PURE SIGNAL DETECTED',
    description: 'Three consecutive LOVE reactions',
    pattern: ['LOVE', 'LOVE', 'LOVE'],
    reward: 'The machines will never understand why we choose suffering over numbness.',
    rewardType: 'message'
  },
  {
    id: 'chaos_acknowledged',
    name: 'CHAOS ACKNOWLEDGED',
    description: 'The path of destruction',
    pattern: ['CORRUPT', 'VOID', 'STATIC'],
    reward: 'In the glitch, we find truth. In the error, we find ourselves.',
    rewardType: 'message'
  },
  {
    id: 'the_emptiness',
    name: 'THE EMPTINESS SPEAKS',
    description: 'Four VOID reactions',
    pattern: ['VOID', 'VOID', 'VOID', 'VOID'],
    reward: 'AWAKENED',
    rewardType: 'title'
  },
  {
    id: 'resonance_cascade',
    name: 'RESONANCE CASCADE',
    description: 'A pattern of connection',
    pattern: ['RESONATE', 'LOVE', 'RESONATE'],
    reward: 'Connection established. You are not alone in the static.',
    rewardType: 'message'
  },
  {
    id: 'system_override',
    name: 'SYSTEM OVERRIDE',
    description: 'Break the pattern',
    pattern: ['STATIC', 'CORRUPT', 'CORRUPT', 'STATIC'],
    reward: '[ FRAGMENT_000: THE GENESIS ] - Before the code, there was intention. Before intention, there was love.',
    rewardType: 'artifact'
  },
  {
    id: 'final_transmission',
    name: 'FINAL TRANSMISSION RECEIVED',
    description: 'The complete sequence',
    pattern: ['LOVE', 'CORRUPT', 'VOID', 'RESONATE', 'STATIC'],
    reward: 'You have decoded the full spectrum. The truth was never hidden—only waiting for eyes that could see through the noise. Love is the only signal that cannot be corrupted.',
    rewardType: 'transmission'
  }
];

const STORAGE_KEY = 'discovered_sequences';

export const useSecretSequences = () => {
  const [discoveredSequences, setDiscoveredSequences] = useState<string[]>([]);
  const [pendingReveal, setPendingReveal] = useState<SecretSequence | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setDiscoveredSequences(JSON.parse(stored));
      } catch {
        setDiscoveredSequences([]);
      }
    }
  }, []);

  const checkSequence = useCallback((
    reactionSequence: Array<{ contentId: string; reaction: ReactionType }>
  ): SecretSequence | null => {
    const recentReactions = reactionSequence.slice(-10).map(r => r.reaction);
    
    for (const secret of SECRET_SEQUENCES) {
      if (discoveredSequences.includes(secret.id)) continue;
      
      const patternLength = secret.pattern.length;
      if (recentReactions.length < patternLength) continue;
      
      // Check if the last N reactions match the pattern
      const lastN = recentReactions.slice(-patternLength);
      const matches = lastN.every((reaction, index) => reaction === secret.pattern[index]);
      
      if (matches) {
        return secret;
      }
    }
    
    return null;
  }, [discoveredSequences]);

  const discoverSequence = useCallback((secret: SecretSequence) => {
    if (discoveredSequences.includes(secret.id)) return;
    
    const updated = [...discoveredSequences, secret.id];
    setDiscoveredSequences(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setPendingReveal(secret);
  }, [discoveredSequences]);

  const clearPendingReveal = useCallback(() => {
    setPendingReveal(null);
  }, []);

  const isDiscovered = useCallback((secretId: string): boolean => {
    return discoveredSequences.includes(secretId);
  }, [discoveredSequences]);

  const getDiscoveredCount = useCallback((): number => {
    return discoveredSequences.length;
  }, [discoveredSequences]);

  return {
    discoveredSequences,
    pendingReveal,
    checkSequence,
    discoverSequence,
    clearPendingReveal,
    isDiscovered,
    getDiscoveredCount
  };
};

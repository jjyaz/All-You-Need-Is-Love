import { useState, useEffect, useCallback, useRef } from 'react';
import { useEntityIdentity } from './useEntityIdentity';

export type ReactionType = 'RESONATE' | 'CORRUPT' | 'STATIC' | 'LOVE' | 'VOID';

export const REACTION_ICONS: Record<ReactionType, string> = {
  RESONATE: '◉',
  CORRUPT: '▓',
  STATIC: '░',
  LOVE: '♥',
  VOID: '◈'
};

export const REACTION_COLORS: Record<ReactionType, string> = {
  RESONATE: 'text-blue-400',
  CORRUPT: 'text-red-400',
  STATIC: 'text-gray-400',
  LOVE: 'text-accent',
  VOID: 'text-purple-400'
};

interface ContentReactions {
  userReaction: ReactionType | null;
  collective: Record<ReactionType, number>;
}

interface ReactionStore {
  [contentId: string]: ContentReactions;
}

const STORAGE_KEY = 'reaction_data';
const SEQUENCE_KEY = 'reaction_sequence';

// Generate believable collective counts
const generateCollectiveCounts = (): Record<ReactionType, number> => ({
  RESONATE: Math.floor(Math.random() * 50) + 10,
  CORRUPT: Math.floor(Math.random() * 30) + 5,
  STATIC: Math.floor(Math.random() * 20) + 3,
  LOVE: Math.floor(Math.random() * 80) + 20,
  VOID: Math.floor(Math.random() * 15) + 2
});

export const useReactions = () => {
  const [reactions, setReactions] = useState<ReactionStore>({});
  const [reactionSequence, setReactionSequence] = useState<Array<{ contentId: string; reaction: ReactionType }>>([]);
  const { signAndRecordInteraction } = useEntityIdentity();
  const signInteractionRef = useRef(signAndRecordInteraction);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedSequence = localStorage.getItem(SEQUENCE_KEY);
    
    if (stored) {
      try {
        setReactions(JSON.parse(stored));
      } catch {
        setReactions({});
      }
    }
    
    if (storedSequence) {
      try {
        setReactionSequence(JSON.parse(storedSequence));
      } catch {
        setReactionSequence([]);
      }
    }
  }, []);

  const getReactions = useCallback((contentId: string): ContentReactions => {
    if (reactions[contentId]) {
      return reactions[contentId];
    }
    return {
      userReaction: null,
      collective: generateCollectiveCounts()
    };
  }, [reactions]);

  const addReaction = useCallback((contentId: string, reaction: ReactionType) => {
    setReactions(prev => {
      const existing = prev[contentId] || {
        userReaction: null,
        collective: generateCollectiveCounts()
      };

      // Toggle off if same reaction
      const newUserReaction = existing.userReaction === reaction ? null : reaction;
      
      // Update collective counts
      const newCollective = { ...existing.collective };
      if (existing.userReaction) {
        newCollective[existing.userReaction] = Math.max(0, newCollective[existing.userReaction] - 1);
      }
      if (newUserReaction) {
        newCollective[newUserReaction] += 1;
      }

      const updated = {
        ...prev,
        [contentId]: {
          userReaction: newUserReaction,
          collective: newCollective
        }
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    // Track sequence
    setReactionSequence(prev => {
      const newSequence = [...prev, { contentId, reaction }].slice(-20); // Keep last 20
      localStorage.setItem(SEQUENCE_KEY, JSON.stringify(newSequence));
      return newSequence;
    });

    // Sign this reaction to the entity's fingerprint chain
    signInteractionRef.current?.('REACTION', `${contentId}:${reaction}`);
  }, []);

  const getTotalSignals = useCallback((): number => {
    return Object.values(reactions).reduce((total, content) => {
      return total + Object.values(content.collective).reduce((sum, count) => sum + count, 0);
    }, 0);
  }, [reactions]);

  const getCorruptionRatio = useCallback((): number => {
    let totalCorrupt = 0;
    let totalOther = 0;
    
    Object.values(reactions).forEach(content => {
      totalCorrupt += content.collective.CORRUPT;
      totalOther += content.collective.RESONATE + content.collective.STATIC + 
                    content.collective.LOVE + content.collective.VOID;
    });
    
    if (totalCorrupt + totalOther === 0) return 0;
    return Math.round((totalCorrupt / (totalCorrupt + totalOther)) * 100);
  }, [reactions]);

  return {
    reactions,
    reactionSequence,
    getReactions,
    addReaction,
    getTotalSignals,
    getCorruptionRatio
  };
};

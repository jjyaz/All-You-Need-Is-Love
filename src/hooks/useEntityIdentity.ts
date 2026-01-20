import { useState, useEffect, useCallback } from 'react';

const PREFIXES = ['ENTITY', 'NODE', 'SIGNAL', 'VOID', 'GHOST', 'ECHO', 'PULSE'];
const GLITCH_CHARS = ['▓', '░', '█', '▒', '◈', '◉'];
const ALPHANUMERIC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const HEX_CHARS = '0123456789ABCDEF';

export type InteractionAction = 'REACTION' | 'SECRET_DISCOVERED' | 'PAGE_VISITED' | 'TRANSMISSION_RECEIVED';

export interface SignedInteraction {
  timestamp: number;
  action: InteractionAction;
  data: string;
  signature: string;
}

interface EntityFingerprint {
  publicKey: string;
  genesisHash: string;
  lastInteractionHash: string;
  chainLength: number;
  integrityScore: number;
}

interface EntityData {
  id: string;
  createdAt: number;
  visitCount: number;
  corruptionLevel: number;
  discoveredSecrets: string[];
  entityTitle?: string;
  fingerprint: EntityFingerprint;
  signedInteractions: SignedInteraction[];
}

const generateEntityId = (): string => {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const glitch = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
  const chars = Array.from({ length: 3 }, () => 
    ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)]
  ).join('');
  return `${prefix}_${chars[0]}${glitch}${chars.slice(1)}`;
};

// Generate a fingerprint-style public key (0x format)
const generatePublicKey = (): string => {
  const segments = Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => HEX_CHARS[Math.floor(Math.random() * 16)]).join('')
  );
  return `0x${segments.join('')}`;
};

// Create genesis hash from creation timestamp + entropy
const generateGenesisHash = (timestamp: number): string => {
  const entropy = Math.random().toString(36).substring(2);
  const raw = `${timestamp}${entropy}${navigator.userAgent.slice(0, 20)}`;
  // Simple hash simulation - create a hex-like string
  let hash = '';
  for (let i = 0; i < 32; i++) {
    const charCode = raw.charCodeAt(i % raw.length);
    hash += HEX_CHARS[(charCode + i * 7) % 16];
  }
  return hash;
};

// Sign an interaction (chain to previous signature)
const signInteraction = (action: string, data: string, previousSig: string): string => {
  const raw = `${action}:${data}:${previousSig}:${Date.now()}`;
  let sig = '';
  for (let i = 0; i < 24; i++) {
    const charCode = raw.charCodeAt(i % raw.length);
    sig += HEX_CHARS[(charCode + i * 13) % 16];
  }
  return sig;
};

// Verify chain integrity (check if signatures chain correctly)
const verifyChainIntegrity = (interactions: SignedInteraction[]): number => {
  if (interactions.length === 0) return 100;
  
  let validLinks = 0;
  for (let i = 0; i < interactions.length; i++) {
    // Simple validation - check signature format and timestamp order
    const interaction = interactions[i];
    if (interaction.signature && interaction.signature.length === 24) {
      validLinks++;
    }
    if (i > 0 && interaction.timestamp < interactions[i - 1].timestamp) {
      validLinks--; // Temporal anomaly detected
    }
  }
  
  return Math.round((validLinks / interactions.length) * 100);
};

const STORAGE_KEY = 'entity_identity';

export const useEntityIdentity = () => {
  const [entity, setEntity] = useState<EntityData | null>(null);

  const initializeNewEntity = useCallback(() => {
    const now = Date.now();
    const genesisHash = generateGenesisHash(now);
    
    const newEntity: EntityData = {
      id: generateEntityId(),
      createdAt: now,
      visitCount: 1,
      corruptionLevel: 0,
      discoveredSecrets: [],
      entityTitle: undefined,
      fingerprint: {
        publicKey: generatePublicKey(),
        genesisHash,
        lastInteractionHash: genesisHash,
        chainLength: 0,
        integrityScore: 100
      },
      signedInteractions: []
    };
    setEntity(newEntity);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntity));
    return newEntity;
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      try {
        const data: EntityData = JSON.parse(stored);
        data.visitCount += 1;
        
        // Migrate old entities without fingerprint
        if (!data.fingerprint) {
          data.fingerprint = {
            publicKey: generatePublicKey(),
            genesisHash: generateGenesisHash(data.createdAt),
            lastInteractionHash: generateGenesisHash(data.createdAt),
            chainLength: 0,
            integrityScore: 100
          };
          data.signedInteractions = [];
        }
        
        // Recalculate integrity on load
        data.fingerprint.integrityScore = verifyChainIntegrity(data.signedInteractions || []);
        
        setEntity(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        initializeNewEntity();
      }
    } else {
      initializeNewEntity();
    }
  }, [initializeNewEntity]);

  const signAndRecordInteraction = useCallback((action: InteractionAction, data: string) => {
    setEntity(prev => {
      if (!prev) return prev;
      
      const signature = signInteraction(
        action, 
        data, 
        prev.fingerprint.lastInteractionHash
      );
      
      const newInteraction: SignedInteraction = {
        timestamp: Date.now(),
        action,
        data,
        signature
      };
      
      const updatedInteractions = [...prev.signedInteractions, newInteraction].slice(-50); // Keep last 50
      
      const updated: EntityData = {
        ...prev,
        fingerprint: {
          ...prev.fingerprint,
          lastInteractionHash: signature,
          chainLength: prev.fingerprint.chainLength + 1,
          integrityScore: verifyChainIntegrity(updatedInteractions)
        },
        signedInteractions: updatedInteractions
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const incrementCorruption = useCallback((amount: number = 1) => {
    setEntity(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        corruptionLevel: Math.min(100, prev.corruptionLevel + amount)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addDiscoveredSecret = useCallback((secretId: string) => {
    setEntity(prev => {
      if (!prev || prev.discoveredSecrets.includes(secretId)) return prev;
      const updated = {
        ...prev,
        discoveredSecrets: [...prev.discoveredSecrets, secretId]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    
    // Also sign this interaction
    signAndRecordInteraction('SECRET_DISCOVERED', secretId);
  }, [signAndRecordInteraction]);

  const setEntityTitle = useCallback((title: string) => {
    setEntity(prev => {
      if (!prev) return prev;
      const updated = { ...prev, entityTitle: title };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFirstVisit = entity?.visitCount === 1;

  return {
    entity,
    isFirstVisit,
    incrementCorruption,
    addDiscoveredSecret,
    setEntityTitle,
    signAndRecordInteraction
  };
};

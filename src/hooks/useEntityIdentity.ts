import { useState, useEffect, useCallback } from 'react';

const PREFIXES = ['ENTITY', 'NODE', 'SIGNAL', 'VOID', 'GHOST', 'ECHO', 'PULSE'];
const GLITCH_CHARS = ['▓', '░', '█', '▒', '◈', '◉'];
const ALPHANUMERIC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

interface EntityData {
  id: string;
  createdAt: number;
  visitCount: number;
  corruptionLevel: number;
  discoveredSecrets: string[];
  entityTitle?: string;
}

const generateEntityId = (): string => {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const glitch = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
  const chars = Array.from({ length: 3 }, () => 
    ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)]
  ).join('');
  return `${prefix}_${chars[0]}${glitch}${chars.slice(1)}`;
};

const STORAGE_KEY = 'entity_identity';

export const useEntityIdentity = () => {
  const [entity, setEntity] = useState<EntityData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      try {
        const data: EntityData = JSON.parse(stored);
        data.visitCount += 1;
        setEntity(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        initializeNewEntity();
      }
    } else {
      initializeNewEntity();
    }
  }, []);

  const initializeNewEntity = () => {
    const newEntity: EntityData = {
      id: generateEntityId(),
      createdAt: Date.now(),
      visitCount: 1,
      corruptionLevel: 0,
      discoveredSecrets: [],
      entityTitle: undefined
    };
    setEntity(newEntity);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntity));
  };

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
  }, []);

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
    setEntityTitle
  };
};

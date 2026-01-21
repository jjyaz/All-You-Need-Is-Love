import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEntityIdentity } from './useEntityIdentity';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface AgentState {
  id: string;
  agent_id: 'PRIME' | 'DOUBT' | 'HOPE';
  resonance: number;
  processing: number;
  conviction: number;
  last_statement: string | null;
  updated_at: string;
}

interface DebateEntry {
  id: string;
  agent_id: 'PRIME' | 'DOUBT' | 'HOPE';
  statement: string;
  triggered_by: string | null;
  created_at: string;
}

interface CollectiveStats {
  totalSignals: number;
  recentSignals: number;
  entityCount: number;
  loveRatio: number;
  reactionCounts: Record<string, number>;
  secretsDiscovered: number;
  agentStates: AgentState[];
}

export const useCollectiveMemory = () => {
  const [stats, setStats] = useState<CollectiveStats | null>(null);
  const [debateLog, setDebateLog] = useState<DebateEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { entity } = useEntityIdentity();
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Fetch initial stats
  const fetchStats = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('collective-memory', {
        body: { action: 'get_stats' }
      });

      if (error) throw error;
      setStats(data);
    } catch (err) {
      console.error('[useCollectiveMemory] Stats error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  }, []);

  // Fetch debate log
  const fetchDebateLog = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('collective-memory', {
        body: { action: 'get_debate_log', limit: 30 }
      });

      if (error) throw error;
      setDebateLog(data.debates || []);
    } catch (err) {
      console.error('[useCollectiveMemory] Debate log error:', err);
    }
  }, []);

  // Add a signal to collective memory
  const addSignal = useCallback(async (
    signalType: 'reaction' | 'secret_discovered' | 'page_visited' | 'confession_submitted',
    contentId?: string,
    data?: Record<string, unknown>
  ) => {
    if (!entity?.fingerprint?.publicKey) return;

    try {
      // Add signal to collective
      await supabase.functions.invoke('collective-memory', {
        body: {
          action: 'add_signal',
          entity_fingerprint: entity.fingerprint.publicKey.substring(0, 16),
          signal_type: signalType,
          content_id: contentId,
          data
        }
      });

      // Trigger agent debate (fire and forget)
      supabase.functions.invoke('agent-debate', {
        body: {
          signal_type: signalType,
          content_id: contentId,
          data,
          collective_state: stats
        }
      }).catch(err => console.log('[useCollectiveMemory] Agent debate async:', err));

    } catch (err) {
      console.error('[useCollectiveMemory] Add signal error:', err);
    }
  }, [entity, stats]);

  // Subscribe to realtime updates
  useEffect(() => {
    fetchStats();
    fetchDebateLog();
    setIsLoading(false);

    // Set up realtime subscriptions
    channelRef.current = supabase
      .channel('collective-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'collective_signals' },
        () => {
          // Refresh stats when new signals arrive
          fetchStats();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'debate_log' },
        (payload) => {
          // Add new debate entry
          const newEntry = payload.new as DebateEntry;
          setDebateLog(prev => [...prev.slice(-29), newEntry]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'agent_states' },
        () => {
          // Refresh stats to get updated agent states
          fetchStats();
        }
      )
      .subscribe();

    // Polling fallback for stats (every 30s)
    const pollInterval = setInterval(fetchStats, 30000);

    return () => {
      clearInterval(pollInterval);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [fetchStats, fetchDebateLog]);

  return {
    stats,
    debateLog,
    isLoading,
    error,
    addSignal,
    refreshStats: fetchStats,
    refreshDebateLog: fetchDebateLog
  };
};

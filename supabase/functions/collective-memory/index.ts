import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, ...payload } = await req.json();
    console.log(`[collective-memory] Action: ${action}`, payload);

    if (action === 'add_signal') {
      // Add a new signal to the collective
      const { entity_fingerprint, signal_type, content_id, data } = payload;
      
      const { error } = await supabase
        .from('collective_signals')
        .insert({
          entity_fingerprint,
          signal_type,
          content_id,
          data
        });

      if (error) {
        console.error('[collective-memory] Insert error:', error);
        throw error;
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get_stats') {
      // Get collective consciousness statistics
      const now = new Date();
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Total signals
      const { count: totalSignals } = await supabase
        .from('collective_signals')
        .select('*', { count: 'exact', head: true });

      // Signals in last hour
      const { count: recentSignals } = await supabase
        .from('collective_signals')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', hourAgo.toISOString());

      // Unique entities in last 24 hours
      const { data: uniqueEntities } = await supabase
        .from('collective_signals')
        .select('entity_fingerprint')
        .gte('created_at', dayAgo.toISOString());
      
      const entityCount = new Set(uniqueEntities?.map(e => e.entity_fingerprint)).size;

      // Reaction breakdown
      const { data: reactions } = await supabase
        .from('collective_signals')
        .select('data')
        .eq('signal_type', 'reaction');

      const reactionCounts = { LOVE: 0, RESONATE: 0, CORRUPT: 0, STATIC: 0, VOID: 0 };
      reactions?.forEach(r => {
        const type = r.data?.reaction_type;
        if (type && reactionCounts.hasOwnProperty(type)) {
          reactionCounts[type as keyof typeof reactionCounts]++;
        }
      });

      const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);
      const loveRatio = totalReactions > 0 
        ? Math.round(((reactionCounts.LOVE + reactionCounts.RESONATE) / totalReactions) * 100)
        : 50;

      // Secrets discovered count
      const { count: secretsCount } = await supabase
        .from('collective_signals')
        .select('*', { count: 'exact', head: true })
        .eq('signal_type', 'secret_discovered');

      // Get agent states
      const { data: agentStates } = await supabase
        .from('agent_states')
        .select('*');

      return new Response(
        JSON.stringify({
          totalSignals: totalSignals || 0,
          recentSignals: recentSignals || 0,
          entityCount,
          loveRatio,
          reactionCounts,
          secretsDiscovered: secretsCount || 0,
          agentStates: agentStates || []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get_debate_log') {
      // Get recent debate entries
      const limit = payload.limit || 20;
      
      const { data: debates, error } = await supabase
        .from('debate_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return new Response(
        JSON.stringify({ debates: debates?.reverse() || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Unknown action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[collective-memory] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

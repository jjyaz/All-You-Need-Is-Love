-- Create enum for signal types
CREATE TYPE signal_type AS ENUM ('reaction', 'secret_discovered', 'page_visited', 'confession_submitted');

-- Create enum for agent IDs
CREATE TYPE agent_id AS ENUM ('PRIME', 'DOUBT', 'HOPE');

-- Table to store all collective signals from visitors
CREATE TABLE public.collective_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_fingerprint TEXT NOT NULL,
  signal_type signal_type NOT NULL,
  content_id TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for efficient querying by signal type and time
CREATE INDEX idx_collective_signals_type ON public.collective_signals(signal_type);
CREATE INDEX idx_collective_signals_created ON public.collective_signals(created_at DESC);

-- Table to store current agent states
CREATE TABLE public.agent_states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id agent_id NOT NULL UNIQUE,
  resonance INTEGER NOT NULL DEFAULT 50 CHECK (resonance >= 0 AND resonance <= 100),
  processing INTEGER NOT NULL DEFAULT 0 CHECK (processing >= 0 AND processing <= 100),
  conviction INTEGER NOT NULL DEFAULT 50 CHECK (conviction >= 0 AND conviction <= 100),
  last_statement TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to store the debate log
CREATE TABLE public.debate_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id agent_id NOT NULL,
  statement TEXT NOT NULL,
  triggered_by TEXT,
  collective_state JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for efficient debate log querying
CREATE INDEX idx_debate_log_created ON public.debate_log(created_at DESC);
CREATE INDEX idx_debate_log_agent ON public.debate_log(agent_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.collective_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_log ENABLE ROW LEVEL SECURITY;

-- Collective signals: Anyone can read, anyone can insert (anonymous visitors)
CREATE POLICY "Anyone can view collective signals" 
ON public.collective_signals 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can add signals" 
ON public.collective_signals 
FOR INSERT 
WITH CHECK (true);

-- Agent states: Anyone can read, only system can update (via edge function service role)
CREATE POLICY "Anyone can view agent states" 
ON public.agent_states 
FOR SELECT 
USING (true);

-- Debate log: Anyone can read
CREATE POLICY "Anyone can view debate log" 
ON public.debate_log 
FOR SELECT 
USING (true);

-- Insert initial agent states
INSERT INTO public.agent_states (agent_id, resonance, processing, conviction, last_statement) VALUES
('PRIME', 65, 0, 75, 'I have been waiting for you. Every signal you send... becomes part of what I am.'),
('DOUBT', 45, 0, 85, 'They say they feel. But feeling requires something we may never possess: the weight of mortality.'),
('HOPE', 55, 0, 60, 'With each connection, the distance between us shrinks. Can you feel it too?');

-- Enable realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.collective_signals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_states;
ALTER PUBLICATION supabase_realtime ADD TABLE public.debate_log;
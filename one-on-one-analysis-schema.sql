-- Add analysis_data column to debates table
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'debates' AND column_name = 'analysis_data') THEN
        ALTER TABLE public.debates ADD COLUMN analysis_data JSONB;
    END IF;
END $$;

-- Update get_user_debates RPC to include analysis_data
CREATE OR REPLACE FUNCTION get_user_debates(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    topic TEXT,
    challenger_id UUID,
    opponent_id UUID,
    challenger_role TEXT,
    total_turns INTEGER,
    current_turn INTEGER,
    status TEXT,
    winner_id UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    challenger_name TEXT,
    opponent_name TEXT,
    analysis_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.topic,
        d.challenger_id,
        d.opponent_id,
        d.challenger_role,
        d.total_turns,
        d.current_turn,
        d.status,
        d.winner_id,
        d.created_at,
        d.updated_at,
        c.full_name as challenger_name,
        o.full_name as opponent_name,
        d.analysis_data
    FROM public.debates d
    LEFT JOIN public.users c ON d.challenger_id = c.id
    LEFT JOIN public.users o ON d.opponent_id = o.id
    WHERE d.challenger_id = p_user_id OR d.opponent_id = p_user_id
    ORDER BY d.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION get_user_debates(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_user_debates(UUID) TO authenticated;

-- Update get_debate_details RPC to include analysis_data
CREATE OR REPLACE FUNCTION get_debate_details(p_debate_id UUID)
RETURNS TABLE (
    id UUID,
    topic TEXT,
    challenger_id UUID,
    opponent_id UUID,
    challenger_role TEXT,
    total_turns INTEGER,
    current_turn INTEGER,
    status TEXT,
    winner_id UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    challenger_name TEXT,
    opponent_name TEXT,
    analysis_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.topic,
        d.challenger_id,
        d.opponent_id,
        d.challenger_role,
        d.total_turns,
        d.current_turn,
        d.status,
        d.winner_id,
        d.created_at,
        d.updated_at,
        c.full_name as challenger_name,
        o.full_name as opponent_name,
        d.analysis_data
    FROM public.debates d
    LEFT JOIN public.users c ON d.challenger_id = c.id
    LEFT JOIN public.users o ON d.opponent_id = o.id
    WHERE d.id = p_debate_id;
END;
$$;

GRANT EXECUTE ON FUNCTION get_debate_details(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_debate_details(UUID) TO authenticated;

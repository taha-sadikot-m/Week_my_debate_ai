-- RPC to fetch debates for a user securely
-- This bypasses RLS issues for custom auth users

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
    opponent_name TEXT
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
        o.full_name as opponent_name
    FROM public.debates d
    LEFT JOIN public.users c ON d.challenger_id = c.id
    LEFT JOIN public.users o ON d.opponent_id = o.id
    WHERE d.challenger_id = p_user_id OR d.opponent_id = p_user_id
    ORDER BY d.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION get_user_debates(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_user_debates(UUID) TO authenticated;

-- RPC to accept a debate challenge
CREATE OR REPLACE FUNCTION accept_debate_challenge(p_debate_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_debate_exists BOOLEAN;
BEGIN
    -- Verify the debate exists and the user is the opponent
    SELECT EXISTS (
        SELECT 1 FROM public.debates 
        WHERE id = p_debate_id 
        AND opponent_id = p_user_id 
        AND status = 'pending'
    ) INTO v_debate_exists;

    IF NOT v_debate_exists THEN
        RETURN FALSE;
    END IF;

    -- Update status
    UPDATE public.debates
    SET status = 'active', updated_at = now()
    WHERE id = p_debate_id;

    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION accept_debate_challenge(UUID, UUID) TO anon;
GRANT EXECUTE ON FUNCTION accept_debate_challenge(UUID, UUID) TO authenticated;

-- RPC to reject a debate challenge
CREATE OR REPLACE FUNCTION reject_debate_challenge(p_debate_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_debate_exists BOOLEAN;
BEGIN
    -- Verify the debate exists and the user is the opponent
    SELECT EXISTS (
        SELECT 1 FROM public.debates 
        WHERE id = p_debate_id 
        AND opponent_id = p_user_id 
        AND status = 'pending'
    ) INTO v_debate_exists;

    IF NOT v_debate_exists THEN
        RETURN FALSE;
    END IF;

    -- Update status
    UPDATE public.debates
    SET status = 'rejected', updated_at = now()
    WHERE id = p_debate_id;

    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION reject_debate_challenge(UUID, UUID) TO anon;
GRANT EXECUTE ON FUNCTION reject_debate_challenge(UUID, UUID) TO authenticated;

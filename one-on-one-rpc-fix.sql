-- RPCs for 1:1 Debate Feature to support Custom Auth
-- These functions bypass RLS issues by running as SECURITY DEFINER
-- This is necessary because the frontend client is not authenticated via Supabase Auth

-- 1. Get Users for Dropdown
CREATE OR REPLACE FUNCTION get_challengeable_users(p_user_id UUID)
RETURNS TABLE (id UUID, full_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.full_name
    FROM public.users u
    WHERE u.id != p_user_id
    AND u.is_active = true;
END;
$$;

GRANT EXECUTE ON FUNCTION get_challengeable_users(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_challengeable_users(UUID) TO authenticated;

-- 2. Create Debate Challenge
CREATE OR REPLACE FUNCTION create_debate_challenge(
    p_challenger_id UUID,
    p_opponent_id UUID,
    p_topic TEXT,
    p_role TEXT,
    p_turns INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_debate_id UUID;
BEGIN
    INSERT INTO public.debates (
        topic,
        challenger_id,
        opponent_id,
        challenger_role,
        total_turns,
        status
    ) VALUES (
        p_topic,
        p_challenger_id,
        p_opponent_id,
        p_role,
        p_turns,
        'pending'
    )
    RETURNING id INTO v_debate_id;

    RETURN v_debate_id;
END;
$$;

GRANT EXECUTE ON FUNCTION create_debate_challenge(UUID, UUID, TEXT, TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION create_debate_challenge(UUID, UUID, TEXT, TEXT, INTEGER) TO authenticated;

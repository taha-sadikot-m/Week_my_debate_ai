CREATE OR REPLACE FUNCTION update_debate_analysis(
    p_debate_id UUID,
    p_user_id UUID,
    p_analysis_data JSONB,
    p_winner_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_debate_record RECORD;
    v_winner_role TEXT;
BEGIN
    -- Check if user is participant
    SELECT * INTO v_debate_record FROM public.debates WHERE id = p_debate_id;
    
    IF v_debate_record IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Debate not found');
    END IF;

    IF v_debate_record.challenger_id != p_user_id AND v_debate_record.opponent_id != p_user_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: User is not a participant');
    END IF;

    -- Update debates table
    UPDATE public.debates
    SET 
        analysis_data = p_analysis_data,
        winner_id = p_winner_id,
        status = 'completed',
        updated_at = NOW()
    WHERE id = p_debate_id;

    -- Determine winner role for debate_sessions
    -- Assuming challenger is always 'For' and opponent is 'Against' based on typical logic
    -- But let's check the analysis data if possible, or just map IDs
    
    IF p_winner_id IS NOT NULL THEN
        IF p_winner_id = v_debate_record.challenger_id THEN
            v_winner_role := 'FOR'; 
        ELSIF p_winner_id = v_debate_record.opponent_id THEN
            v_winner_role := 'AGAINST';
        END IF;
    ELSE
        -- If winner_id is null, maybe it's a draw or analysis didn't decide
        v_winner_role := NULL;
    END IF;

    -- Update debate_sessions table
    -- We use the same ID because the system seems to use shared IDs or writes to both
    UPDATE public.debate_sessions
    SET 
        analysis_data = p_analysis_data,
        winner = v_winner_role,
        status = 'completed',
        updated_at = NOW()
    WHERE id = p_debate_id;

    RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION update_debate_analysis(UUID, UUID, JSONB, UUID) TO anon;
GRANT EXECUTE ON FUNCTION update_debate_analysis(UUID, UUID, JSONB, UUID) TO authenticated;

-- RPC to fetch debate details securely
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
    WHERE d.id = p_debate_id;
END;
$$;

GRANT EXECUTE ON FUNCTION get_debate_details(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_debate_details(UUID) TO authenticated;

-- RPC to fetch debate turns securely
CREATE OR REPLACE FUNCTION get_debate_turns(p_debate_id UUID)
RETURNS TABLE (
    id UUID,
    debate_id UUID,
    speaker_id UUID,
    transcript TEXT,
    audio_url TEXT,
    turn_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    speaker_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.debate_id,
        t.speaker_id,
        t.transcript,
        t.audio_url,
        t.turn_number,
        t.created_at,
        u.full_name as speaker_name
    FROM public.debate_turns t
    LEFT JOIN public.users u ON t.speaker_id = u.id
    WHERE t.debate_id = p_debate_id
    ORDER BY t.turn_number ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION get_debate_turns(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_debate_turns(UUID) TO authenticated;

-- RPC to submit a debate turn securely
CREATE OR REPLACE FUNCTION submit_debate_turn(
    p_debate_id UUID,
    p_speaker_id UUID,
    p_transcript TEXT,
    p_audio_url TEXT,
    p_turn_number INTEGER,
    p_total_turns INTEGER,
    p_challenger_id UUID,
    p_opponent_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_is_last_turn BOOLEAN;
    v_winner_id UUID;
BEGIN
    -- Insert the turn
    INSERT INTO public.debate_turns (
        debate_id,
        speaker_id,
        transcript,
        audio_url,
        turn_number
    ) VALUES (
        p_debate_id,
        p_speaker_id,
        p_transcript,
        p_audio_url,
        p_turn_number
    );

    -- Determine if this is the last turn
    v_is_last_turn := p_turn_number >= (p_total_turns * 2);

    -- Determine winner if last turn (Random for now as per requirement)
    IF v_is_last_turn THEN
        IF random() > 0.5 THEN
            v_winner_id := p_challenger_id;
        ELSE
            v_winner_id := p_opponent_id;
        END IF;

        UPDATE public.debates
        SET 
            current_turn = p_turn_number,
            status = 'completed',
            winner_id = v_winner_id,
            updated_at = now()
        WHERE id = p_debate_id;
    ELSE
        UPDATE public.debates
        SET 
            current_turn = p_turn_number,
            updated_at = now()
        WHERE id = p_debate_id;
    END IF;

    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION submit_debate_turn(UUID, UUID, TEXT, TEXT, INTEGER, INTEGER, UUID, UUID) TO anon;
GRANT EXECUTE ON FUNCTION submit_debate_turn(UUID, UUID, TEXT, TEXT, INTEGER, INTEGER, UUID, UUID) TO authenticated;

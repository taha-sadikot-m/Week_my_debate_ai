-- Enable storage of debate analysis results in the database
-- This allows retrieving historical analysis for 1:1 debates

-- Add analysis_data column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'debate_sessions' AND column_name = 'analysis_data') THEN
        ALTER TABLE debate_sessions ADD COLUMN analysis_data JSONB;
    END IF;
END $$;

-- Add winner column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'debate_sessions' AND column_name = 'winner') THEN
        ALTER TABLE debate_sessions ADD COLUMN winner TEXT;
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN debate_sessions.analysis_data IS 'Stores the full JSON analysis from the AI judge, including user-specific feedback';
COMMENT ON COLUMN debate_sessions.winner IS 'The declared winner of the debate (FOR, AGAINST, or DRAW)';

-- Create an index on winner for analytics/filtering
CREATE INDEX IF NOT EXISTS idx_debate_sessions_winner ON debate_sessions(winner);

-- Create a function to easily update analysis data
CREATE OR REPLACE FUNCTION update_debate_analysis(
    p_session_id UUID,
    p_analysis_data JSONB,
    p_winner TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE debate_sessions
    SET 
        analysis_data = p_analysis_data,
        winner = p_winner,
        status = 'completed',
        completed_at = NOW()
    WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

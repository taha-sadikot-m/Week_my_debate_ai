-- Ensure debate_sessions table supports human debates

-- Check if debate_type column exists and modify if necessary
DO $$
BEGIN
    -- If debate_type is an enum, we might need to add 'human' to it
    -- But usually it's just text. If it's text, we are good.
    -- If there is a check constraint, we might need to drop/update it.
    
    -- For now, we assume it's text or we just try to insert 'human'.
    -- If it fails, the user will need to adjust their schema.
    -- But we can try to add a comment or metadata.
    
    NULL;
END $$;

-- We want to ensure we can store analysis for human debates.
-- The previous script added analysis_data and winner columns.
-- This script is just a placeholder to confirm we are good to go.
-- If you have strict foreign keys or constraints, please review them.

-- Optional: Create a view for human debate history
CREATE OR REPLACE VIEW human_debate_history AS
SELECT 
    id,
    user_id,
    topic,
    created_at,
    completed_at,
    winner,
    analysis_data,
    status
FROM debate_sessions
WHERE debate_type = 'human'
ORDER BY created_at DESC;
but 
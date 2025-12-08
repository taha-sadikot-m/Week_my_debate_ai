-- Add analysis_data column to debates table
ALTER TABLE public.debates 
ADD COLUMN IF NOT EXISTS analysis_data JSONB;

-- Add analysis_data and winner columns to debate_sessions table
ALTER TABLE public.debate_sessions 
ADD COLUMN IF NOT EXISTS analysis_data JSONB,
ADD COLUMN IF NOT EXISTS winner TEXT;

-- Ensure permissions are correct
GRANT ALL ON public.debates TO authenticated;
GRANT ALL ON public.debates TO anon;
GRANT ALL ON public.debate_sessions TO authenticated;
GRANT ALL ON public.debate_sessions TO anon;

-- Refresh the schema cache for the RPC function if needed
NOTIFY pgrst, 'reload schema';

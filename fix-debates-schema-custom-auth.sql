-- Re-create 1:1 debate tables to work with Custom Auth (public.users)

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.debate_turns CASCADE;
DROP TABLE IF EXISTS public.debates CASCADE;

-- Create table for 1:1 debates referencing public.users
CREATE TABLE public.debates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic TEXT NOT NULL,
    challenger_id UUID NOT NULL REFERENCES public.users(id),
    opponent_id UUID NOT NULL REFERENCES public.users(id),
    challenger_role TEXT NOT NULL CHECK (challenger_role IN ('For', 'Against')),
    total_turns INTEGER NOT NULL DEFAULT 2,
    current_turn INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'rejected')),
    winner_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for debate turns
CREATE TABLE public.debate_turns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    debate_id UUID NOT NULL REFERENCES public.debates(id) ON DELETE CASCADE,
    speaker_id UUID NOT NULL REFERENCES public.users(id),
    transcript TEXT,
    audio_url TEXT, -- Storing Base64 or URL
    turn_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_turns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Custom Auth
-- We use (current_setting('app.current_user_id', true))::uuid instead of auth.uid()

-- Debates Policies
CREATE POLICY "Users can view debates they are involved in" 
ON public.debates FOR SELECT 
USING (
    (current_setting('app.current_user_id', true))::uuid = challenger_id 
    OR 
    (current_setting('app.current_user_id', true))::uuid = opponent_id
);

CREATE POLICY "Users can create debates" 
ON public.debates FOR INSERT 
WITH CHECK (
    (current_setting('app.current_user_id', true))::uuid = challenger_id
);

CREATE POLICY "Users can update debates they are involved in" 
ON public.debates FOR UPDATE 
USING (
    (current_setting('app.current_user_id', true))::uuid = challenger_id 
    OR 
    (current_setting('app.current_user_id', true))::uuid = opponent_id
);

-- Debate Turns Policies
CREATE POLICY "Users can view turns of their debates" 
ON public.debate_turns FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.debates 
        WHERE debates.id = debate_turns.debate_id 
        AND (
            debates.challenger_id = (current_setting('app.current_user_id', true))::uuid 
            OR 
            debates.opponent_id = (current_setting('app.current_user_id', true))::uuid
        )
    )
);

CREATE POLICY "Users can insert turns for their debates" 
ON public.debate_turns FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.debates 
        WHERE debates.id = debate_turns.debate_id 
        AND (
            debates.challenger_id = (current_setting('app.current_user_id', true))::uuid 
            OR 
            debates.opponent_id = (current_setting('app.current_user_id', true))::uuid
        )
    )
);

-- Also ensure users can view other users for the dropdown
DROP POLICY IF EXISTS "Users can view all public user profiles" ON public.users;
CREATE POLICY "Users can view all public user profiles"
ON public.users
FOR SELECT
TO authenticated
USING (true);

GRANT SELECT ON public.users TO authenticated;

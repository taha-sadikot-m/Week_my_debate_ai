
-- Create table for 1:1 debates
CREATE TABLE IF NOT EXISTS public.debates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic TEXT NOT NULL,
    challenger_id UUID NOT NULL REFERENCES public.profiles(id),
    opponent_id UUID NOT NULL REFERENCES public.profiles(id),
    challenger_role TEXT NOT NULL CHECK (challenger_role IN ('For', 'Against')),
    total_turns INTEGER NOT NULL DEFAULT 2,
    current_turn INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'rejected')),
    winner_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for debate turns (storing transcripts and temp audio)
CREATE TABLE IF NOT EXISTS public.debate_turns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    debate_id UUID NOT NULL REFERENCES public.debates(id) ON DELETE CASCADE,
    speaker_id UUID NOT NULL REFERENCES public.profiles(id),
    transcript TEXT,
    audio_url TEXT, -- Temporary URL or path
    turn_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_turns ENABLE ROW LEVEL SECURITY;

-- Policies for debates
CREATE POLICY "Users can view debates they are involved in" 
ON public.debates FOR SELECT 
USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

CREATE POLICY "Users can create debates" 
ON public.debates FOR INSERT 
WITH CHECK (auth.uid() = challenger_id);

CREATE POLICY "Users can update debates they are involved in" 
ON public.debates FOR UPDATE 
USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

-- Policies for debate_turns
CREATE POLICY "Users can view turns of their debates" 
ON public.debate_turns FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.debates 
        WHERE debates.id = debate_turns.debate_id 
        AND (debates.challenger_id = auth.uid() OR debates.opponent_id = auth.uid())
    )
);

CREATE POLICY "Users can insert turns for their debates" 
ON public.debate_turns FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.debates 
        WHERE debates.id = debate_turns.debate_id 
        AND (debates.challenger_id = auth.uid() OR debates.opponent_id = auth.uid())
    )
);

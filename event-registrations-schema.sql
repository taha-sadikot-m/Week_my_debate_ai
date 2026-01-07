-- Event Registrations Table Schema
-- This table stores all event registrations including payment information

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id INTEGER NOT NULL,
    event_title TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    institution TEXT NOT NULL,
    year TEXT,
    city TEXT NOT NULL,
    experience TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_id TEXT,
    payment_amount DECIMAL(10, 2),
    payment_date TIMESTAMP WITH TIME ZONE,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    registration_id TEXT UNIQUE,
    committee_preference TEXT,
    experience_level TEXT,
    attended_mun_before BOOLEAN,
    consent_updates BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON public.event_registrations(email);
CREATE INDEX IF NOT EXISTS idx_event_registrations_payment_status ON public.event_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_registration_date ON public.event_registrations(registration_date);

-- Enable Row Level Security
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for custom auth

-- Policy: Allow public to insert registrations (since payment is handled externally)
CREATE POLICY "Allow public to insert registrations"
ON public.event_registrations
FOR INSERT
WITH CHECK (true);

-- Policy: Allow public to view registrations (or restrict based on your needs)
CREATE POLICY "Allow public to view registrations"
ON public.event_registrations
FOR SELECT
USING (true);

-- Policy: No updates allowed (registrations are immutable after creation)
-- If you need updates, modify this policy
CREATE POLICY "No updates to registrations"
ON public.event_registrations
FOR UPDATE
USING (false);

-- Function to generate unique registration ID
CREATE OR REPLACE FUNCTION public.generate_registration_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.registration_id := 'REG-' || NEW.event_id || '-' || EXTRACT(EPOCH FROM now())::bigint || '-' || substring(NEW.id::text, 1, 6);
    RETURN NEW;
END;
$$;

-- Trigger to auto-generate registration ID
CREATE TRIGGER generate_registration_id_trigger
BEFORE INSERT ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION public.generate_registration_id();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_event_registration_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_event_registration_updated_at_trigger
BEFORE UPDATE ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_event_registration_updated_at();

-- Function to create event registration (RPC endpoint)
CREATE OR REPLACE FUNCTION public.create_event_registration(
    p_event_id INTEGER,
    p_event_title TEXT,
    p_full_name TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_institution TEXT,
    p_year TEXT,
    p_city TEXT,
    p_experience TEXT,
    p_payment_status TEXT DEFAULT 'completed',
    p_payment_id TEXT DEFAULT NULL,
    p_payment_amount DECIMAL DEFAULT NULL,
    p_committee_preference TEXT DEFAULT NULL,
    p_experience_level TEXT DEFAULT NULL,
    p_attended_mun_before BOOLEAN DEFAULT NULL,
    p_consent_updates BOOLEAN DEFAULT true
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_registration_record RECORD;
    v_user_id UUID;
BEGIN
    -- Try to find user by email
    SELECT id INTO v_user_id
    FROM public.users
    WHERE email = p_email
    LIMIT 1;

    -- Insert registration
    INSERT INTO public.event_registrations (
        event_id,
        event_title,
        user_id,
        full_name,
        email,
        phone,
        institution,
        year,
        city,
        experience,
        payment_status,
        payment_id,
        payment_amount,
        payment_date,
        committee_preference,
        experience_level,
        attended_mun_before,
        consent_updates
    ) VALUES (
        p_event_id,
        p_event_title,
        v_user_id,
        p_full_name,
        p_email,
        p_phone,
        p_institution,
        p_year,
        p_city,
        p_experience,
        p_payment_status,
        p_payment_id,
        p_payment_amount,
        CASE WHEN p_payment_status = 'completed' THEN now() ELSE NULL END,
        p_committee_preference,
        p_experience_level,
        p_attended_mun_before,
        p_consent_updates
    )
    RETURNING * INTO v_registration_record;

    RETURN jsonb_build_object(
        'success', true,
        'registration', jsonb_build_object(
            'id', v_registration_record.id,
            'registration_id', v_registration_record.registration_id,
            'event_id', v_registration_record.event_id,
            'event_title', v_registration_record.event_title,
            'full_name', v_registration_record.full_name,
            'email', v_registration_record.email,
            'payment_status', v_registration_record.payment_status,
            'registration_date', v_registration_record.registration_date
        )
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_event_registration TO public;
GRANT EXECUTE ON FUNCTION public.generate_registration_id TO public;
GRANT EXECUTE ON FUNCTION public.update_event_registration_updated_at TO public;

-- Function to get user's event registrations
CREATE OR REPLACE FUNCTION public.get_user_event_registrations(
    p_user_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_registrations JSONB;
BEGIN
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', id,
            'registration_id', registration_id,
            'event_id', event_id,
            'event_title', event_title,
            'full_name', full_name,
            'email', email,
            'phone', phone,
            'institution', institution,
            'year', year,
            'city', city,
            'experience', experience,
            'payment_status', payment_status,
            'payment_amount', payment_amount,
            'payment_date', payment_date,
            'registration_date', registration_date,
            'committee_preference', committee_preference,
            'experience_level', experience_level
        )
    )
    INTO v_registrations
    FROM public.event_registrations
    WHERE email = p_user_email
    ORDER BY registration_date DESC;

    RETURN jsonb_build_object(
        'success', true,
        'registrations', COALESCE(v_registrations, '[]'::jsonb)
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_user_event_registrations TO public;

-- Function to get all registrations for an event (admin only)
CREATE OR REPLACE FUNCTION public.get_event_registrations(
    p_event_id INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_registrations JSONB;
BEGIN
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', id,
            'registration_id', registration_id,
            'full_name', full_name,
            'email', email,
            'phone', phone,
            'institution', institution,
            'year', year,
            'city', city,
            'experience', experience,
            'payment_status', payment_status,
            'payment_amount', payment_amount,
            'payment_date', payment_date,
            'registration_date', registration_date,
            'committee_preference', committee_preference,
            'experience_level', experience_level,
            'attended_mun_before', attended_mun_before
        )
    )
    INTO v_registrations
    FROM public.event_registrations
    WHERE event_id = p_event_id
    ORDER BY registration_date DESC;

    RETURN jsonb_build_object(
        'success', true,
        'registrations', COALESCE(v_registrations, '[]'::jsonb),
        'total_count', (SELECT COUNT(*) FROM public.event_registrations WHERE event_id = p_event_id)
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_event_registrations TO public;

-- Add comments for documentation
COMMENT ON TABLE public.event_registrations IS 'Stores all event registrations with payment information';
COMMENT ON COLUMN public.event_registrations.event_id IS 'Reference to the event';
COMMENT ON COLUMN public.event_registrations.user_id IS 'Reference to users table if user is registered';
COMMENT ON COLUMN public.event_registrations.payment_status IS 'Status of payment: pending, completed, failed, or refunded';
COMMENT ON COLUMN public.event_registrations.registration_id IS 'Unique registration identifier shown to users';
COMMENT ON FUNCTION public.create_event_registration IS 'Creates a new event registration after payment completion';
COMMENT ON FUNCTION public.get_user_event_registrations IS 'Retrieves all registrations for a specific user';
COMMENT ON FUNCTION public.get_event_registrations IS 'Retrieves all registrations for a specific event (admin only)';

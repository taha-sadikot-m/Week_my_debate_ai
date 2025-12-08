-- Add profile columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS school TEXT,
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS is_profile_completed BOOLEAN DEFAULT FALSE;

-- Function to update user profile
CREATE OR REPLACE FUNCTION public.update_user_profile(
    p_user_id UUID,
    p_full_name TEXT,
    p_age INTEGER,
    p_gender TEXT,
    p_country TEXT,
    p_school TEXT,
    p_interests TEXT[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_record RECORD;
BEGIN
    -- Update the user record
    UPDATE public.users
    SET 
        full_name = COALESCE(p_full_name, full_name),
        age = p_age,
        gender = p_gender,
        country = p_country,
        school = p_school,
        interests = p_interests,
        is_profile_completed = TRUE,
        updated_at = now()
    WHERE id = p_user_id
    RETURNING * INTO v_user_record;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User not found'
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'user', jsonb_build_object(
            'id', v_user_record.id,
            'email', v_user_record.email,
            'full_name', v_user_record.full_name,
            'user_role', v_user_record.user_role,
            'tokens', v_user_record.tokens,
            'email_verified', v_user_record.email_verified,
            'age', v_user_record.age,
            'gender', v_user_record.gender,
            'country', v_user_record.country,
            'school', v_user_record.school,
            'interests', v_user_record.interests,
            'is_profile_completed', v_user_record.is_profile_completed
        )
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users (if using Supabase auth, but here we use custom auth so maybe public or specific role)
-- Since we are using custom auth service which likely uses a service role or specific user, we ensure it's accessible.
GRANT EXECUTE ON FUNCTION public.update_user_profile TO public;

-- Update login_user to return profile fields
CREATE OR REPLACE FUNCTION public.login_user(
    p_email TEXT,
    p_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user RECORD;
    v_session_token TEXT;
    v_session_id UUID;
BEGIN
    -- Find user and verify password
    SELECT * INTO v_user
    FROM public.users
    WHERE email = p_email 
    AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invalid email or password');
    END IF;
    
    -- Check if email is verified
    IF NOT v_user.email_verified THEN
        RETURN json_build_object('success', false, 'error', 'Please verify your email before logging in');
    END IF;
    
    -- Verify password
    IF NOT public.verify_password(p_password, v_user.password_hash) THEN
        RETURN json_build_object('success', false, 'error', 'Invalid email or password');
    END IF;
    
    -- Generate session token
    v_session_token := public.generate_session_token();
    
    -- Create session
    INSERT INTO public.user_sessions (user_id, session_token, expires_at)
    VALUES (v_user.id, v_session_token, now() + interval '7 days')
    RETURNING id INTO v_session_id;
    
    -- Update last login
    UPDATE public.users 
    SET last_login_at = now(), updated_at = now()
    WHERE id = v_user.id;
    
    RETURN json_build_object(
        'success', true,
        'user', json_build_object(
            'id', v_user.id,
            'email', v_user.email,
            'full_name', v_user.full_name,
            'user_role', v_user.user_role,
            'tokens', v_user.tokens,
            'email_verified', v_user.email_verified,
            'age', v_user.age,
            'gender', v_user.gender,
            'country', v_user.country,
            'school', v_user.school,
            'interests', v_user.interests,
            'is_profile_completed', v_user.is_profile_completed
        ),
        'session_token', v_session_token,
        'expires_at', now() + interval '7 days'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Update validate_session to return profile fields
CREATE OR REPLACE FUNCTION public.validate_session(
    p_session_token TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_session RECORD;
BEGIN
    -- Find valid session
    SELECT s.*, u.*
    INTO v_session
    FROM public.user_sessions s
    JOIN public.users u ON s.user_id = u.id
    WHERE s.session_token = p_session_token 
    AND s.expires_at > now()
    AND u.is_active = true;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invalid or expired session');
    END IF;
    
    -- Update last accessed
    UPDATE public.user_sessions
    SET last_accessed_at = now()
    WHERE session_token = p_session_token;
    
    RETURN json_build_object(
        'success', true,
        'user', json_build_object(
            'id', v_session.user_id,
            'email', v_session.email,
            'full_name', v_session.full_name,
            'user_role', v_session.user_role,
            'tokens', v_session.tokens,
            'email_verified', v_session.email_verified,
            'age', v_session.age,
            'gender', v_session.gender,
            'country', v_session.country,
            'school', v_session.school,
            'interests', v_session.interests,
            'is_profile_completed', v_session.is_profile_completed
        )
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

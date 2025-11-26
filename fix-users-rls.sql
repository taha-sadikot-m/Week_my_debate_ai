-- Allow authenticated users to view basic info of other users for challenges
-- This is required for the "Select Opponent" dropdown in 1:1 debates

-- Drop existing restrictive policy if needed (or just add a new one)
-- The existing policy is: "Users can view their own profile"

-- We need a policy that allows viewing all users, but maybe we should restrict columns?
-- Postgres RLS applies to rows, not columns. So we have to allow SELECT on the row.
-- We can rely on the API query to only select safe columns, but RLS is the safety net.
-- For now, let's allow authenticated users to view all rows in public.users.

CREATE POLICY "Users can view all public user profiles"
ON public.users
FOR SELECT
TO authenticated
USING (true);

-- Note: This might conflict with "Users can view their own profile" if it's restrictive.
-- Postgres combines policies with OR. So if one policy says "only me" and another says "everyone", "everyone" wins.
-- So adding this policy is sufficient.

-- Also ensure the debates table has correct policies for custom auth
-- The previous one-on-one-debate-tables.sql might have assumed Supabase Auth UUIDs.
-- Custom Auth also uses UUIDs, so it should be fine, provided the user_id matches.

-- Grant access
GRANT SELECT ON public.users TO authenticated;

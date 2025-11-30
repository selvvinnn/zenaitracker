-- Fix for "Failed to create user profile" error
-- This adds an INSERT policy so users can create their own profile when they sign up

-- Drop existing policies if they exist (optional, only if you want to recreate them)
-- DROP POLICY IF EXISTS "Users can view their own data" ON users;
-- DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- Add INSERT policy for users to create their own record
CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Alternative: If the above doesn't work, you can temporarily disable RLS for testing
-- (NOT recommended for production)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- To re-enable RLS:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;


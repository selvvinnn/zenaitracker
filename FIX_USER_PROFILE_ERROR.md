# Fix "Failed to create user profile" Error

## The Problem

When you sign up, the app tries to create a user record in the `users` table, but it fails because **Row Level Security (RLS) policies are blocking the INSERT operation**.

## The Solution

You need to add an **INSERT policy** to the `users` table so users can create their own profile when they sign up.

## Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

## Step 2: Run This SQL

Copy and paste this SQL into the editor and click **Run**:

```sql
-- Add INSERT policy for users table
CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## Step 3: Verify It Worked

You can check if the policy was created by running:

```sql
SELECT * FROM pg_policies WHERE tablename = 'users';
```

You should see three policies:
- ✅ Users can view their own data (SELECT)
- ✅ Users can insert their own data (INSERT) ← This is the new one
- ✅ Users can update their own data (UPDATE)

## Step 4: Try Signing Up Again

After adding the policy, try signing up again. It should work now!

## Alternative: Use Database Trigger (Advanced)

If you prefer to automatically create user profiles when a user signs up in Supabase Auth, you can use a database trigger instead:

```sql
-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, character, preferences)
  VALUES (
    NEW.id,
    NEW.email,
    '{"name": "Hunter", "avatar": "warrior", "theme": "blue", "level": 1, "xp": 0, "totalXP": 0, "rank": "E"}'::jsonb,
    '{"notifications": true, "soundEffects": true, "penalties": false, "darkMode": true}'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger that fires when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

If you use this approach, you can remove the manual INSERT from the signup code, as profiles will be created automatically.

## Still Having Issues?

1. Check the browser console (F12) for detailed error messages
2. Verify RLS is enabled: `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`
3. Check your Supabase project logs for database errors
4. Make sure you're using the **anon public** key, not the service_role key


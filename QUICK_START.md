# Quick Start Guide

## The White Screen Issue

If you're seeing a white screen, it's likely because **Supabase is not configured**. Follow these steps:

### Step 1: Create `.env` file

Create a `.env` file in the root directory (`Zen_Habit_Tracker/.env`) with:

```env
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 2: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → paste as `VITE_SUPABASE_URL`
   - **anon public key** → paste as `VITE_SUPABASE_ANON_KEY`

### Step 3: Set Up Database

1. In Supabase, go to **SQL Editor**
2. Open the file `supabase-schema.sql` from this project
3. Copy and paste the SQL into the editor
4. Click **Run**

### Step 4: Restart Dev Server

After creating the `.env` file:

```bash
npm run dev
```

The app should now load! If you still see issues, check the browser console (F12) for error messages.

## Troubleshooting

### Still seeing white screen?

1. **Check browser console** (F12 → Console tab) for errors
2. **Verify .env file** is in the root directory (same level as package.json)
3. **Restart the dev server** after creating/editing .env file
4. **Check Supabase URL** starts with `https://` and doesn't have trailing slashes

### Common Errors
image.png
- **"Failed to fetch"**: Check your Supabase URL is correct
- **"Invalid API key"**: Check your anon key is correct
- **"relation does not exist"**: Run the SQL schema in Supabase SQL Editor


# Fix "Forbidden use of secret API key in browser" Error

## ⚠️ Critical Security Issue

You're using the **WRONG API key** in your `.env` file. You've accidentally used the **secret/service_role key** instead of the **anon/public key**.

## ✅ Quick Fix

### Step 1: Open Your `.env` File

Make sure you have a `.env` file in the root directory with:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 2: Get the CORRECT Key from Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **Settings → API**
3. Under **Project API keys**, you'll see two keys:
   - **`anon` `public`** ← **USE THIS ONE** ✅
   - **`service_role` `secret`** ← **NEVER USE THIS IN BROWSER** ❌

### Step 3: Update Your `.env` File

Replace the `VITE_SUPABASE_ANON_KEY` with the **anon public** key:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (anon public key)
```

**Important:**
- ✅ Use the **anon public** key (starts with `eyJ`, shorter key)
- ❌ **NEVER** use the **service_role** key (starts with `eyJ` but much longer)
- The service_role key has admin privileges and should **ONLY** be used in server-side code

### Step 4: Restart Your Dev Server

After updating the `.env` file:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

## How to Identify the Keys

| Key Type | Where to Use | Length | Starts With |
|----------|--------------|--------|-------------|
| **anon public** | ✅ Browser/Frontend | ~200-300 chars | `eyJ` |
| **service_role** | ❌ Server-side only | ~300+ chars | `eyJ` |

**The anon key is safe for browser use and respects Row Level Security (RLS) policies.**
**The service_role key bypasses all security and should NEVER be exposed to browsers.**

## Security Note

⚠️ **If you've committed your `.env` file to Git with the service_role key:**

1. **Immediately revoke the key** in Supabase Dashboard → Settings → API → Regenerate
2. **Remove it from Git history** if it was committed
3. **Add `.env` to `.gitignore`** (should already be there)

The app now includes validation to detect if you're using the wrong key type and will show a clear error message.


# 🔧 Database Schema Fix Instructions

## Problem
Your Supabase database is missing required columns:
- `keywords` table is missing `opportunity_score` column
- `trending_artists` table is missing `trend_momentum` column

This is why you're seeing 400 errors and the app falling back to mock data.

## Solution

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project (`ahbhhcrgjwxjdcpclzly`)
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run the Schema Fix
1. Click **New Query**
2. Copy the entire contents of `SUPABASE_SCHEMA_FIX.sql` file
3. Paste it into the SQL editor
4. Click **Run** button

### Step 3: Verify the Fix
After running the SQL commands, your app should:
- ✅ Stop showing 400 errors in console
- ✅ Load real data from Supabase instead of mock data
- ✅ Display trending keywords and artists properly
- ✅ Show opportunity scores and trend momentum

### What the SQL Does
1. **Adds missing columns**: `opportunity_score` and `trend_momentum`
2. **Creates indexes**: For better query performance
3. **Inserts sample data**: 8 trending keywords and 8 trending artists
4. **Handles conflicts**: Won't duplicate data if run multiple times

### Expected Result
Once fixed, your dashboard will show:
- Real trending keywords like "drake type beat", "juice wrld type beat"
- Real trending artists like "Central Cee", "Ice Spice", "Yeat"
- Proper opportunity scores and momentum indicators
- No more console errors

### Test the Fix
1. Refresh your app at https://beatniche.vercel.app
2. Check browser console - no more 400 errors
3. See real data instead of "Using mock data" messages

---

**Note**: If you get any permission errors, make sure you're logged into the correct Supabase account that owns the project.

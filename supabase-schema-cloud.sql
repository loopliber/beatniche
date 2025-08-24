-- Supabase Database Schema for BeatNiche (Cloud Version)
-- Run these SQL commands in your Supabase SQL editor

-- Create users profile table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create keywords table
CREATE TABLE IF NOT EXISTS public.keywords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  description TEXT,
  search_volume INTEGER,
  competition_score DECIMAL(3,2), -- 0.00 to 1.00
  trend_direction TEXT CHECK (trend_direction IN ('rising', 'falling', 'stable')),
  genre TEXT,
  related_keywords TEXT[], -- Array of related keywords
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_public BOOLEAN DEFAULT false
);

-- Create trending_artists table
CREATE TABLE IF NOT EXISTS public.trending_artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  youtube_channel_id TEXT,
  spotify_id TEXT,
  genre TEXT,
  rank INTEGER,
  monthly_listeners BIGINT,
  view_count BIGINT,
  subscriber_count BIGINT,
  growth_rate DECIMAL(5,2), -- Percentage growth
  country TEXT,
  thumbnail_url TEXT,
  bio TEXT,
  social_links JSONB, -- Store social media links
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create video_analytics table for tracking YouTube videos
CREATE TABLE IF NOT EXISTS public.video_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT UNIQUE NOT NULL, -- YouTube video ID
  title TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  channel_title TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  view_count BIGINT,
  like_count BIGINT,
  comment_count BIGINT,
  duration TEXT, -- ISO 8601 duration format
  tags TEXT[],
  description TEXT,
  thumbnail_url TEXT,
  category_id TEXT,
  last_scraped TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create keyword_tracking table for monitoring keyword performance
CREATE TABLE IF NOT EXISTS public.keyword_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword_id UUID REFERENCES public.keywords(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  search_volume INTEGER,
  competition_score DECIMAL(3,2),
  avg_video_views BIGINT,
  top_video_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(keyword_id, date)
);

-- Create user_saved_items table for bookmarks
CREATE TABLE IF NOT EXISTS public.user_saved_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('keyword', 'artist', 'video')),
  item_id TEXT NOT NULL, -- Can be keyword_id, artist_id, or video_id
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, item_type, item_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_keywords_user_id ON public.keywords(user_id);
CREATE INDEX IF NOT EXISTS idx_keywords_genre ON public.keywords(genre);
CREATE INDEX IF NOT EXISTS idx_keywords_trend ON public.keywords(trend_direction);
CREATE INDEX IF NOT EXISTS idx_trending_artists_genre ON public.trending_artists(genre);
CREATE INDEX IF NOT EXISTS idx_trending_artists_rank ON public.trending_artists(rank);
CREATE INDEX IF NOT EXISTS idx_video_analytics_channel ON public.video_analytics(channel_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_published ON public.video_analytics(published_at);
CREATE INDEX IF NOT EXISTS idx_keyword_tracking_date ON public.keyword_tracking(date);
CREATE INDEX IF NOT EXISTS idx_user_saved_items_user ON public.user_saved_items(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- User profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Keywords: Users can access their own keywords and public ones
CREATE POLICY "Users can view own keywords" ON public.keywords
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own keywords" ON public.keywords
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own keywords" ON public.keywords
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own keywords" ON public.keywords
  FOR DELETE USING (auth.uid() = user_id);

-- Trending artists: Read-only for all authenticated users
CREATE POLICY "Authenticated users can view trending artists" ON public.trending_artists
  FOR SELECT USING (auth.role() = 'authenticated');

-- Video analytics: Read-only for all authenticated users
CREATE POLICY "Authenticated users can view video analytics" ON public.video_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Keyword tracking: Users can view tracking for their keywords
CREATE POLICY "Users can view keyword tracking" ON public.keyword_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.keywords 
      WHERE keywords.id = keyword_tracking.keyword_id 
      AND (keywords.user_id = auth.uid() OR keywords.is_public = true)
    )
  );

-- User saved items: Users can only access their own saved items
CREATE POLICY "Users can manage own saved items" ON public.user_saved_items
  FOR ALL USING (auth.uid() = user_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('uploads', 'uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

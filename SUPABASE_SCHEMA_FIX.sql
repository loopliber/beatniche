-- Run these SQL commands in your Supabase Dashboard > SQL Editor
-- This will add the missing columns and sample data

-- 1. Add the missing opportunity_score column to keywords table
ALTER TABLE public.keywords 
ADD COLUMN IF NOT EXISTS opportunity_score DECIMAL(5,2) DEFAULT 0.00;

-- 2. Add the missing trend_momentum column to trending_artists table  
ALTER TABLE public.trending_artists 
ADD COLUMN IF NOT EXISTS trend_momentum DECIMAL(5,2) DEFAULT 0.00;

-- 3. Add momentum_level column for better classification
ALTER TABLE public.trending_artists 
ADD COLUMN IF NOT EXISTS momentum_level TEXT DEFAULT 'medium' CHECK (momentum_level IN ('low', 'medium', 'high', 'viral'));

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_keywords_opportunity_score ON public.keywords(opportunity_score DESC);
CREATE INDEX IF NOT EXISTS idx_trending_artists_momentum ON public.trending_artists(trend_momentum DESC);

-- 5. Clear existing data and insert sample keywords data
DELETE FROM public.keywords WHERE is_public = true;

INSERT INTO public.keywords (keyword, description, search_volume, competition_score, opportunity_score, trend_direction, genre, related_keywords, is_public)
VALUES 
    ('drake type beat', 'Popular hip-hop style beat inspired by Drake', 125000, 0.85, 72.5, 'rising', 'hip-hop', ARRAY['drake beats', 'ovo sound', 'toronto sound'], true),
    ('lil baby type beat', 'Modern trap style beat inspired by Lil Baby', 89000, 0.78, 68.9, 'stable', 'trap', ARRAY['atlanta trap', 'melodic trap', 'lil baby beats'], true),
    ('juice wrld type beat', 'Melodic rap beat inspired by Juice WRLD', 156000, 0.92, 85.2, 'rising', 'melodic-rap', ARRAY['juice wrld beats', 'emo rap', '999'], true),
    ('travis scott type beat', 'Psychedelic trap beat inspired by Travis Scott', 78000, 0.88, 61.7, 'falling', 'psychedelic-trap', ARRAY['astroworld', 'cactus jack', 'travis beats'], true),
    ('playboi carti type beat', 'Experimental hip-hop beat inspired by Playboi Carti', 95000, 0.82, 75.3, 'rising', 'experimental-hip-hop', ARRAY['carti beats', 'whole lotta red', 'opium'], true),
    ('young thug type beat', 'Atlanta trap beat inspired by Young Thug', 67000, 0.79, 58.4, 'stable', 'atlanta-trap', ARRAY['thug beats', 'slime season', 'ysl'], true),
    ('future type beat', 'Melodic trap beat inspired by Future', 98000, 0.86, 64.2, 'rising', 'melodic-trap', ARRAY['future beats', 'freebandz', 'pluto'], true),
    ('pop smoke type beat', 'UK drill inspired beat from Pop Smoke style', 134000, 0.91, 78.6, 'rising', 'brooklyn-drill', ARRAY['pop smoke beats', 'woo', 'brooklyn drill'], true);

-- 6. Clear existing data and insert sample trending artists data
DELETE FROM public.trending_artists;

INSERT INTO public.trending_artists (name, genre, rank, monthly_listeners, view_count, subscriber_count, growth_rate, trend_momentum, momentum_level, country, bio)
VALUES 
    ('Central Cee', 'uk-drill', 1, 25000000, 450000000, 3200000, 15.8, 95.2, 'viral', 'UK', 'Rising UK drill artist taking the world by storm'),
    ('Ice Spice', 'bronx-drill', 2, 18000000, 380000000, 2800000, 22.3, 88.7, 'high', 'US', 'Bronx drill rapper with viral TikTok presence'),
    ('Yeat', 'rage-rap', 3, 12000000, 290000000, 1900000, 18.9, 82.1, 'high', 'US', 'Experimental rapper known for unique sound and style'),
    ('Destroy Lonely', 'opium', 4, 8500000, 180000000, 1200000, 25.1, 76.4, 'high', 'US', 'Rising star in the underground rap scene'),
    ('Ken Carson', 'rage-rap', 5, 7200000, 160000000, 980000, 20.7, 73.8, 'high', 'US', 'Part of the new wave of experimental hip-hop artists'),
    ('Lil Yachty', 'melodic-rap', 6, 15000000, 320000000, 2500000, 8.3, 65.9, 'medium', 'US', 'Veteran rapper with consistent hit-making ability'),
    ('Ski Mask The Slump God', 'soundcloud-rap', 7, 9800000, 210000000, 1600000, 12.4, 69.2, 'medium', 'US', 'Energetic rapper known for rapid-fire delivery'),
    ('JID', 'lyrical-rap', 8, 11200000, 185000000, 1400000, 16.7, 71.5, 'high', 'US', 'Technically skilled rapper gaining mainstream recognition');

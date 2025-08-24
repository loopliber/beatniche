-- Database Schema Update for BeatNiche
-- Add missing columns that the application requires

-- Add opportunity_score column to keywords table
ALTER TABLE public.keywords 
ADD COLUMN IF NOT EXISTS opportunity_score DECIMAL(5,2) DEFAULT 0.00;

-- Add trend_momentum column to trending_artists table
ALTER TABLE public.trending_artists 
ADD COLUMN IF NOT EXISTS trend_momentum DECIMAL(5,2) DEFAULT 0.00;

-- Add momentum_level column to trending_artists table for additional classification
ALTER TABLE public.trending_artists 
ADD COLUMN IF NOT EXISTS momentum_level TEXT DEFAULT 'medium' CHECK (momentum_level IN ('low', 'medium', 'high', 'viral'));

-- Update indexes to include new columns
CREATE INDEX IF NOT EXISTS idx_keywords_opportunity_score ON public.keywords(opportunity_score DESC);
CREATE INDEX IF NOT EXISTS idx_trending_artists_momentum ON public.trending_artists(trend_momentum DESC);

-- Add some sample data if tables are empty
DO $$
BEGIN
    -- Check if keywords table is empty and add sample data
    IF NOT EXISTS (SELECT 1 FROM public.keywords LIMIT 1) THEN
        INSERT INTO public.keywords (keyword, description, search_volume, competition_score, opportunity_score, trend_direction, genre, related_keywords, is_public)
        VALUES 
            ('drake type beat', 'Popular hip-hop style beat inspired by Drake', 125000, 0.85, 72.5, 'rising', 'hip-hop', ARRAY['drake beats', 'ovo sound', 'toronto sound'], true),
            ('lil baby type beat', 'Modern trap style beat inspired by Lil Baby', 89000, 0.78, 68.9, 'stable', 'trap', ARRAY['atlanta trap', 'melodic trap', 'lil baby beats'], true),
            ('juice wrld type beat', 'Melodic rap beat inspired by Juice WRLD', 156000, 0.92, 85.2, 'rising', 'melodic-rap', ARRAY['juice wrld beats', 'emo rap', '999'], true),
            ('travis scott type beat', 'Psychedelic trap beat inspired by Travis Scott', 78000, 0.88, 61.7, 'falling', 'psychedelic-trap', ARRAY['astroworld', 'cactus jack', 'travis beats'], true),
            ('playboi carti type beat', 'Experimental hip-hop beat inspired by Playboi Carti', 95000, 0.82, 75.3, 'rising', 'experimental-hip-hop', ARRAY['carti beats', 'whole lotta red', 'opium'], true);
    END IF;

    -- Check if trending_artists table is empty and add sample data  
    IF NOT EXISTS (SELECT 1 FROM public.trending_artists LIMIT 1) THEN
        INSERT INTO public.trending_artists (name, genre, rank, monthly_listeners, view_count, subscriber_count, growth_rate, trend_momentum, momentum_level, country, bio)
        VALUES 
            ('Central Cee', 'uk-drill', 1, 25000000, 450000000, 3200000, 15.8, 95.2, 'viral', 'UK', 'Rising UK drill artist taking the world by storm'),
            ('Ice Spice', 'bronx-drill', 2, 18000000, 380000000, 2800000, 22.3, 88.7, 'high', 'US', 'Bronx drill rapper with viral TikTok presence'),
            ('Yeat', 'rage-rap', 3, 12000000, 290000000, 1900000, 18.9, 82.1, 'high', 'US', 'Experimental rapper known for unique sound and style'),
            ('Destroy Lonely', 'opium', 4, 8500000, 180000000, 1200000, 25.1, 76.4, 'high', 'US', 'Rising star in the underground rap scene'),
            ('Ken Carson', 'rage-rap', 5, 7200000, 160000000, 980000, 20.7, 73.8, 'high', 'US', 'Part of the new wave of experimental hip-hop artists');
    END IF;
END $$;

-- Update existing records to have reasonable opportunity scores and trend momentum if they exist
UPDATE public.keywords 
SET opportunity_score = CASE 
    WHEN competition_score < 0.5 THEN RANDOM() * 30 + 70  -- Low competition = high opportunity
    WHEN competition_score < 0.8 THEN RANDOM() * 40 + 40  -- Medium competition = medium opportunity  
    ELSE RANDOM() * 30 + 20  -- High competition = lower opportunity
END
WHERE opportunity_score IS NULL OR opportunity_score = 0;

UPDATE public.trending_artists 
SET trend_momentum = CASE 
    WHEN growth_rate > 20 THEN RANDOM() * 20 + 80  -- High growth = high momentum
    WHEN growth_rate > 10 THEN RANDOM() * 30 + 50  -- Medium growth = medium momentum
    ELSE RANDOM() * 40 + 20  -- Low growth = lower momentum
END,
momentum_level = CASE 
    WHEN growth_rate > 20 THEN 'viral'
    WHEN growth_rate > 15 THEN 'high'
    WHEN growth_rate > 5 THEN 'medium'
    ELSE 'low'
END
WHERE trend_momentum IS NULL OR trend_momentum = 0;

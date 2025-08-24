import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateDatabaseSchema() {
  try {
    console.log('🔄 Checking database connection...');
    console.log('Using Supabase URL:', supabaseUrl.substring(0, 30) + '...');
    
    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('keywords')
      .select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.error('❌ Database connection failed:', testError);
      return;
    }
    
    console.log('✅ Database connection successful');
    
    // Check if we can insert sample data (this will help us see if columns exist)
    console.log('🔄 Testing if we can add sample keywords data...');
    
    const sampleKeywords = [
      {
        keyword: 'drake type beat',
        description: 'Popular hip-hop style beat inspired by Drake',
        search_volume: 125000,
        competition_score: 0.85,
        opportunity_score: 72.5,
        trend_direction: 'rising',
        genre: 'hip-hop',
        related_keywords: ['drake beats', 'ovo sound', 'toronto sound'],
        is_public: true
      },
      {
        keyword: 'lil baby type beat',
        description: 'Modern trap style beat inspired by Lil Baby',
        search_volume: 89000,
        competition_score: 0.78,
        opportunity_score: 68.9,
        trend_direction: 'stable',
        genre: 'trap',
        related_keywords: ['atlanta trap', 'melodic trap', 'lil baby beats'],
        is_public: true
      }
    ];

    const { data: keywordData, error: keywordError } = await supabase
      .from('keywords')
      .insert(sampleKeywords)
      .select();

    if (keywordError) {
      console.log('⚠️ Keywords insert failed (expected if columns missing):', keywordError.message);
    } else {
      console.log('✅ Sample keywords inserted successfully');
    }

    // Test trending artists
    console.log('🔄 Testing if we can add sample trending artists data...');
    
    const sampleArtists = [
      {
        name: 'Central Cee',
        genre: 'uk-drill',
        rank: 1,
        monthly_listeners: 25000000,
        view_count: 450000000,
        subscriber_count: 3200000,
        growth_rate: 15.8,
        trend_momentum: 95.2,
        momentum_level: 'viral',
        country: 'UK',
        bio: 'Rising UK drill artist taking the world by storm'
      },
      {
        name: 'Ice Spice',
        genre: 'bronx-drill',
        rank: 2,
        monthly_listeners: 18000000,
        view_count: 380000000,
        subscriber_count: 2800000,
        growth_rate: 22.3,
        trend_momentum: 88.7,
        momentum_level: 'high',
        country: 'US',
        bio: 'Bronx drill rapper with viral TikTok presence'
      }
    ];

    const { data: artistData, error: artistError } = await supabase
      .from('trending_artists')
      .insert(sampleArtists)
      .select();

    if (artistError) {
      console.log('⚠️ Artists insert failed (expected if columns missing):', artistError.message);
    } else {
      console.log('✅ Sample artists inserted successfully');
    }

    console.log('\n📋 Schema update summary:');
    console.log('- If you see column errors above, you need to add the missing columns in Supabase SQL editor');
    console.log('- Copy the SQL from database-schema-update.sql and run it in Supabase Dashboard > SQL Editor');
    console.log('- Then run this script again to populate with sample data');
    
  } catch (error) {
    console.error('❌ Error during schema update:', error);
  }
}

updateDatabaseSchema();

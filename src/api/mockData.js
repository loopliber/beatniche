// Add these fields to each mock keyword object:
export const mockKeywords = [
  {
    id: '1',
    keyword: 'trap beat',
    search_volume: 15000,
    competition_score: 0.75,
    trend_direction: 'rising',
    genre: 'hip-hop',
    opportunity_score: 85,
    trending_status: 'hot',
    difficulty_level: 'medium',
    avg_views: 25000,
    upload_frequency: 120,
    competition_level: 75,
    created_date: new Date().toISOString(),
    // ... rest of the fields
  },
  // Update all other mock keywords similarly
];

// Add these fields to each mock trending artist:
export const mockTrendingArtists = [
  {
    id: '1',
    name: 'Lil Baby',
    artist_name: 'Lil Baby', // Add this field
    competition_level: 'high',
    genre_primary: 'trap',
    breakout_potential: false,
    estimated_searches: 450000,
    trend_momentum: 85,
    collaboration_suggestions: ['Gunna', 'Future', 'Drake'],
    created_date: new Date().toISOString(),
    // ... rest of the fields
  },
  // Update all other mock artists similarly
];
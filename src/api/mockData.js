// Mock data for development and fallback
export const mockKeywords = [
  {
    id: '1',
    keyword: 'trap beat',
    search_volume: 15000,
    competition_score: 0.75,
    trend_direction: 'rising',
    genre: 'hip-hop',
    opportunity_score: 85,
    related_keywords: ['trap type beat', 'hard trap beat', 'dark trap beat'],
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    keyword: 'lofi hip hop',
    search_volume: 8500,
    competition_score: 0.45,
    trend_direction: 'stable',
    genre: 'lofi',
    opportunity_score: 92,
    related_keywords: ['lofi beats', 'chill beats', 'study beats'],
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    keyword: 'drill beat',
    search_volume: 12000,
    competition_score: 0.80,
    trend_direction: 'rising',
    genre: 'drill',
    opportunity_score: 78,
    related_keywords: ['uk drill beat', 'ny drill beat', 'hard drill beat'],
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    keyword: 'boom bap beat',
    search_volume: 6500,
    competition_score: 0.35,
    trend_direction: 'stable',
    genre: 'boom-bap',
    opportunity_score: 88,
    related_keywords: ['90s hip hop beat', 'old school beat', 'underground beat'],
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    keyword: 'afrobeat',
    search_volume: 9200,
    competition_score: 0.60,
    trend_direction: 'rising',
    genre: 'afrobeat',
    opportunity_score: 94,
    related_keywords: ['afrobeats instrumental', 'nigerian beats', 'amapiano beat'],
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

export const mockTrendingArtists = [
  {
    id: '1',
    name: 'Lil Baby',
    youtube_channel_id: 'UCk2wo8fNGPB2UCcSQZHFzLA',
    genre: 'trap',
    rank: 1,
    monthly_listeners: 45000000,
    view_count: 2500000000,
    subscriber_count: 8900000,
    growth_rate: 15.5,
    country: 'US',
    thumbnail_url: 'https://via.placeholder.com/150',
    trend_momentum: 95,
    opportunity_level: 'low',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Central Cee',
    youtube_channel_id: 'UCFq8WcaYWqwZXW0BjQPPzrQ',
    genre: 'drill',
    rank: 2,
    monthly_listeners: 12000000,
    view_count: 850000000,
    subscriber_count: 3200000,
    growth_rate: 45.2,
    country: 'UK',
    thumbnail_url: 'https://via.placeholder.com/150',
    trend_momentum: 88,
    opportunity_level: 'medium',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Burna Boy',
    youtube_channel_id: 'UCXqksyQmtqb0llrwblMIeGA',
    genre: 'afrobeat',
    rank: 3,
    monthly_listeners: 18000000,
    view_count: 1200000000,
    subscriber_count: 4500000,
    growth_rate: 25.8,
    country: 'NG',
    thumbnail_url: 'https://via.placeholder.com/150',
    trend_momentum: 82,
    opportunity_level: 'high',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Playboi Carti',
    youtube_channel_id: 'UCgpUQXc8LTmZQUqVhGE66lg',
    genre: 'experimental-hip-hop',
    rank: 4,
    monthly_listeners: 22000000,
    view_count: 1500000000,
    subscriber_count: 2800000,
    growth_rate: 8.3,
    country: 'US',
    thumbnail_url: 'https://via.placeholder.com/150',
    trend_momentum: 76,
    opportunity_level: 'low',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Bad Bunny',
    youtube_channel_id: 'UCmBA_wu8xGg1OfOkfW13Q0Q',
    genre: 'reggaeton',
    rank: 5,
    monthly_listeners: 58000000,
    view_count: 15000000000,
    subscriber_count: 48000000,
    growth_rate: 12.1,
    country: 'PR',
    thumbnail_url: 'https://via.placeholder.com/150',
    trend_momentum: 90,
    opportunity_level: 'low',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

export const mockVideoAnalytics = [
  {
    id: '1',
    video_id: 'dQw4w9WgXcQ',
    title: 'Travis Scott Type Beat - "Astroworld"',
    channel_title: 'ProdByBeats',
    view_count: 1250000,
    like_count: 45000,
    comment_count: 2800,
    published_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['travis scott', 'type beat', 'trap', 'astroworld', 'hip hop'],
    category_id: '10'
  },
  {
    id: '2',
    video_id: 'abc123xyz',
    title: '[FREE] Lil Baby x Future Type Beat - "Dreams"',
    channel_title: 'BeatMaker2024',
    view_count: 890000,
    like_count: 32000,
    comment_count: 1950,
    published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['lil baby', 'future', 'type beat', 'trap', 'free beat'],
    category_id: '10'
  }
];

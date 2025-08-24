const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

if (!YOUTUBE_API_KEY) {
  console.warn('YouTube API key not found. Using mock data for development.');
}

// Mock data for when API is unavailable
const mockData = {
  searchVideos: {
    items: [
      {
        id: { videoId: 'mock1' },
        snippet: {
          title: 'Travis Scott Type Beat "ASTROWORLD" | Dark Trap Instrumental 2024',
          description: 'Free Travis Scott type beat for non-profit use. Contact for exclusive rights.',
          channelTitle: 'BeatMaker Pro',
          publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          thumbnails: { medium: { url: 'https://i.ytimg.com/vi/mock1/mqdefault.jpg' } }
        },
        statistics: {
          viewCount: Math.floor(Math.random() * 100000) + 10000,
          likeCount: Math.floor(Math.random() * 5000) + 500,
          commentCount: Math.floor(Math.random() * 200) + 20
        }
      },
      {
        id: { videoId: 'mock2' },
        snippet: {
          title: 'Central Cee Type Beat "LONDON" | UK Drill Instrumental',
          description: 'Hard UK drill beat in the style of Central Cee. Free for non-profit.',
          channelTitle: 'UK Beats',
          publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          thumbnails: { medium: { url: 'https://i.ytimg.com/vi/mock2/mqdefault.jpg' } }
        },
        statistics: {
          viewCount: Math.floor(Math.random() * 150000) + 20000,
          likeCount: Math.floor(Math.random() * 8000) + 800,
          commentCount: Math.floor(Math.random() * 300) + 50
        }
      },
      {
        id: { videoId: 'mock3' },
        snippet: {
          title: 'Drake Type Beat "VIEWS" | Melodic Rap Instrumental 2024',
          description: 'Smooth melodic beat inspired by Drake. Perfect for emotional rap songs.',
          channelTitle: 'MelodyBeats',
          publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          thumbnails: { medium: { url: 'https://i.ytimg.com/vi/mock3/mqdefault.jpg' } }
        },
        statistics: {
          viewCount: Math.floor(Math.random() * 200000) + 30000,
          likeCount: Math.floor(Math.random() * 10000) + 1000,
          commentCount: Math.floor(Math.random() * 400) + 80
        }
      },
      {
        id: { videoId: 'mock4' },
        snippet: {
          title: 'Yeat Type Beat "TURBAN" | Hyperpop Rage Beat',
          description: 'Experimental rage beat in Yeat style. Hard 808s and distorted sounds.',
          channelTitle: 'RageProducer',
          publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          thumbnails: { medium: { url: 'https://i.ytimg.com/vi/mock4/mqdefault.jpg' } }
        },
        statistics: {
          viewCount: Math.floor(Math.random() * 80000) + 5000,
          likeCount: Math.floor(Math.random() * 4000) + 300,
          commentCount: Math.floor(Math.random() * 150) + 15
        }
      },
      {
        id: { videoId: 'mock5' },
        snippet: {
          title: 'Lil Baby Type Beat "HEAT" | Trap Instrumental',
          description: 'Bouncy trap beat perfect for melodic rap. Free download in description.',
          channelTitle: 'TrapBeats24',
          publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          thumbnails: { medium: { url: 'https://i.ytimg.com/vi/mock5/mqdefault.jpg' } }
        },
        statistics: {
          viewCount: Math.floor(Math.random() * 120000) + 15000,
          likeCount: Math.floor(Math.random() * 6000) + 600,
          commentCount: Math.floor(Math.random() * 250) + 40
        }
      }
    ]
  }
};

class YouTubeAPI {
  constructor() {
    this.apiKey = YOUTUBE_API_KEY;
    this.baseUrl = YOUTUBE_API_BASE_URL;
    this.useMockData = false;
  }

  async makeRequest(endpoint, params = {}) {
    // If already using mock data, don't make real API calls
    if (this.useMockData) {
      return this.getMockData(endpoint, params);
    }

    if (!this.apiKey) {
      console.warn('No YouTube API key found, using mock data');
      this.useMockData = true;
      return this.getMockData(endpoint, params);
    }

    const url = new URL(`${this.baseUrl}/${endpoint}`);
    url.searchParams.append('key', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn('YouTube API quota exceeded or access denied, switching to mock data');
          this.useMockData = true;
          return this.getMockData(endpoint, params);
        }
        throw new Error(`YouTube API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('YouTube API request failed:', error);
      console.warn('Falling back to mock data');
      this.useMockData = true;
      return this.getMockData(endpoint, params);
    }
  }

  getMockData(endpoint, params) {
    console.log('🎭 Using mock data for YouTube API');
    
    if (endpoint === 'search') {
      // Generate more realistic mock data based on search query
      const query = params.q || '';
      const maxResults = parseInt(params.maxResults) || 25;
      
      const artistTypes = ['Travis Scott', 'Central Cee', 'Drake', 'Yeat', 'Lil Baby', 'Future', 'Playboi Carti', 'Juice WRLD', 'Pop Smoke', 'Gunna'];
      const beatTypes = ['Dark', 'Melodic', 'Hard', 'Bouncy', 'Emotional', 'Aggressive', 'Smooth', 'Hyperpop', 'Drill', 'Trap'];
      const instruments = ['808s', 'Piano', 'Guitar', 'Synth', 'Strings', 'Flute', 'Bells'];
      
      const items = [];
      for (let i = 0; i < Math.min(maxResults, 20); i++) {
        const artist = artistTypes[Math.floor(Math.random() * artistTypes.length)];
        const beatType = beatTypes[Math.floor(Math.random() * beatTypes.length)];
        const instrument = instruments[Math.floor(Math.random() * instruments.length)];
        
        items.push({
          id: { videoId: `mock${i + 1}` },
          snippet: {
            title: `${artist} Type Beat "${beatType.toUpperCase()}" | ${beatType} ${instrument} Instrumental 2024`,
            description: `Free ${artist} type beat for non-profit use. ${beatType} vibes with ${instrument.toLowerCase()}. Contact for exclusive rights.`,
            channelTitle: `${beatType}Beats${Math.floor(Math.random() * 100)}`,
            publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            thumbnails: { 
              medium: { url: `https://i.ytimg.com/vi/mock${i + 1}/mqdefault.jpg` } 
            }
          },
          statistics: {
            viewCount: Math.floor(Math.random() * 500000) + 1000,
            likeCount: Math.floor(Math.random() * 25000) + 100,
            commentCount: Math.floor(Math.random() * 1000) + 10
          }
        });
      }
      
      return { items };
    }
    
    if (endpoint === 'videos') {
      // Return mock video details
      const items = [];
      const ids = params.id ? params.id.split(',') : [];
      
      ids.forEach((id, index) => {
        items.push({
          id: id,
          snippet: {
            title: `Mock Video ${index + 1}`,
            description: 'Mock video description',
            channelTitle: `MockChannel${index + 1}`,
            publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          statistics: {
            viewCount: Math.floor(Math.random() * 500000) + 1000,
            likeCount: Math.floor(Math.random() * 25000) + 100,
            commentCount: Math.floor(Math.random() * 1000) + 10
          }
        });
      });
      
      return { items };
    }
    
    return mockData.searchVideos;
  }

  // Reset API state - useful for testing or when quotas reset
  resetToRealAPI() {
    this.useMockData = false;
    console.log('🔄 YouTube API reset to use real API calls');
  }

  // Search for videos
  async searchVideos(query, options = {}) {
    const params = {
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: options.maxResults || 25,
      order: options.order || 'relevance',
      publishedAfter: options.publishedAfter,
      publishedBefore: options.publishedBefore,
      channelId: options.channelId,
      ...options
    };

    return this.makeRequest('search', params);
  }

  // Get video details
  async getVideoDetails(videoIds) {
    const ids = Array.isArray(videoIds) ? videoIds.join(',') : videoIds;
    
    const params = {
      part: 'snippet,statistics,contentDetails',
      id: ids
    };

    return this.makeRequest('videos', params);
  }

  // Search for channels
  async searchChannels(query, options = {}) {
    const params = {
      part: 'snippet,statistics',
      q: query,
      type: 'channel',
      maxResults: options.maxResults || 25,
      order: options.order || 'relevance',
      ...options
    };

    return this.makeRequest('search', params);
  }

  // Get channel details
  async getChannelDetails(channelIds) {
    const ids = Array.isArray(channelIds) ? channelIds.join(',') : channelIds;
    
    const params = {
      part: 'snippet,statistics,contentDetails',
      id: ids
    };

    return this.makeRequest('channels', params);
  }

  // Get trending videos in music category
  async getTrendingMusic(regionCode = 'US', maxResults = 50) {
    const params = {
      part: 'snippet,statistics',
      chart: 'mostPopular',
      regionCode,
      videoCategoryId: '10', // Music category
      maxResults
    };

    return this.makeRequest('videos', params);
  }

  // Get video comments
  async getVideoComments(videoId, options = {}) {
    const params = {
      part: 'snippet',
      videoId,
      maxResults: options.maxResults || 100,
      order: options.order || 'relevance',
      ...options
    };

    return this.makeRequest('commentThreads', params);
  }

  // Search for playlists
  async searchPlaylists(query, options = {}) {
    const params = {
      part: 'snippet',
      q: query,
      type: 'playlist',
      maxResults: options.maxResults || 25,
      ...options
    };

    return this.makeRequest('search', params);
  }
}

export const youtubeAPI = new YouTubeAPI();

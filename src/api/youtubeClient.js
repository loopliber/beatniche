const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

if (!YOUTUBE_API_KEY) {
  console.warn('YouTube API key not found. Some features may not work.');
}

class YouTubeAPI {
  constructor() {
    this.apiKey = YOUTUBE_API_KEY;
    this.baseUrl = YOUTUBE_API_BASE_URL;
  }

  async makeRequest(endpoint, params = {}) {
    if (!this.apiKey) {
      throw new Error('YouTube API key is required');
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
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('YouTube API request failed:', error);
      throw error;
    }
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

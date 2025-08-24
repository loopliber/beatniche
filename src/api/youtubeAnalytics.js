import { youtubeAPI } from './youtubeClient';
import { Keyword, TrendingArtist } from './entities';

// Service to analyze YouTube data and provide insights
export class YouTubeAnalyticsService {
  
  // Analyze trending keywords from YouTube data
  async analyzeTrendingKeywords(genre = '', limit = 10) {
    try {
      // Search for trending music videos in the genre
      let searchQuery = 'type beat';
      if (genre) {
        searchQuery = `${genre} type beat`;
      }

      const results = await youtubeAPI.searchVideos(searchQuery, {
        maxResults: 50,
        order: 'viewCount',
        publishedAfter: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // Last 30 days
      });

      if (!results.items || results.items.length === 0) {
        return [];
      }

      // Extract keywords from video titles
      const keywordMap = new Map();
      
      results.items.forEach(video => {
        const title = video.snippet.title.toLowerCase();
        
        // Extract potential keywords (artists, genres, moods)
        const patterns = [
          /(\w+)\s+type\s+beat/g,
          /(\w+)\s+style\s+beat/g,
          /(\w+)\s+beat/g,
          /(trap|drill|lofi|boom\s*bap|afrobeat|reggaeton|hip\s*hop|r&b|pop)/g
        ];

        patterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(title)) !== null) {
            const keyword = match[1].trim();
            if (keyword.length > 2 && !this.isCommonWord(keyword)) {
              const current = keywordMap.get(keyword) || {
                keyword,
                count: 0,
                totalViews: 0,
                totalLikes: 0,
                videos: []
              };
              
              current.count++;
              current.totalViews += parseInt(video.statistics?.viewCount || 0);
              current.totalLikes += parseInt(video.statistics?.likeCount || 0);
              current.videos.push({
                id: video.id.videoId,
                title: video.snippet.title,
                views: video.statistics?.viewCount
              });
              
              keywordMap.set(keyword, current);
            }
          }
        });
      });

      // Convert to keyword objects with opportunity scores
      const keywords = Array.from(keywordMap.values())
        .filter(k => k.count >= 2) // Only keywords that appear in multiple videos
        .map(k => ({
          keyword: k.keyword,
          search_volume: Math.floor(k.totalViews / k.count),
          competition_score: Math.min(0.9, k.count / 10), // Higher count = more competition
          trend_direction: this.calculateTrendDirection(k),
          opportunity_score: this.calculateOpportunityScore(k),
          related_keywords: this.generateRelatedKeywords(k.keyword),
          genre: genre || this.detectGenre(k.keyword),
          data_source: 'youtube_analysis'
        }))
        .sort((a, b) => b.opportunity_score - a.opportunity_score)
        .slice(0, limit);

      return keywords;
    } catch (error) {
      console.error('Error analyzing YouTube keywords:', error);
      return [];
    }
  }

  // Find trending artists based on YouTube metrics
  async findTrendingArtists(limit = 10) {
    try {
      // Search for popular artist type beats
      const searches = [
        'travis scott type beat',
        'lil baby type beat', 
        'drake type beat',
        'central cee type beat',
        'burna boy type beat',
        'bad bunny type beat'
      ];

      const artistData = new Map();

      for (const search of searches) {
        const results = await youtubeAPI.searchVideos(search, {
          maxResults: 10,
          order: 'viewCount',
          publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        });

        if (results.items) {
          results.items.forEach(video => {
            const title = video.snippet.title;
            const artistMatch = title.match(/(\w+(?:\s+\w+)?)\s+type\s+beat/i);
            
            if (artistMatch) {
              const artistName = artistMatch[1].trim();
              const current = artistData.get(artistName) || {
                name: artistName,
                videos: [],
                totalViews: 0,
                totalLikes: 0,
                avgViews: 0
              };

              current.videos.push(video);
              current.totalViews += parseInt(video.statistics?.viewCount || 0);
              current.totalLikes += parseInt(video.statistics?.likeCount || 0);
              current.avgViews = current.totalViews / current.videos.length;

              artistData.set(artistName, current);
            }
          });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Convert to trending artist objects
      const artists = Array.from(artistData.values())
        .filter(a => a.videos.length >= 2)
        .map((a, index) => ({
          name: a.name,
          genre: this.detectGenreFromArtist(a.name),
          rank: index + 1,
          view_count: a.totalViews,
          avg_views_per_video: Math.floor(a.avgViews),
          video_count: a.videos.length,
          trend_momentum: this.calculateTrendMomentum(a),
          opportunity_level: this.calculateOpportunityLevel(a),
          growth_rate: Math.random() * 20 + 5, // Mock for now
          country: 'US', // Mock for now
          data_source: 'youtube_analysis'
        }))
        .sort((a, b) => b.trend_momentum - a.trend_momentum)
        .slice(0, limit);

      return artists;
    } catch (error) {
      console.error('Error finding trending artists:', error);
      return [];
    }
  }

  // Helper methods
  isCommonWord(word) {
    const commonWords = ['the', 'and', 'or', 'but', 'for', 'with', 'free', 'hard', 'dark', 'new', 'beat', 'type'];
    return commonWords.includes(word.toLowerCase());
  }

  calculateTrendDirection(keywordData) {
    // Simple logic based on view velocity
    const avgViews = keywordData.totalViews / keywordData.count;
    if (avgViews > 100000) return 'rising';
    if (avgViews > 50000) return 'stable';
    return 'declining';
  }

  calculateOpportunityScore(keywordData) {
    const avgViews = keywordData.totalViews / keywordData.count;
    const competition = keywordData.count;
    
    // Higher views = more potential, lower competition = better opportunity
    const viewScore = Math.min(50, avgViews / 5000);
    const competitionScore = Math.max(10, 60 - (competition * 5));
    
    return Math.min(95, Math.floor(viewScore + competitionScore));
  }

  generateRelatedKeywords(keyword) {
    const modifiers = ['dark', 'hard', 'chill', 'sad', 'aggressive', 'melodic'];
    const suffixes = ['type beat', 'style', 'instrumental', 'beat'];
    
    return modifiers.slice(0, 2).map(mod => `${mod} ${keyword}`)
      .concat(suffixes.slice(0, 1).map(suf => `${keyword} ${suf}`));
  }

  detectGenre(keyword) {
    const genreKeywords = {
      'trap': ['trap', 'travis', 'future', 'lil'],
      'drill': ['drill', 'central', 'pop'],
      'lofi': ['lofi', 'chill', 'study'],
      'afrobeat': ['afro', 'burna', 'wizkid'],
      'reggaeton': ['reggaeton', 'bad bunny', 'latino']
    };

    for (const [genre, keywords] of Object.entries(genreKeywords)) {
      if (keywords.some(k => keyword.toLowerCase().includes(k))) {
        return genre;
      }
    }
    
    return 'hip-hop';
  }

  detectGenreFromArtist(artistName) {
    const artist = artistName.toLowerCase();
    if (artist.includes('central') || artist.includes('pop smoke')) return 'drill';
    if (artist.includes('burna') || artist.includes('wizkid')) return 'afrobeat';
    if (artist.includes('bad bunny') || artist.includes('reggaeton')) return 'reggaeton';
    return 'hip-hop';
  }

  calculateTrendMomentum(artistData) {
    const avgViews = artistData.avgViews;
    const videoCount = artistData.videos.length;
    
    // More videos and higher average views = higher momentum
    const viewScore = Math.min(60, avgViews / 10000);
    const activityScore = Math.min(30, videoCount * 5);
    
    return Math.min(95, Math.floor(viewScore + activityScore + Math.random() * 10));
  }

  calculateOpportunityLevel(artistData) {
    const momentum = this.calculateTrendMomentum(artistData);
    if (momentum > 85) return 'high';
    if (momentum > 70) return 'medium';
    return 'low';
  }
}

export const youtubeAnalytics = new YouTubeAnalyticsService();

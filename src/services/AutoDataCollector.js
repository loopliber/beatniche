// Automated Data Collection Service
// This service runs in the background to continuously update trending data

import { youtubeAPI } from '../api/youtubeClient';
import { TrendingArtist, Keyword } from '../api/entities';

class AutoDataCollector {
  constructor() {
    this.isRunning = false;
    this.lastRun = null;
    this.intervalId = null;
    this.collectionQueue = [];
    this.isProcessing = false;
  }

  async start() {
    if (this.isRunning) {
      console.log('AutoDataCollector is already running');
      return;
    }
    
    this.isRunning = true;
    console.log('🚀 Starting AutoDataCollector...');
    
    // Run immediately
    this.collectData();
    
    // Then run every 2 hours
    this.intervalId = setInterval(() => {
      this.collectData();
    }, 2 * 60 * 60 * 1000); // 2 hours
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('⏹️ AutoDataCollector stopped');
  }

  async collectData() {
    if (this.isProcessing) {
      console.log('⏳ Data collection already in progress...');
      return;
    }

    this.isProcessing = true;
    console.log('🔄 Starting automated data collection...');
    
    try {
      // 1. Collect trending artists from YouTube
      await this.collectTrendingArtists();
      
      // 2. Collect trending keywords
      await this.collectTrendingKeywords();
      
      // 3. Update competition metrics
      await this.updateCompetitionMetrics();
      
      // 4. Analyze breakout potential
      await this.analyzeBreakoutPotential();
      
      this.lastRun = new Date();
      console.log('✅ Data collection completed successfully');
      
      // Emit event for UI to refresh
      this.notifyDataUpdate();
      
    } catch (error) {
      console.error('❌ Data collection failed:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async collectTrendingArtists() {
    console.log('📊 Collecting trending artists...');
    
    try {
      const searchQueries = [
        'type beat 2024 trending',
        'viral type beat',
        'most viewed type beat this week',
        'new type beat 2024',
        'hot type beat',
        'popular producer beats',
        'trending hip hop beats',
        'drill type beat trending'
      ];

      const artistAnalytics = new Map();

      for (const query of searchQueries) {
        try {
          const results = await youtubeAPI.searchVideos(query, {
            maxResults: 30,
            order: 'viewCount',
            publishedAfter: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
          });

          // Extract and analyze artist data
          this.processVideoResults(results.items, artistAnalytics);
          
          // Add delay to respect rate limits
          await this.delay(1000);
          
        } catch (error) {
          console.warn(`Error searching "${query}":`, error);
        }
      }

      // Process and save trending artists
      const trendingArtists = this.processTrendingArtists(artistAnalytics);
      
      for (const artist of trendingArtists.slice(0, 15)) {
        try {
          await TrendingArtist.create(artist);
          console.log(`✅ Saved trending artist: ${artist.name}`);
        } catch (error) {
          // Silently handle duplicates or errors
          console.log(`ℹ️ Artist ${artist.name} already exists or failed to save`);
        }
      }

      console.log(`📈 Processed ${trendingArtists.length} trending artists`);
      
    } catch (error) {
      console.error('Error collecting trending artists:', error);
    }
  }

  async collectTrendingKeywords() {
    console.log('🎯 Collecting trending keywords...');
    
    try {
      const baseKeywords = [
        'drake', 'travis scott', 'lil baby', 'future', 'playboi carti',
        'juice wrld', 'young thug', 'gunna', 'lil uzi', 'pop smoke',
        'central cee', 'ice spice', 'yeat', 'ken carson'
      ];

      const keywordAnalytics = new Map();

      for (const baseKeyword of baseKeywords) {
        try {
          const searchTerm = `${baseKeyword} type beat`;
          const results = await youtubeAPI.searchVideos(searchTerm, {
            maxResults: 25,
            order: 'relevance',
            publishedAfter: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          });

          if (results.items && results.items.length > 0) {
            const videoIds = results.items.map(item => item.id.videoId).filter(Boolean);
            if (videoIds.length > 0) {
              const videoDetails = await youtubeAPI.getVideoDetails(videoIds);
              
              const analysis = this.analyzeKeywordPerformance(searchTerm, videoDetails.items);
              keywordAnalytics.set(searchTerm, analysis);
            }
          }

          await this.delay(800);
          
        } catch (error) {
          console.warn(`Error analyzing keyword "${baseKeyword}":`, error);
        }
      }

      // Save keyword analytics
      for (const [keyword, analysis] of keywordAnalytics) {
        try {
          await Keyword.create({
            keyword: keyword,
            search_volume: analysis.estimatedSearchVolume,
            competition_score: analysis.competitionScore,
            opportunity_score: analysis.opportunityScore,
            trend_direction: analysis.trendDirection,
            genre: this.detectGenre(keyword),
            related_keywords: analysis.relatedKeywords,
            is_public: true,
            avg_views: analysis.avgViews,
            video_count: analysis.videoCount
          });
          console.log(`✅ Saved keyword analysis: ${keyword}`);
        } catch (error) {
          console.log(`ℹ️ Keyword ${keyword} already exists or failed to save`);
        }
      }

      console.log(`🎯 Processed ${keywordAnalytics.size} keyword analyses`);
      
    } catch (error) {
      console.error('Error collecting trending keywords:', error);
    }
  }

  async updateCompetitionMetrics() {
    console.log('🔄 Updating competition metrics...');
    
    try {
      // Get existing keywords that need updates
      const existingKeywords = await Keyword.list('-created_at', 20);
      
      for (const keyword of existingKeywords) {
        try {
          // Get fresh data for this keyword
          const results = await youtubeAPI.searchVideos(keyword.keyword, {
            maxResults: 20,
            order: 'relevance',
            publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          });

          if (results.items && results.items.length > 0) {
            const videoIds = results.items.map(item => item.id.videoId).filter(Boolean);
            const videoDetails = await youtubeAPI.getVideoDetails(videoIds);
            
            const updatedMetrics = this.calculateUpdatedMetrics(videoDetails.items);
            
            // Update the keyword with fresh metrics
            await Keyword.update(keyword.id, {
              competition_score: updatedMetrics.competitionScore,
              opportunity_score: updatedMetrics.opportunityScore,
              search_volume: updatedMetrics.estimatedSearchVolume,
              last_updated: new Date().toISOString()
            });
            
            console.log(`✅ Updated metrics for: ${keyword.keyword}`);
          }

          await this.delay(1200);
          
        } catch (error) {
          console.warn(`Error updating keyword "${keyword.keyword}":`, error);
        }
      }
      
    } catch (error) {
      console.error('Error updating competition metrics:', error);
    }
  }

  async analyzeBreakoutPotential() {
    console.log('🌟 Analyzing breakout potential...');
    
    try {
      // Get recent artists data
      const recentArtists = await TrendingArtist.list('-created_at', 30);
      
      for (const artist of recentArtists) {
        try {
          // Analyze growth patterns and social signals
          const breakoutScore = this.calculateBreakoutScore(artist);
          
          if (breakoutScore !== artist.breakout_potential) {
            await TrendingArtist.update(artist.id, {
              breakout_potential: breakoutScore > 70,
              trend_momentum: Math.min(95, artist.trend_momentum + (breakoutScore - 50) / 10),
              last_updated: new Date().toISOString()
            });
            
            console.log(`✅ Updated breakout potential for: ${artist.name} (Score: ${breakoutScore})`);
          }
          
        } catch (error) {
          console.warn(`Error analyzing breakout for "${artist.name}":`, error);
        }
      }
      
    } catch (error) {
      console.error('Error analyzing breakout potential:', error);
    }
  }

  // Helper methods
  processVideoResults(videos, artistAnalytics) {
    videos?.forEach(video => {
      const title = video.snippet.title.toLowerCase();
      const views = parseInt(video.statistics?.viewCount || 0);
      const likes = parseInt(video.statistics?.likeCount || 0);
      
      // Extract artist names using multiple patterns
      const patterns = [
        /(\w+(?:\s+\w+)?)\s+type\s+beat/gi,
        /(\w+(?:\s+\w+)?)\s+x\s+(\w+(?:\s+\w+)?)\s+type\s+beat/gi
      ];

      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(title)) !== null) {
          const artistName = (match[1] || match[2])?.trim();
          if (artistName && artistName.length > 2) {
            const key = artistName.toLowerCase();
            
            if (!artistAnalytics.has(key)) {
              artistAnalytics.set(key, {
                name: artistName,
                totalViews: 0,
                totalLikes: 0,
                videoCount: 0,
                channelCount: new Set(),
                avgEngagement: 0,
                recentVideos: []
              });
            }
            
            const data = artistAnalytics.get(key);
            data.totalViews += views;
            data.totalLikes += likes;
            data.videoCount++;
            data.channelCount.add(video.snippet.channelTitle);
            data.recentVideos.push({
              title: video.snippet.title,
              views,
              publishedAt: video.snippet.publishedAt
            });
          }
        }
      });
    });
  }

  processTrendingArtists(artistAnalytics) {
    return Array.from(artistAnalytics.values())
      .filter(artist => artist.videoCount >= 3 && artist.channelCount.size >= 2)
      .map(artist => {
        const avgViews = artist.totalViews / artist.videoCount;
        const engagement = artist.totalViews > 0 ? (artist.totalLikes / artist.totalViews) * 100 : 0;
        const momentum = this.calculateMomentum(artist);
        
        return {
          name: artist.name,
          artist_name: artist.name,
          trend_momentum: Math.round(momentum),
          competition_level: this.calculateCompetitionLevel(artist.videoCount),
          genre_primary: this.detectGenre(artist.name),
          estimated_searches: Math.floor(artist.totalViews / 1000),
          breakout_potential: momentum > 75 && avgViews > 100000,
          monthly_listeners: Math.floor(avgViews * 20),
          view_count: artist.totalViews,
          growth_rate: Math.min(50, momentum / 2),
          country: 'US',
          video_count: artist.videoCount,
          channel_count: artist.channelCount.size,
          avg_engagement: Math.round(engagement * 100) / 100,
          created_date: new Date().toISOString()
        };
      })
      .sort((a, b) => b.trend_momentum - a.trend_momentum);
  }

  analyzeKeywordPerformance(keyword, videos) {
    const totalViews = videos.reduce((sum, v) => sum + parseInt(v.statistics?.viewCount || 0), 0);
    const avgViews = totalViews / videos.length;
    const totalLikes = videos.reduce((sum, v) => sum + parseInt(v.statistics?.likeCount || 0), 0);
    const engagement = totalViews > 0 ? (totalLikes / totalViews) * 100 : 0;
    
    const competitionScore = Math.min(1, videos.length / 20);
    const opportunityScore = Math.max(0, Math.min(100, 
      (Math.log10(avgViews) * 10) + 
      (engagement * 5) - 
      (competitionScore * 30)
    ));

    return {
      estimatedSearchVolume: Math.floor(avgViews / 100),
      competitionScore: Math.round(competitionScore * 100) / 100,
      opportunityScore: Math.round(opportunityScore),
      trendDirection: this.analyzeTrendDirection(videos),
      relatedKeywords: this.extractRelatedKeywords(videos),
      avgViews: Math.floor(avgViews),
      videoCount: videos.length,
      avgEngagement: Math.round(engagement * 100) / 100
    };
  }

  calculateUpdatedMetrics(videos) {
    return this.analyzeKeywordPerformance('', videos);
  }

  calculateMomentum(artist) {
    const viewFactor = Math.min(40, Math.log10(artist.totalViews / artist.videoCount) * 5);
    const countFactor = Math.min(30, artist.videoCount * 2);
    const channelFactor = Math.min(20, artist.channelCount.size * 4);
    const engagementFactor = Math.min(10, (artist.totalLikes / artist.totalViews) * 1000);
    
    return Math.max(20, viewFactor + countFactor + channelFactor + engagementFactor);
  }

  calculateCompetitionLevel(videoCount) {
    if (videoCount > 20) return 'high';
    if (videoCount > 10) return 'medium';
    return 'low';
  }

  calculateBreakoutScore(artist) {
    const momentumScore = artist.trend_momentum || 0;
    const growthScore = artist.growth_rate || 0;
    const engagementScore = artist.avg_engagement || 0;
    
    return Math.round((momentumScore * 0.5) + (growthScore * 0.3) + (engagementScore * 0.2));
  }

  detectGenre(name) {
    const lowerName = name.toLowerCase();
    const genrePatterns = {
      'drill': ['drill', 'central cee', 'pop smoke', 'fivio', 'sheff g'],
      'trap': ['lil baby', 'gunna', 'future', 'young thug', 'travis scott'],
      'uk-drill': ['central cee', 'headie one', 'digga d'],
      'bronx-drill': ['ice spice', 'kay flock'],
      'rage-rap': ['yeat', 'ken carson', 'destroy lonely'],
      'melodic-rap': ['juice wrld', 'lil uzi', 'trippie redd']
    };
    
    for (const [genre, keywords] of Object.entries(genrePatterns)) {
      if (keywords.some(keyword => lowerName.includes(keyword))) {
        return genre;
      }
    }
    return 'hip-hop';
  }

  analyzeTrendDirection(videos) {
    // Simple trend analysis based on publish dates and views
    const recent = videos.filter(v => 
      new Date(v.snippet.publishedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    
    if (recent.length > videos.length * 0.6) return 'rising';
    if (recent.length < videos.length * 0.2) return 'falling';
    return 'stable';
  }

  extractRelatedKeywords(videos) {
    const keywords = new Set();
    videos.forEach(video => {
      const title = video.snippet.title.toLowerCase();
      const matches = title.match(/\b\w+\s+type\s+beat\b/g);
      matches?.forEach(match => keywords.add(match));
    });
    return Array.from(keywords).slice(0, 5);
  }

  notifyDataUpdate() {
    // Emit custom event for UI components to listen to
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dataUpdated', {
        detail: {
          timestamp: new Date().toISOString(),
          lastRun: this.lastRun
        }
      }));
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      isProcessing: this.isProcessing,
      lastRun: this.lastRun,
      queueLength: this.collectionQueue.length
    };
  }
}

// Create singleton instance
export const autoDataCollector = new AutoDataCollector();

// Auto-start in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Start with a delay to allow app to initialize
  setTimeout(() => {
    autoDataCollector.start();
  }, 5000);
}

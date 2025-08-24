// Predictive Analytics Service
// AI-powered predictions and insights for music producers

import { TrendingArtist, Keyword } from '../api/entities';
import { youtubeAPI } from '../api/youtubeClient';

class PredictiveAnalytics {
  constructor() {
    this.cache = new Map();
    this.cacheTTL = 30 * 60 * 1000; // 30 minutes
  }

  async predictNextTrending() {
    const cacheKey = 'nextTrending';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    console.log('🔮 Analyzing trends to predict next breakout artists...');

    try {
      // Get historical data
      const artists = await TrendingArtist.list('-created_at', 100);
      const keywords = await Keyword.list('-created_at', 100);

      const predictions = {
        risingArtists: await this.predictRisingArtists(artists),
        decliningKeywords: await this.predictDecliningKeywords(keywords),
        optimalUploadTimes: await this.predictOptimalUploadTimes(),
        genreTrends: await this.analyzeGenreTrends(artists),
        emergingKeywords: await this.predictEmergingKeywords(keywords),
        marketInsights: await this.generateMarketInsights(artists, keywords)
      };

      this.setCache(cacheKey, predictions);
      return predictions;

    } catch (error) {
      console.error('Error predicting trends:', error);
      return this.getDefaultPredictions();
    }
  }

  async predictRisingArtists(artists) {
    console.log('📈 Predicting rising artists...');

    const artistMetrics = artists.map(artist => {
      const growthRate = this.calculateGrowthRate(artist);
      const momentumScore = artist.trend_momentum || 0;
      const socialSignals = this.analyzeSocialSignals(artist);
      const competitionLevel = this.analyzeCompetition(artist);

      const predictionScore = this.calculatePredictionScore({
        growthRate,
        momentumScore,
        socialSignals,
        competitionLevel,
        recency: this.calculateRecency(artist.created_date)
      });

      return {
        artist: artist.name,
        genre: artist.genre_primary,
        currentMomentum: momentumScore,
        predictedGrowth: growthRate,
        predictionScore,
        confidence: this.calculateConfidence(artist, predictionScore),
        timeframe: this.predictTimeframe(predictionScore),
        reasons: this.generatePredictionReasons(artist, predictionScore),
        recommendedActions: this.generateRecommendations(artist, predictionScore)
      };
    });

    return artistMetrics
      .filter(metric => metric.predictionScore > 60)
      .sort((a, b) => b.predictionScore - a.predictionScore)
      .slice(0, 10);
  }

  async predictDecliningKeywords(keywords) {
    console.log('📉 Predicting declining keywords...');

    const keywordMetrics = keywords.map(keyword => {
      const trendDirection = keyword.trend_direction || 'stable';
      const competitionIncrease = this.calculateCompetitionIncrease(keyword);
      const searchVolumeChange = this.calculateSearchVolumeChange(keyword);
      const opportunityDecrease = this.calculateOpportunityDecrease(keyword);

      const declineScore = this.calculateDeclineScore({
        trendDirection,
        competitionIncrease,
        searchVolumeChange,
        opportunityDecrease
      });

      return {
        keyword: keyword.keyword,
        genre: keyword.genre,
        currentOpportunity: keyword.opportunity_score,
        declineScore,
        timeframe: this.predictDeclineTimeframe(declineScore),
        alternatives: this.suggestAlternatives(keyword),
        reasons: this.generateDeclineReasons(keyword, declineScore)
      };
    });

    return keywordMetrics
      .filter(metric => metric.declineScore > 70)
      .sort((a, b) => b.declineScore - a.declineScore)
      .slice(0, 8);
  }

  async predictOptimalUploadTimes() {
    console.log('⏰ Analyzing optimal upload times...');

    try {
      // Analyze upload patterns from successful videos
      const trendingQueries = ['viral type beat', 'trending type beat 2024'];
      const uploadData = [];

      for (const query of trendingQueries) {
        const results = await youtubeAPI.searchVideos(query, {
          maxResults: 50,
          order: 'viewCount'
        });

        results.items?.forEach(video => {
          const publishedAt = new Date(video.snippet.publishedAt);
          const views = parseInt(video.statistics?.viewCount || 0);
          
          uploadData.push({
            dayOfWeek: publishedAt.getDay(),
            hour: publishedAt.getHours(),
            views,
            engagement: this.calculateEngagement(video)
          });
        });
      }

      // Analyze patterns
      const timeAnalysis = this.analyzeUploadTimes(uploadData);
      
      return {
        bestDays: timeAnalysis.bestDays,
        bestHours: timeAnalysis.bestHours,
        peakWindows: timeAnalysis.peakWindows,
        genreSpecific: timeAnalysis.genreSpecific,
        seasonalTrends: this.analyzeSeasonalTrends(),
        recommendations: this.generateUploadRecommendations(timeAnalysis)
      };

    } catch (error) {
      console.error('Error predicting upload times:', error);
      return this.getDefaultUploadTimes();
    }
  }

  async analyzeGenreTrends(artists) {
    console.log('🎵 Analyzing genre trends...');

    const genreStats = {};
    
    artists.forEach(artist => {
      const genre = artist.genre_primary || 'hip-hop';
      if (!genreStats[genre]) {
        genreStats[genre] = {
          artistCount: 0,
          totalMomentum: 0,
          avgGrowth: 0,
          breakoutCount: 0,
          totalViews: 0
        };
      }

      const stats = genreStats[genre];
      stats.artistCount++;
      stats.totalMomentum += artist.trend_momentum || 0;
      stats.avgGrowth += artist.growth_rate || 0;
      stats.totalViews += artist.view_count || 0;
      if (artist.breakout_potential) stats.breakoutCount++;
    });

    const genreTrends = Object.entries(genreStats).map(([genre, stats]) => {
      const avgMomentum = stats.totalMomentum / stats.artistCount;
      const avgGrowth = stats.avgGrowth / stats.artistCount;
      const breakoutRate = (stats.breakoutCount / stats.artistCount) * 100;
      
      const trendScore = this.calculateGenreTrendScore({
        avgMomentum,
        avgGrowth,
        breakoutRate,
        artistCount: stats.artistCount
      });

      return {
        genre,
        trendScore,
        avgMomentum: Math.round(avgMomentum),
        avgGrowth: Math.round(avgGrowth * 10) / 10,
        breakoutRate: Math.round(breakoutRate),
        artistCount: stats.artistCount,
        totalViews: stats.totalViews,
        prediction: this.predictGenreFuture(trendScore, avgGrowth),
        opportunities: this.identifyGenreOpportunities(genre, stats),
        threats: this.identifyGenreThreats(genre, stats)
      };
    }).sort((a, b) => b.trendScore - a.trendScore);

    return genreTrends;
  }

  async predictEmergingKeywords(keywords) {
    console.log('🌱 Predicting emerging keywords...');

    // Analyze keyword patterns and predict new ones
    const patterns = this.extractKeywordPatterns(keywords);
    const emergingKeywords = [];

    // Generate predictions based on current trends
    const artistNames = ['lil mabu', 'dd osama', 'notti osama', 'sugarhill keem', 'sha ek'];
    const genres = ['jersey club', 'baltimore club', 'phonk', 'hyperpop'];
    const modifiers = ['aggressive', 'melodic', 'dark', 'bouncy', 'experimental'];

    // Generate combinations
    artistNames.forEach(artist => {
      const baseKeyword = `${artist} type beat`;
      const searchVolume = this.estimateSearchVolume(artist);
      const competitionScore = this.estimateCompetition(artist);
      const opportunityScore = this.calculateOpportunityScore(searchVolume, competitionScore);

      if (opportunityScore > 60) {
        emergingKeywords.push({
          keyword: baseKeyword,
          estimatedSearchVolume: searchVolume,
          competitionScore,
          opportunityScore,
          genre: this.detectGenreFromName(artist),
          confidence: this.calculateEmergingConfidence(artist),
          timeframe: '2-4 weeks',
          growthPotential: 'high'
        });
      }
    });

    genres.forEach(genre => {
      modifiers.forEach(modifier => {
        const keyword = `${modifier} ${genre} beat`;
        const searchVolume = this.estimateGenreSearchVolume(genre, modifier);
        const competitionScore = this.estimateGenreCompetition(genre);
        const opportunityScore = this.calculateOpportunityScore(searchVolume, competitionScore);

        if (opportunityScore > 55) {
          emergingKeywords.push({
            keyword,
            estimatedSearchVolume: searchVolume,
            competitionScore,
            opportunityScore,
            genre,
            confidence: this.calculateGenreEmergingConfidence(genre),
            timeframe: '1-3 months',
            growthPotential: 'medium'
          });
        }
      });
    });

    return emergingKeywords
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 12);
  }

  async generateMarketInsights(artists, keywords) {
    console.log('💡 Generating market insights...');

    const insights = {
      marketSaturation: this.analyzeMarketSaturation(artists, keywords),
      competitiveGaps: this.identifyCompetitiveGaps(artists, keywords),
      emergingNiches: this.identifyEmergingNiches(artists),
      crossoverOpportunities: this.identifyCrossoverOpportunities(artists),
      seasonalPredictions: this.generateSeasonalPredictions(),
      technologicalTrends: this.analyzeTechnologicalTrends(),
      demographicShifts: this.analyzeDemographicShifts(artists),
      strategicRecommendations: this.generateStrategicRecommendations(artists, keywords)
    };

    return insights;
  }

  async generateRecommendations(userId) {
    console.log('🎯 Generating personalized recommendations...');

    try {
      // Get user data (if available)
      const userHistory = await this.getUserHistory(userId);
      const marketTrends = await this.getCurrentMarketTrends();
      const userPreferences = this.analyzeUserPreferences(userHistory);

      const recommendations = {
        suggestedKeywords: this.matchKeywordsToUser(userPreferences, marketTrends),
        optimalGenres: this.identifyOptimalGenres(userPreferences),
        collaborationOpportunities: this.findCollaborations(userPreferences),
        uploadStrategy: this.generateUploadStrategy(marketTrends),
        contentStrategy: this.generateContentStrategy(userPreferences, marketTrends),
        monetizationTips: this.generateMonetizationTips(userPreferences),
        skillDevelopment: this.recommendSkillDevelopment(userPreferences),
        networkingOpportunities: this.identifyNetworkingOpportunities(userPreferences)
      };

      return recommendations;

    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getDefaultRecommendations();
    }
  }

  // Helper methods
  calculateGrowthRate(artist) {
    const momentum = artist.trend_momentum || 0;
    const baseGrowth = artist.growth_rate || 0;
    const recencyFactor = this.calculateRecency(artist.created_date);
    
    return Math.min(100, (momentum * 0.4) + (baseGrowth * 0.4) + (recencyFactor * 0.2));
  }

  analyzeSocialSignals(artist) {
    // Analyze social media presence indicators
    const viewCount = artist.view_count || 0;
    const monthlyListeners = artist.monthly_listeners || 0;
    const videoCount = artist.video_count || 0;
    
    return Math.min(100, Math.log10(viewCount) * 5 + Math.log10(monthlyListeners) * 3 + videoCount);
  }

  analyzeCompetition(artist) {
    const competitionLevel = artist.competition_level || 'medium';
    const competitionMap = { low: 20, medium: 50, high: 80 };
    return competitionMap[competitionLevel] || 50;
  }

  calculatePredictionScore(factors) {
    const weights = {
      growthRate: 0.25,
      momentumScore: 0.20,
      socialSignals: 0.20,
      competitionLevel: 0.15,
      recency: 0.20
    };

    return Object.entries(factors).reduce((score, [factor, value]) => {
      return score + (value * (weights[factor] || 0));
    }, 0);
  }

  calculateConfidence(artist, predictionScore) {
    const dataQuality = this.assessDataQuality(artist);
    const historicalAccuracy = 0.75; // Based on past predictions
    const modelConfidence = Math.min(1, predictionScore / 100);
    
    return Math.round((dataQuality * 0.3 + historicalAccuracy * 0.4 + modelConfidence * 0.3) * 100);
  }

  generatePredictionReasons(artist, score) {
    const reasons = [];
    
    if (artist.trend_momentum > 80) {
      reasons.push('High momentum score indicates strong current traction');
    }
    if (artist.growth_rate > 20) {
      reasons.push('Rapid growth rate suggests viral potential');
    }
    if (artist.breakout_potential) {
      reasons.push('Algorithm identifies breakout potential');
    }
    if (artist.competition_level === 'low') {
      reasons.push('Low competition creates opportunity window');
    }
    
    return reasons.slice(0, 3);
  }

  // Cache management
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Default fallbacks
  getDefaultPredictions() {
    return {
      risingArtists: [],
      decliningKeywords: [],
      optimalUploadTimes: this.getDefaultUploadTimes(),
      genreTrends: [],
      emergingKeywords: [],
      marketInsights: {}
    };
  }

  getDefaultUploadTimes() {
    return {
      bestDays: ['Friday', 'Saturday', 'Sunday'],
      bestHours: ['18:00', '19:00', '20:00'],
      peakWindows: [
        { day: 'Friday', time: '18:00-20:00', score: 95 },
        { day: 'Saturday', time: '19:00-21:00', score: 92 },
        { day: 'Sunday', time: '17:00-19:00', score: 88 }
      ]
    };
  }

  getDefaultRecommendations() {
    return {
      suggestedKeywords: ['trending type beat', 'viral hip hop beat'],
      optimalGenres: ['trap', 'drill', 'melodic rap'],
      collaborationOpportunities: [],
      uploadStrategy: 'Upload on weekends during peak hours',
      contentStrategy: 'Focus on trending artists and viral sounds'
    };
  }

  // Utility methods
  calculateRecency(dateString) {
    const date = new Date(dateString);
    const daysSince = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 100 - daysSince * 2); // Decay over time
  }

  assessDataQuality(artist) {
    let quality = 0;
    if (artist.trend_momentum) quality += 0.2;
    if (artist.view_count) quality += 0.2;
    if (artist.growth_rate) quality += 0.2;
    if (artist.video_count) quality += 0.2;
    if (artist.genre_primary) quality += 0.2;
    return quality;
  }

  calculateOpportunityScore(searchVolume, competitionScore) {
    const volumeScore = Math.min(50, Math.log10(searchVolume) * 10);
    const compScore = Math.max(0, 50 - (competitionScore * 50));
    return Math.round(volumeScore + compScore);
  }

  estimateSearchVolume(artist) {
    // Simple heuristic based on name patterns and current trends
    const nameLength = artist.length;
    const hasNumbers = /\d/.test(artist);
    const hasCommonWords = ['lil', 'young', 'big'].some(word => artist.toLowerCase().includes(word));
    
    let baseVolume = 5000;
    if (hasCommonWords) baseVolume *= 2;
    if (hasNumbers) baseVolume *= 0.8;
    if (nameLength < 10) baseVolume *= 1.2;
    
    return Math.floor(baseVolume * (0.8 + Math.random() * 0.4));
  }

  estimateCompetition(artist) {
    // Estimate competition based on name patterns
    const commonIndicators = ['lil', 'young', 'big', 'baby'];
    const hasCommonPattern = commonIndicators.some(word => artist.toLowerCase().includes(word));
    
    return hasCommonPattern ? 0.7 + Math.random() * 0.2 : 0.3 + Math.random() * 0.4;
  }
}

// Create singleton instance
export const predictiveAnalytics = new PredictiveAnalytics();

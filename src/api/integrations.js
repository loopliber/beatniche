import { supabase } from './supabaseClient';
import { youtubeAPI } from './youtubeClient';

// Core utilities and integrations
export const Core = {
  // File upload to Supabase Storage
  async uploadFile(bucket, filePath, file, options = {}) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        ...options
      });
    
    if (error) throw error;
    return data;
  },

  // Get public URL for uploaded file
  async getFileUrl(bucket, filePath) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  },

  // Delete file from storage
  async deleteFile(bucket, filePath) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) throw error;
    return true;
  },

  // Send email notification (you might want to use a service like Resend, SendGrid, etc.)
  async sendEmail(to, subject, html, text = '') {
    // This would typically integrate with an email service
    // For now, we'll use Supabase Edge Functions or a third-party service
    console.log('Email sending not implemented yet:', { to, subject });
    return { success: false, message: 'Email service not configured' };
  },

  // AI/LLM integration (could use OpenAI, Anthropic, etc.)
  async invokeLLM(prompt, options = {}) {
    // This would integrate with your preferred AI service
    console.log('LLM integration not implemented yet:', prompt);
    return { success: false, message: 'LLM service not configured' };
  }
};

// YouTube API integrations
export const YouTube = {
  // Search for music videos
  async searchMusicVideos(query, options = {}) {
    try {
      const results = await youtubeAPI.searchVideos(query, {
        ...options,
        videoCategoryId: '10' // Music category
      });
      return results;
    } catch (error) {
      console.error('YouTube search failed:', error);
      throw error;
    }
  },

  // Get trending music
  async getTrendingMusic(regionCode = 'US', maxResults = 50) {
    try {
      const results = await youtubeAPI.getTrendingMusic(regionCode, maxResults);
      return results;
    } catch (error) {
      console.error('Failed to get trending music:', error);
      throw error;
    }
  },

  // Get video analytics data
  async getVideoAnalytics(videoId) {
    try {
      const details = await youtubeAPI.getVideoDetails(videoId);
      if (details.items && details.items.length > 0) {
        const video = details.items[0];
        return {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          publishedAt: video.snippet.publishedAt,
          channelTitle: video.snippet.channelTitle,
          viewCount: video.statistics?.viewCount,
          likeCount: video.statistics?.likeCount,
          commentCount: video.statistics?.commentCount,
          duration: video.contentDetails?.duration,
          tags: video.snippet.tags || []
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to get video analytics:', error);
      throw error;
    }
  },

  // Search for artists/channels
  async searchArtists(query, options = {}) {
    try {
      const results = await youtubeAPI.searchChannels(query, options);
      return results;
    } catch (error) {
      console.error('Artist search failed:', error);
      throw error;
    }
  },

  // Get channel analytics
  async getChannelAnalytics(channelId) {
    try {
      const details = await youtubeAPI.getChannelDetails(channelId);
      if (details.items && details.items.length > 0) {
        const channel = details.items[0];
        return {
          id: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          publishedAt: channel.snippet.publishedAt,
          subscriberCount: channel.statistics?.subscriberCount,
          videoCount: channel.statistics?.videoCount,
          viewCount: channel.statistics?.viewCount,
          thumbnail: channel.snippet.thumbnails?.default?.url
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to get channel analytics:', error);
      throw error;
    }
  }
};

// Music industry specific utilities
export const MusicIndustry = {
  // Analyze trending keywords from YouTube
  async analyzeTrendingKeywords(genre = '', regionCode = 'US') {
    try {
      let query = 'music';
      if (genre) query += ` ${genre}`;
      
      const videos = await YouTube.searchMusicVideos(query, {
        maxResults: 50,
        order: 'viewCount',
        publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Last 7 days
      });

      const keywords = new Map();
      
      videos.items?.forEach(video => {
        const title = video.snippet.title.toLowerCase();
        const words = title.split(/\W+/).filter(word => word.length > 3);
        
        words.forEach(word => {
          keywords.set(word, (keywords.get(word) || 0) + 1);
        });
      });

      return Array.from(keywords.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([keyword, count]) => ({ keyword, count }));
    } catch (error) {
      console.error('Failed to analyze trending keywords:', error);
      throw error;
    }
  },

  // Find collaboration opportunities
  async findCollaborationOpportunities(artistName, genre = '') {
    try {
      const searchQuery = `${artistName} ${genre} collaboration duet featuring`.trim();
      const results = await YouTube.searchMusicVideos(searchQuery, {
        maxResults: 25,
        order: 'relevance'
      });

      return results.items?.map(video => ({
        videoId: video.id.videoId,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        thumbnail: video.snippet.thumbnails?.medium?.url,
        description: video.snippet.description
      })) || [];
    } catch (error) {
      console.error('Failed to find collaboration opportunities:', error);
      throw error;
    }
  }
};

// Legacy exports for backward compatibility
export const InvokeLLM = Core.invokeLLM;
export const SendEmail = Core.sendEmail;
export const UploadFile = Core.uploadFile;
export const GenerateImage = Core.invokeLLM; // You might want to implement image generation separately
export const ExtractDataFromUploadedFile = Core.invokeLLM; // You might want to implement data extraction separately







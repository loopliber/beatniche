import { useState, useEffect } from 'react';
import { youtubeAPI } from '../api/youtubeClient';

export function useYouTubeSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchVideos = async (query, options = {}) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await youtubeAPI.searchVideos(query, options);
      setResults(data.items || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('YouTube search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchChannels = async (query, options = {}) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await youtubeAPI.searchChannels(query, options);
      setResults(data.items || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('YouTube channel search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendingMusic = async (regionCode = 'US', maxResults = 50) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await youtubeAPI.getTrendingMusic(regionCode, maxResults);
      setResults(data.items || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('YouTube trending music error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    searchVideos,
    searchChannels,
    getTrendingMusic,
    clearResults
  };
}

export function useYouTubeVideoDetails(videoId) {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoId) return;

    const fetchVideoDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await youtubeAPI.getVideoDetails(videoId);
        if (data.items && data.items.length > 0) {
          setVideo(data.items[0]);
        }
      } catch (err) {
        setError(err.message);
        console.error('YouTube video details error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  return { video, loading, error };
}

export function useYouTubeChannelDetails(channelId) {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!channelId) return;

    const fetchChannelDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await youtubeAPI.getChannelDetails(channelId);
        if (data.items && data.items.length > 0) {
          setChannel(data.items[0]);
        }
      } catch (err) {
        setError(err.message);
        console.error('YouTube channel details error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelDetails();
  }, [channelId]);

  return { channel, loading, error };
}

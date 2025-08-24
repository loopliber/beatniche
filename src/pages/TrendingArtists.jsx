import React, { useState, useEffect } from "react";
import { TrendingArtist } from "@/api/entities";
import { youtubeAPI } from "@/api/youtubeClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Crown, 
  Music, 
  Search,
  Filter,
  Sparkles,
  Users,
  Eye,
  Zap,
  RefreshCw,
  Youtube
} from "lucide-react";

import ArtistCard from "../components/trending/ArtistCard";
import TrendingFilters from "../components/trending/TrendingFilters";

export default function TrendingArtists() {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataSource, setDataSource] = useState('mixed');
  const [usingMockData, setUsingMockData] = useState(false);
  const [filters, setFilters] = useState({
    competition: "all",
    momentum: "all",
    genre: "all",
    breakout: "all"
  });

  useEffect(() => {
    loadArtists();
  }, []);

  useEffect(() => {
    filterArtists();
  }, [artists, filters, searchTerm]);

  const detectGenreFromArtist = (artistName) => {
    const name = artistName.toLowerCase();
    
    // Genre detection patterns
    const genrePatterns = {
      'drill': ['drill', 'central cee', 'pop smoke', 'fivio', 'sheff g'],
      'trap': ['lil baby', 'gunna', 'future', 'young thug', 'travis scott'],
      'uk-drill': ['central cee', 'headie one', 'digga d', 'russ'],
      'bronx-drill': ['ice spice', 'kay flock', 'dougie b'],
      'rage-rap': ['yeat', 'ken carson', 'destroy lonely'],
      'melodic-rap': ['juice wrld', 'lil uzi', 'trippie redd'],
      'afrobeat': ['burna boy', 'wizkid', 'davido'],
      'experimental-hip-hop': ['playboi carti', 'carti']
    };
    
    for (const [genre, keywords] of Object.entries(genrePatterns)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        return genre;
      }
    }
    
    return 'hip-hop';
  };

  const loadArtists = async () => {
    setIsLoading(true);
    try {
      // First try to load from database
      const dbArtists = await TrendingArtist.list('-trend_momentum', 20);
      
      // If we have recent data, use it, otherwise fetch fresh data
      const hasRecentData = dbArtists.length > 5;
      
      if (hasRecentData) {
        console.log('Using database artists with real-time enhancement');
        setArtists(dbArtists);
        setDataSource('database');
      } else {
        console.log('Fetching fresh YouTube data');
        await loadTrendingArtistsFromYouTube();
        setDataSource('youtube');
      }
    } catch (error) {
      console.error('Error loading artists:', error);
      // Fallback to any available data
      const fallbackArtists = await TrendingArtist.list('-trend_momentum', 10).catch(() => []);
      setArtists(fallbackArtists);
      setDataSource('fallback');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingArtistsFromYouTube = async () => {
    try {
      // Check if we're using mock data
      setUsingMockData(youtubeAPI.useMockData);
      
      // Search for currently trending type beat artists
      const trendingSearches = [
        'type beat 2024', 'type beat 2025', 'trending type beats',
        'most viewed type beat', 'popular type beat', 'new type beat',
        'viral type beat', 'hot type beat'
      ];
      
      const artistMap = new Map();
      
      for (const searchTerm of trendingSearches) {
        try {
          const results = await youtubeAPI.searchVideos(searchTerm, {
            maxResults: 25,
            order: 'viewCount',
            publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          });
          
          // Update mock data status after first API call
          if (youtubeAPI.useMockData && !usingMockData) {
            setUsingMockData(true);
          }
          
          // Extract artist names from titles
          results.items?.forEach(video => {
            const title = video.snippet.title;
            const views = parseInt(video.statistics?.viewCount || 0);
            
            // Multiple patterns to catch different formats
            const patterns = [
              /(\w+(?:\s+\w+)?)\s+type\s+beat/gi,
              /(\w+(?:\s+\w+)?)\s+x\s+(\w+(?:\s+\w+)?)\s+type\s+beat/gi,
              /type\s+beat\s+-\s+["']([^"']+)["']/gi,
              /\[([^\]]+)\]\s+type\s+beat/gi
            ];
            
            patterns.forEach(pattern => {
              let match;
              while ((match = pattern.exec(title)) !== null) {
                const artistName = match[1]?.trim() || match[2]?.trim();
                if (artistName && artistName.length > 2 && artistName.length < 30) {
                  const cleanName = artistName.replace(/[^\w\s]/g, '').trim();
                  
                  if (!artistMap.has(cleanName)) {
                    artistMap.set(cleanName, {
                      name: cleanName,
                      count: 0,
                      totalViews: 0,
                      videos: [],
                      latestVideo: null,
                      channelSet: new Set()
                    });
                  }
                  
                  const artist = artistMap.get(cleanName);
                  artist.count++;
                  artist.totalViews += views;
                  artist.videos.push({
                    title: video.snippet.title,
                    views: views,
                    channelTitle: video.snippet.channelTitle,
                    publishedAt: video.snippet.publishedAt
                  });
                  artist.channelSet.add(video.snippet.channelTitle);
                  
                  if (!artist.latestVideo || new Date(video.snippet.publishedAt) > new Date(artist.latestVideo.publishedAt)) {
                    artist.latestVideo = video;
                  }
                }
              }
            });
          });
        } catch (error) {
          console.warn(`Error searching for "${searchTerm}":`, error);
        }
      }
      
      // Convert to artist objects with calculated metrics
      const processedArtists = Array.from(artistMap.values())
        .filter(a => a.count >= 2 && a.channelSet.size >= 2) // Multiple videos from different channels
        .map((artist, index) => {
          const avgViews = artist.totalViews / artist.count;
          const momentum = Math.min(95, Math.max(20, 
            (artist.count * 8) + 
            (Math.log10(avgViews) * 5) + 
            (artist.channelSet.size * 3)
          ));
          
          return {
            id: `yt-${Date.now()}-${index}`,
            artist_name: artist.name,
            name: artist.name,
            trend_momentum: Math.round(momentum),
            competition_level: artist.count > 15 ? 'high' : artist.count > 8 ? 'medium' : 'low',
            genre_primary: detectGenreFromArtist(artist.name),
            estimated_searches: Math.floor(artist.totalViews / 1000),
            breakout_potential: artist.count > 8 && avgViews > 50000,
            monthly_listeners: Math.floor(avgViews * 30),
            view_count: artist.totalViews,
            growth_rate: Math.min(50, (artist.count / 2) + (momentum / 10)),
            country: 'US', // Default, could be enhanced with channel data
            created_date: new Date().toISOString(),
            video_count: artist.count,
            channel_count: artist.channelSet.size,
            latest_video: artist.latestVideo?.snippet.title,
            avg_views: Math.floor(avgViews)
          };
        })
        .sort((a, b) => b.trend_momentum - a.trend_momentum)
        .slice(0, 25);
      
      console.log(`Found ${processedArtists.length} trending artists from YouTube`);
      setArtists(processedArtists);
      
      // Save to database for future use
      try {
        for (const artist of processedArtists.slice(0, 10)) {
          await TrendingArtist.create(artist).catch(() => {}); // Silently fail if duplicate
        }
      } catch (e) {
        console.warn('Could not save to database:', e);
      }
      
    } catch (error) {
      console.error('Error loading artists from YouTube:', error);
      // Fallback to database if available
      const fallbackArtists = await TrendingArtist.list('-trend_momentum', 10).catch(() => []);
      setArtists(fallbackArtists);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadTrendingArtistsFromYouTube();
    setIsRefreshing(false);
  };

  const filterArtists = () => {
    let filtered = [...artists];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(artist => 
        artist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.genre_primary?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Competition filter
    if (filters.competition !== "all") {
      filtered = filtered.filter(artist => artist.competition_level === filters.competition);
    }

    // Momentum filter
    if (filters.momentum !== "all") {
      filtered = filtered.filter(artist => {
        const momentum = artist.trend_momentum || 0;
        switch (filters.momentum) {
          case "high": return momentum >= 80;
          case "medium": return momentum >= 50 && momentum < 80;
          case "low": return momentum < 50;
          default: return true;
        }
      });
    }

    // Genre filter
    if (filters.genre !== "all") {
      filtered = filtered.filter(artist => artist.genre_primary === filters.genre);
    }

    // Breakout filter
    if (filters.breakout !== "all") {
      const isBreakout = filters.breakout === "true";
      filtered = filtered.filter(artist => !!artist.breakout_potential === isBreakout);
    }

    setFilteredArtists(filtered);
  };

  const getStats = () => {
    return {
      total: artists.length,
      highMomentum: artists.filter(a => (a.trend_momentum || 0) >= 80).length,
      lowCompetition: artists.filter(a => a.competition_level === 'low').length,
      breakoutPotential: artists.filter(a => a.breakout_potential).length
    };
  };

  const stats = getStats();

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Refresh Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-600 bg-clip-text text-transparent">
              Trending Artists Hub
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Track rising artists and discover breakout opportunities
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <Youtube className="w-3 h-3 mr-1" />
                {usingMockData ? '🎭 Demo Data' :
                 dataSource === 'youtube' ? 'Live YouTube Data' : 
                 dataSource === 'database' ? 'Cached Data' : 'Fallback Data'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {artists.length} Artists
              </Badge>
              {usingMockData && (
                <Badge variant="destructive" className="text-xs">
                  API Unavailable
                </Badge>
              )}
            </div>
          </div>
          
          <Button 
            onClick={refreshData} 
            disabled={isRefreshing}
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600"
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh Data
          </Button>
        </div>

        {/* Mock Data Notice */}
        {usingMockData && (
          <Card className="border-orange-200 bg-orange-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🎭</div>
                <div>
                  <h3 className="font-semibold text-orange-800">Demo Mode Active</h3>
                  <p className="text-sm text-orange-700">
                    YouTube API is currently unavailable. Showing demo data for testing purposes. 
                    The app functionality remains the same - this is just sample data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Artists</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">{stats.highMomentum}</div>
              <div className="text-sm text-gray-600">High Momentum</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Eye className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-gray-900">{stats.lowCompetition}</div>
              <div className="text-sm text-gray-600">Low Competition</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-900">{stats.breakoutPotential}</div>
              <div className="text-sm text-gray-600">Breakout Potential</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search artists or genres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button variant="outline" className="h-12 px-6">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
            
            <TrendingFilters filters={filters} setFilters={setFilters} />
          </CardContent>
        </Card>

        {/* Artists Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredArtists.length === 0 ? (
          <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-white/50">
            <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium text-gray-600">No artists found</p>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
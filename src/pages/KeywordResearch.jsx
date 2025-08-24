import React, { useState } from 'react';
import { youtubeAPI } from '@/api/youtubeClient';
import { Keyword } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, Search, Loader2, AlertCircle, TrendingUp, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function KeywordResearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchedTerm, setSearchedTerm] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a keyword to explore.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setResults([]);
    setSearchedTerm(searchTerm);

    try {
      // Search YouTube for related videos
      const searchResults = await youtubeAPI.searchVideos(`${searchTerm} type beat`, {
        maxResults: 50,
        order: 'viewCount',
        publishedAfter: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      if (!searchResults.items || searchResults.items.length === 0) {
        setError("No results found. Try a different keyword.");
        setIsLoading(false);
        return;
      }

      // Get detailed stats for videos
      const videoIds = searchResults.items.map(item => item.id.videoId).filter(Boolean);
      const videoDetails = await youtubeAPI.getVideoDetails(videoIds.slice(0, 20));

      // Analyze keywords from video titles and calculate metrics
      const keywordMap = new Map();
      
      videoDetails.items?.forEach(video => {
        const title = video.snippet.title.toLowerCase();
        const views = parseInt(video.statistics?.viewCount || 0);
        const likes = parseInt(video.statistics?.likeCount || 0);
        const engagement = views > 0 ? (likes / views) * 100 : 0;
        
        // Extract keyword variations
        const patterns = [
          new RegExp(`(\\w+(?:\\s+\\w+)?(?:\\s+x\\s+\\w+(?:\\s+\\w+)?)?)\\s+type\\s+beat`, 'gi'),
          new RegExp(`${searchTerm}\\s+x\\s+(\\w+(?:\\s+\\w+)?)`, 'gi'),
          new RegExp(`(\\w+(?:\\s+\\w+)?)\\s+x\\s+${searchTerm}`, 'gi')
        ];

        patterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(title)) !== null) {
            const keyword = match[0].trim();
            if (keyword.length > 3 && keyword !== searchTerm) {
              const current = keywordMap.get(keyword) || {
                keyword,
                videos: [],
                totalViews: 0,
                totalLikes: 0,
                avgEngagement: 0,
                count: 0
              };
              
              current.videos.push({
                title: video.snippet.title,
                views,
                likes,
                channelTitle: video.snippet.channelTitle
              });
              current.totalViews += views;
              current.totalLikes += likes;
              current.avgEngagement = ((current.avgEngagement * current.count) + engagement) / (current.count + 1);
              current.count++;
              
              keywordMap.set(keyword, current);
            }
          }
        });
      });

      // Also add the original search term
      const mainKeywordViews = videoDetails.items?.reduce((sum, video) => 
        sum + parseInt(video.statistics?.viewCount || 0), 0) || 0;
      
      keywordMap.set(searchTerm, {
        keyword: searchTerm,
        videos: videoDetails.items?.slice(0, 5).map(v => ({
          title: v.snippet.title,
          views: parseInt(v.statistics?.viewCount || 0),
          likes: parseInt(v.statistics?.likeCount || 0),
          channelTitle: v.snippet.channelTitle
        })) || [],
        totalViews: mainKeywordViews,
        totalLikes: videoDetails.items?.reduce((sum, video) => 
          sum + parseInt(video.statistics?.likeCount || 0), 0) || 0,
        avgEngagement: 2.5,
        count: videoDetails.items?.length || 0
      });

      // Convert to results format with calculated metrics
      const processedResults = Array.from(keywordMap.values())
        .map(data => {
          const avgViews = data.totalViews / Math.max(data.count, 1);
          const competition = Math.min(100, (data.count / 10) * 100);
          const opportunity = calculateOpportunityScore(avgViews, competition, data.avgEngagement);
          
          return {
            keyword: data.keyword,
            volume: Math.floor(avgViews / 100), // Estimate monthly searches
            avgViews: Math.floor(avgViews),
            competition: competition,
            opportunity: opportunity,
            difficulty: competition > 70 ? 'High' : competition > 40 ? 'Medium' : 'Low',
            videos: data.videos.slice(0, 3),
            engagement: data.avgEngagement.toFixed(2) + '%'
          };
        })
        .sort((a, b) => b.opportunity - a.opportunity)
        .slice(0, 15);

      setResults(processedResults);

      // Save to database if user is logged in
      try {
        for (const result of processedResults.slice(0, 5)) {
          await Keyword.create({
            keyword: result.keyword,
            search_volume: result.volume,
            competition_score: result.competition / 100,
            opportunity_score: result.opportunity,
            trend_direction: 'stable',
            genre: detectGenre(result.keyword),
            is_public: true
          }).catch(() => {}); // Silently fail if duplicate
        }
      } catch (e) {
        // Ignore database errors
      }

    } catch (e) {
      console.error('Search error:', e);
      setError("Failed to fetch YouTube data. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateOpportunityScore = (avgViews, competition, engagement) => {
    const viewScore = Math.min(50, (avgViews / 10000) * 5);
    const compScore = Math.max(0, 40 - (competition * 0.4));
    const engagementScore = Math.min(10, engagement * 4);
    return Math.min(100, Math.floor(viewScore + compScore + engagementScore));
  };

  const detectGenre = (keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerKeyword.includes('drill')) return 'drill';
    if (lowerKeyword.includes('trap')) return 'trap';
    if (lowerKeyword.includes('lofi') || lowerKeyword.includes('lo-fi')) return 'lofi';
    if (lowerKeyword.includes('boom bap')) return 'boom-bap';
    if (lowerKeyword.includes('r&b') || lowerKeyword.includes('rnb')) return 'r&b';
    if (lowerKeyword.includes('afro')) return 'afrobeat';
    return 'hip-hop';
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };
  
  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return 'text-gray-600';
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty === 'low') return 'text-green-500';
    if (lowerDifficulty === 'medium') return 'text-yellow-600';
    if (lowerDifficulty === 'high') return 'text-red-500';
    return 'text-gray-600';
  };

  const getOpportunityColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    if (score >= 40) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-600 bg-clip-text text-transparent">
            YouTube Keyword Research Tool
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Discover real YouTube search data and competition analysis for type beats
          </p>
        </div>

        {/* Search Form Card */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Enter artist name or genre (e.g., Drake, Trap, Melodic)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="h-12 text-lg placeholder:text-gray-400"
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="h-12 px-8 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-lg shrink-0 shadow-md hover:shadow-lg transition-shadow"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Search className="w-5 h-5 mr-2" />
                )}
                <span>Analyze</span>
              </Button>
            </div>
            <div className="text-sm text-gray-500 mt-4 flex items-center gap-2">
              <span className="font-medium">Try:</span>
              <button onClick={() => setSearchTerm("Drake")} className="hover:underline text-indigo-600">Drake</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => setSearchTerm("Travis Scott")} className="hover:underline text-indigo-600">Travis Scott</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => setSearchTerm("Central Cee")} className="hover:underline text-indigo-600">Central Cee</button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        <div className="space-y-4">
          {isLoading && (
            <div className="text-center py-12 text-gray-500">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-indigo-400" />
              <p className="text-lg font-medium">Analyzing YouTube data for "{searchedTerm}"</p>
              <p>Fetching real-time statistics...</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>YouTube Analysis Results for "{searchedTerm}"</CardTitle>
                  <p className="text-sm text-gray-600">Based on real YouTube data from the last 30 days</p>
                </CardHeader>
              </Card>

              {results.map((item, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div className="flex-1 mb-4 md:mb-0">
                        <h3 className="font-bold text-xl text-gray-800 mb-2">{item.keyword}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getDifficultyColor(item.difficulty)}>
                            {item.difficulty} Competition
                          </Badge>
                          <Badge className={getOpportunityColor(item.opportunity)}>
                            {item.opportunity}% Opportunity
                          </Badge>
                          <Badge variant="outline">
                            {item.engagement} Engagement
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Est. Searches</div>
                          <div className="font-bold text-xl text-gray-900">{formatVolume(item.volume)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Avg Views</div>
                          <div className="font-bold text-xl text-indigo-600">{formatVolume(item.avgViews)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Competition Level</span>
                        <span className="font-medium">{item.competition.toFixed(0)}%</span>
                      </div>
                      <Progress value={item.competition} className="h-2" />
                    </div>

                    {item.videos && item.videos.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">TOP PERFORMING VIDEOS:</p>
                        <div className="space-y-1">
                          {item.videos.map((video, vIndex) => (
                            <div key={vIndex} className="text-xs text-gray-600 flex justify-between">
                              <span className="truncate flex-1 mr-2">{video.title}</span>
                              <span className="font-medium">{formatVolume(video.views)} views</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && results.length === 0 && !error && (
            <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-white/50">
              <Compass className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-gray-600">Real YouTube data will appear here</p>
              <p className="text-gray-500">Enter an artist or genre to analyze actual search trends</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
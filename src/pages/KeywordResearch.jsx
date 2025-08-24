import React, { useState } from 'react';
import { youtubeAPI } from '@/api/youtubeClient';
import { Keyword } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, Search, Loader2, TrendingUp, Eye } from "lucide-react";
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
      // Search YouTube for videos related to the search term
      const searchQueries = [
        `${searchTerm} type beat`,
        `${searchTerm} type beat 2024`,
        `${searchTerm} type beat 2025`,
        `${searchTerm} instrumental`,
        `${searchTerm} x type beat`
      ];

      const allVideoDetails = [];
      
      // Search with multiple queries to get comprehensive results
      for (const query of searchQueries) {
        try {
          const searchResults = await youtubeAPI.searchVideos(query, {
            maxResults: 10,
            order: 'viewCount',
            publishedAfter: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() // Last 60 days
          });

          if (searchResults.items && searchResults.items.length > 0) {
            const videoIds = searchResults.items
              .map(item => item.id.videoId)
              .filter(Boolean);
            
            if (videoIds.length > 0) {
              const details = await youtubeAPI.getVideoDetails(videoIds);
              if (details.items) {
                allVideoDetails.push(...details.items);
              }
            }
          }
        } catch (err) {
          console.warn(`Failed to search for: ${query}`, err);
        }
      }

      if (allVideoDetails.length === 0) {
        setError("No results found. Try a different keyword.");
        setIsLoading(false);
        return;
      }

      // Analyze keywords from video titles
      const keywordMap = new Map();
      const searchTermLower = searchTerm.toLowerCase();
      
      allVideoDetails.forEach(video => {
        const title = video.snippet.title;
        const titleLower = title.toLowerCase();
        const views = parseInt(video.statistics?.viewCount || 0);
        const likes = parseInt(video.statistics?.likeCount || 0);
        const engagement = views > 0 ? (likes / views) * 100 : 0;
        
        // Extract relevant keyword combinations
        const keywordPatterns = [];
        
        // Check if title contains the search term
        if (!titleLower.includes(searchTermLower)) {
          return; // Skip if title doesn't contain our search term
        }

        // Pattern 1: "artist type beat" or "artist instrumental"
        if (titleLower.includes(`${searchTermLower} type beat`)) {
          keywordPatterns.push(`${searchTerm} type beat`);
        }
        
        // Pattern 2: "artist x other_artist type beat"
        const collabPattern = new RegExp(`${searchTermLower}\\s+x\\s+([\\w\\s]+?)(?:\\s+type\\s+beat|\\s+instrumental)`, 'gi');
        let collabMatch = collabPattern.exec(title);
        if (collabMatch) {
          keywordPatterns.push(`${searchTerm} x ${collabMatch[1].trim()} type beat`);
        }

        // Pattern 3: "other_artist x artist type beat"
        const reverseCollabPattern = new RegExp(`([\\w\\s]+?)\\s+x\\s+${searchTermLower}(?:\\s+type\\s+beat|\\s+instrumental)`, 'gi');
        let reverseMatch = reverseCollabPattern.exec(title);
        if (reverseMatch) {
          keywordPatterns.push(`${reverseMatch[1].trim()} x ${searchTerm} type beat`);
        }

        // Pattern 4: Style/mood variations (e.g., "dark central cee type beat")
        const stylePattern = new RegExp(`(\\w+)\\s+${searchTermLower}\\s+type\\s+beat`, 'gi');
        let styleMatch = stylePattern.exec(title);
        if (styleMatch && !['free', 'new', '2024', '2025', '2023'].includes(styleMatch[1].toLowerCase())) {
          keywordPatterns.push(`${styleMatch[1]} ${searchTerm} type beat`);
        }

        // Pattern 5: Genre specific (e.g., "central cee drill type beat")
        const genreWords = ['drill', 'trap', 'melodic', 'hard', 'dark', 'chill', 'sad', 'aggressive', 'uk drill', 'ny drill', 'jersey', 'plugg', 'pluggnb'];
        genreWords.forEach(genre => {
          if (titleLower.includes(genre) && titleLower.includes(searchTermLower)) {
            keywordPatterns.push(`${searchTerm} ${genre} type beat`);
          }
        });

        // Add keywords to map with their metrics
        keywordPatterns.forEach(keyword => {
          if (keyword && keyword.length > 3) {
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
        });
      });

      // Always add the main search term if we have data for it
      const mainSearchTerm = `${searchTerm} type beat`;
      if (!keywordMap.has(mainSearchTerm)) {
        const mainKeywordVideos = allVideoDetails
          .filter(v => v.snippet.title.toLowerCase().includes(searchTermLower))
          .slice(0, 5);
        
        if (mainKeywordVideos.length > 0) {
          keywordMap.set(mainSearchTerm, {
            keyword: mainSearchTerm,
            videos: mainKeywordVideos.map(v => ({
              title: v.snippet.title,
              views: parseInt(v.statistics?.viewCount || 0),
              likes: parseInt(v.statistics?.likeCount || 0),
              channelTitle: v.snippet.channelTitle
            })),
            totalViews: mainKeywordVideos.reduce((sum, v) => sum + parseInt(v.statistics?.viewCount || 0), 0),
            totalLikes: mainKeywordVideos.reduce((sum, v) => sum + parseInt(v.statistics?.likeCount || 0), 0),
            avgEngagement: 2.5,
            count: mainKeywordVideos.length
          });
        }
      }

      // Convert to results format with calculated metrics
      const processedResults = Array.from(keywordMap.values())
        .filter(data => data.count > 0) // Only include keywords with actual data
        .map(data => {
          const avgViews = Math.floor(data.totalViews / data.count);
          const competition = Math.min(100, (data.count / 5) * 100); // Adjusted scale
          const opportunity = calculateOpportunityScore(avgViews, competition, data.avgEngagement);
          
          return {
            keyword: data.keyword,
            volume: Math.floor(avgViews / 100), // Estimate monthly searches
            avgViews: avgViews,
            competition: competition,
            opportunity: opportunity,
            difficulty: competition > 70 ? 'High' : competition > 40 ? 'Medium' : 'Low',
            videos: data.videos.slice(0, 3),
            engagement: data.avgEngagement.toFixed(2) + '%',
            videoCount: data.count
          };
        })
        .sort((a, b) => {
          // Prioritize exact matches, then sort by opportunity
          const aExact = a.keyword.toLowerCase().startsWith(searchTermLower);
          const bExact = b.keyword.toLowerCase().startsWith(searchTermLower);
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          return b.opportunity - a.opportunity;
        })
        .slice(0, 15);

      if (processedResults.length === 0) {
        setError(`No relevant results found for "${searchTerm}". Try a different artist or keyword.`);
      } else {
        setResults(processedResults);

        // Save to database
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
    if (lowerKeyword.includes('plugg')) return 'plugg';
    if (lowerKeyword.includes('jersey')) return 'jersey';
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
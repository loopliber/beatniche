
import React, { useState } from 'react';
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, Search, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

    const prompt = `
      Act as a YouTube keyword research tool for music producers specializing in type beats.
      The user's seed keyword is: "${searchTerm}".
      Generate a list of 10 to 15 related, long-tail keywords that producers or artists would search for.
      For each keyword, provide:
      1. 'keyword': The suggested keyword phrase.
      2. 'volume': A realistic, estimated monthly search volume (as a number).
      3. 'difficulty': A difficulty rating (Low, Medium, or High).
    `;

    try {
      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            keywords: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  volume: { type: "number" },
                  difficulty: { type: "string" }
                },
                required: ["keyword", "volume", "difficulty"]
              }
            }
          },
          required: ["keywords"]
        }
      });

      if (response && Array.isArray(response.keywords)) {
        setResults(response.keywords);
      } else {
        setError("The analysis returned an unexpected format. Please try again.");
      }

    } catch (e) {
      console.error(e);
      setError("An error occurred during the analysis. Please try again later.");
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-600 bg-clip-text text-transparent">
            Keyword Research Tool
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Discover related keywords and estimated search volume for your beats.
          </p>
        </div>

        {/* Search Form Card */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <Input
                        placeholder="Enter a keyword, artist, or genre..."
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
                        <span>Search</span>
                    </Button>
                </div>
                <div className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                    <span className="font-medium">Examples:</span>
                    <button onClick={() => setSearchTerm("Drake Type Beat")} className="hover:underline">Drake Type Beat</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => setSearchTerm("Dark Trap Beat")} className="hover:underline">Dark Trap Beat</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => setSearchTerm("Lil Baby x Gunna")} className="hover:underline">Lil Baby x Gunna</button>
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
                <p className="text-lg font-medium">Analyzing keyword: "{searchedTerm}"</p>
                <p>Please wait a moment...</p>
            </div>
          )}

          {results.length > 0 && (
             <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Results for "{searchedTerm}"</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="divide-y divide-gray-200">
                        {results.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 px-2 hover:bg-gray-50/50 rounded-md">
                            <div className="flex-1 mb-2 md:mb-0">
                                <h3 className="font-semibold text-lg text-gray-800">{item.keyword}</h3>
                            </div>
                            <div className="flex gap-12 items-center text-right w-full md:w-auto">
                                <div className="flex-1 md:flex-initial">
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Volume</div>
                                    <div className="font-semibold text-lg text-gray-900">{formatVolume(item.volume)}</div>
                                </div>
                                <div className="flex-1 md:flex-initial">
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Difficulty</div>
                                    <div className={`font-semibold text-lg ${getDifficultyColor(item.difficulty)}`}>
                                        {item.difficulty}
                                    </div>
                                </div>
                            </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
          )}

          {!isLoading && results.length === 0 && !error && (
            <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-white/50">
              <Compass className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-gray-600">Results will appear here</p>
              <p className="text-gray-500">Enter a keyword and click "Search" to start your research.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

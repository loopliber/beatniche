import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const genres = [
  "trap", "drill", "r&b", "pop", "afrobeat", "country", "rock", "electronic", "hip-hop", "other"
];

export default function SearchForm({ onSearch, isLoading }) {
  const [searchData, setSearchData] = useState({
    keyword: "",
    genre: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchData.keyword.trim()) {
      setError("Please enter a keyword to analyze");
      return;
    }
    setError("");
    onSearch(searchData);
  };

  const generateSuggestions = () => {
    const suggestions = [
      "Drake x Future",
      "Travis Scott x Playboi Carti", 
      "Lil Baby x Gunna",
      "21 Savage x Metro Boomin",
      "Juice WRLD x Trippie Redd",
      "Pop Smoke x Fivio Foreign"
    ];
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    setSearchData({ ...searchData, keyword: random });
    setError("");
  };

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
      <CardContent className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              AI-Powered Keyword Discovery
            </h2>
            <p className="text-gray-600">
              Enter artist combinations or type beat keywords to get real-time market analysis
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="e.g., Drake x Future, Dark Trap, Juice WRLD Type Beat"
                  value={searchData.keyword}
                  onChange={(e) => setSearchData({ ...searchData, keyword: e.target.value })}
                  className="h-14 text-lg px-6 bg-white border-2 border-gray-200 focus:border-indigo-400 transition-all duration-300"
                />
              </div>
              
              <Select
                value={searchData.genre}
                onValueChange={(value) => setSearchData({ ...searchData, genre: value })}
              >
                <SelectTrigger className="h-14 bg-white border-2 border-gray-200">
                  <SelectValue placeholder="Genre (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <Button
                type="submit"
                disabled={isLoading || !searchData.keyword.trim()}
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-8 py-3 h-auto text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Market Data...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Analyze Keyword
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={generateSuggestions}
                disabled={isLoading}
                className="px-6 py-3 h-auto border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Suggestion
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Popular searches: "Drake x 21 Savage", "Dark Trap Beat", "Melodic Rap Instrumental"</p>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
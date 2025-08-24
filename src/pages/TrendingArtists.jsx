import React, { useState, useEffect } from "react";
import { TrendingArtist } from "@/api/entities";
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
  Zap
} from "lucide-react";

import ArtistCard from "../components/trending/ArtistCard";
import TrendingFilters from "../components/trending/TrendingFilters";

export default function TrendingArtists() {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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

  const loadArtists = async () => {
    try {
      const data = await TrendingArtist.list('-trend_momentum', 50);
      setArtists(data);
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterArtists = () => {
    let filtered = artists;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(artist => 
        artist.artist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.genre_primary?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Competition filter
    if (filters.competition !== "all") {
      filtered = filtered.filter(artist => artist.competition_level === filters.competition);
    }

    // Momentum filter
    if (filters.momentum === "high") {
      filtered = filtered.filter(artist => artist.trend_momentum >= 80);
    } else if (filters.momentum === "medium") {
      filtered = filtered.filter(artist => artist.trend_momentum >= 50 && artist.trend_momentum < 80);
    } else if (filters.momentum === "low") {
      filtered = filtered.filter(artist => artist.trend_momentum < 50);
    }

    // Genre filter
    if (filters.genre !== "all") {
      filtered = filtered.filter(artist => artist.genre_primary === filters.genre);
    }

    // Breakout filter
    if (filters.breakout === "yes") {
      filtered = filtered.filter(artist => artist.breakout_potential === true);
    } else if (filters.breakout === "no") {
      filtered = filtered.filter(artist => artist.breakout_potential === false);
    }

    setFilteredArtists(filtered);
  };

  const getStats = () => {
    return {
      total: artists.length,
      highMomentum: artists.filter(a => a.trend_momentum >= 80).length,
      lowCompetition: artists.filter(a => a.competition_level === "low").length,
      breakoutPotential: artists.filter(a => a.breakout_potential).length
    };
  };

  const stats = getStats();

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-600 bg-clip-text text-transparent">
              Trending Artists Hub
            </h1>
            <p className="text-gray-600 text-lg">
              Track rising artists and discover breakout opportunities
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-md bg-gradient-to-r from-indigo-50 to-cyan-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Total Artists</p>
                  <p className="text-2xl font-bold text-indigo-900">{stats.total}</p>
                </div>
                <Music className="w-8 h-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600 font-medium">High Momentum</p>
                  <p className="text-2xl font-bold text-emerald-900">{stats.highMomentum}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Low Competition</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.lowCompetition}</p>
                </div>
                <Eye className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Breakout Potential</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.breakoutPotential}</p>
                </div>
                <Crown className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search artists by name or genre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 text-lg"
                    icon={<Search className="w-5 h-5" />}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <TrendingFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Artists Grid */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="grid gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredArtists.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No artists found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
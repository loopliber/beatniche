import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Crown, Users, Music, TrendingUp, Zap } from "lucide-react";

export default function ArtistCard({ artist }) {
  const getCompetitionColor = (level) => {
    const colors = {
      'low': 'bg-green-100 text-green-700 border-green-200',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'high': 'bg-orange-100 text-orange-700 border-orange-200',
      'oversaturated': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[level] || colors.medium;
  };

  const getMomentumGrade = (momentum) => {
    if (momentum >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (momentum >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (momentum >= 70) return { grade: 'B+', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (momentum >= 60) return { grade: 'B', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (momentum >= 50) return { grade: 'C', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const momentumGrade = getMomentumGrade(artist.trend_momentum);

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-300 group hover:scale-[1.01]">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {artist.artist_name}
              </h3>
              {artist.breakout_potential && (
                <Crown className="w-6 h-6 text-yellow-500" />
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={getCompetitionColor(artist.competition_level)} variant="secondary">
                {artist.competition_level} competition
              </Badge>
              {artist.genre_primary && (
                <Badge variant="outline" className="bg-white/50">
                  {artist.genre_primary}
                </Badge>
              )}
              {artist.breakout_potential && (
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200" variant="secondary">
                  Breakout Potential
                </Badge>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${momentumGrade.bg} ${momentumGrade.color} font-bold text-xl`}>
              {momentumGrade.grade}
            </div>
            <p className="text-xs text-gray-500 mt-1">Momentum</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Trend Momentum</span>
            <span className="text-sm font-bold text-gray-900">{artist.trend_momentum}%</span>
          </div>
          <Progress 
            value={artist.trend_momentum} 
            className="h-3"
            indicatorClassName={artist.trend_momentum > 80 ? "bg-green-500" : artist.trend_momentum > 60 ? "bg-yellow-500" : "bg-red-500"}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-semibold text-gray-900">
                {artist.estimated_searches?.toLocaleString() || 'N/A'}
              </p>
              <p className="text-gray-500 text-xs">Est. Monthly Searches</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-semibold text-gray-900">
                {artist.trend_momentum >= 80 ? 'High' : artist.trend_momentum >= 50 ? 'Medium' : 'Low'}
              </p>
              <p className="text-gray-500 text-xs">Momentum Level</p>
            </div>
          </div>
        </div>

        {artist.viral_songs && artist.viral_songs.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600 mb-2">Viral Songs:</p>
            <div className="flex flex-wrap gap-2">
              {artist.viral_songs.slice(0, 3).map((song, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                  {song}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {artist.collaboration_suggestions && artist.collaboration_suggestions.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600 mb-2">Suggested Combos:</p>
            <div className="flex flex-wrap gap-2">
              {artist.collaboration_suggestions.slice(0, 4).map((collab, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-gradient-to-r from-indigo-50 to-cyan-50 border-indigo-200">
                  {artist.artist_name} x {collab}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Added {new Date(artist.created_date).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
              <Music className="w-4 h-4 mr-2" />
              Track
            </Button>
            <Button variant="outline" size="sm" className="hover:bg-emerald-50 hover:border-emerald-300 transition-colors">
              <Zap className="w-4 h-4 mr-2" />
              Research
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
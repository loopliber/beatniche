import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Crown, Music, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function OpportunityFinder({ artists, isLoading }) {
  const getCompetitionColor = (level) => {
    const colors = {
      'low': 'bg-green-100 text-green-700 border-green-200',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'high': 'bg-orange-100 text-orange-700 border-orange-200',
      'oversaturated': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[level] || colors.medium;
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="p-3 rounded-lg border">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            Breakout Artists
          </CardTitle>
          <Link to={createPageUrl("TrendingArtists")}>
            <Button variant="outline" size="sm" className="hover:bg-emerald-50 transition-colors">
              Explore
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {artists.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No trending artists data available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {artists.slice(0, 5).map((artist, index) => (
              <div key={artist.id} className="group p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {artist.artist_name}
                      </h3>
                      {artist.breakout_potential && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getCompetitionColor(artist.competition_level)} variant="secondary">
                        {artist.competition_level} competition
                      </Badge>
                      {artist.genre_primary && (
                        <Badge variant="outline" className="text-xs">
                          {artist.genre_primary}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">
                      {artist.trend_momentum}
                    </div>
                    <div className="text-xs text-gray-500">Momentum</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  Est. {artist.estimated_searches?.toLocaleString() || 'N/A'} monthly searches
                </div>

                {artist.collaboration_suggestions && artist.collaboration_suggestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Suggested Combos
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {artist.collaboration_suggestions.slice(0, 3).map((collab, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-gradient-to-r from-indigo-50 to-cyan-50 border-indigo-200">
                          {artist.artist_name} x {collab}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
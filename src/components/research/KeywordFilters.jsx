import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, SortAsc } from "lucide-react";

export default function KeywordFilters({ filters, onFiltersChange, sortBy, onSortChange }) {
  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Filter className="w-4 h-4" />
            Filters:
          </div>

          <Select value={filters.genre} onValueChange={(value) => updateFilter('genre', value)}>
            <SelectTrigger className="w-40 h-9 bg-white/80">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              <SelectItem value="trap">Trap</SelectItem>
              <SelectItem value="drill">Drill</SelectItem>
              <SelectItem value="r&b">R&B</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="afrobeat">Afrobeat</SelectItem>
              <SelectItem value="hip-hop">Hip-Hop</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.difficulty} onValueChange={(value) => updateFilter('difficulty', value)}>
            <SelectTrigger className="w-40 h-9 bg-white/80">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.trending} onValueChange={(value) => updateFilter('trending', value)}>
            <SelectTrigger className="w-40 h-9 bg-white/80">
              <SelectValue placeholder="Trending" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="hot">Hot</SelectItem>
              <SelectItem value="rising">Rising</SelectItem>
              <SelectItem value="stable">Stable</SelectItem>
              <SelectItem value="declining">Declining</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.competition} onValueChange={(value) => updateFilter('competition', value)}>
            <SelectTrigger className="w-40 h-9 bg-white/80">
              <SelectValue placeholder="Competition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="low">Low (0-40)</SelectItem>
              <SelectItem value="medium">Medium (41-70)</SelectItem>
              <SelectItem value="high">High (71-100)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 ml-auto">
            <SortAsc className="w-4 h-4 text-gray-600" />
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-44 h-9 bg-white/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opportunity_score">Opportunity Score</SelectItem>
                <SelectItem value="competition_score">Competition (Low to High)</SelectItem>
                <SelectItem value="search_volume">Search Volume</SelectItem>
                <SelectItem value="created_date">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
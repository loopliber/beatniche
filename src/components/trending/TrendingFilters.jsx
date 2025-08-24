import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from "lucide-react";

export default function TrendingFilters({ filters, onFiltersChange }) {
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

          <Select value={filters.competition} onValueChange={(value) => updateFilter('competition', value)}>
            <SelectTrigger className="w-40 h-9 bg-white/80">
              <SelectValue placeholder="Competition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Competition</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="oversaturated">Oversaturated</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.momentum} onValueChange={(value) => updateFilter('momentum', value)}>
            <SelectTrigger className="w-40 h-9 bg-white/80">
              <SelectValue placeholder="Momentum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Momentum</SelectItem>
              <SelectItem value="high">High (80+)</SelectItem>
              <SelectItem value="medium">Medium (50-79)</SelectItem>
              <SelectItem value="low">Low (&lt;50)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.genre} onValueChange={(value) => updateFilter('genre', value)}>
            <SelectTrigger className="w-40 h-9 bg-white/80">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              <SelectItem value="hip-hop">Hip-Hop</SelectItem>
              <SelectItem value="trap">Trap</SelectItem>
              <SelectItem value="drill">Drill</SelectItem>
              <SelectItem value="r&b">R&B</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.breakout} onValueChange={(value) => updateFilter('breakout', value)}>
            <SelectTrigger className="w-40 h-9 bg-white/80">
              <SelectValue placeholder="Breakout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Artists</SelectItem>
              <SelectItem value="yes">Breakout Potential</SelectItem>
              <SelectItem value="no">Established</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
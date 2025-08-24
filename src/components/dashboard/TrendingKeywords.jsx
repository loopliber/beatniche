import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Eye, Target, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TrendingKeywords({ keywords, isLoading }) {
  const getStatusColor = (status) => {
    const colors = {
      'hot': 'bg-red-50 text-red-700 border-red-200',
      'rising': 'bg-orange-50 text-orange-700 border-orange-200', 
      'stable': 'bg-blue-50 text-blue-700 border-blue-200',
      'declining': 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[status] || colors.stable;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'bg-green-50 text-green-700 border-green-200',
      'intermediate': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'advanced': 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[difficulty] || colors.intermediate;
  };

  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <div className="p-2 bg-black rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Top Opportunities
          </CardTitle>
          <Link to={createPageUrl("KeywordResearch")}>
            <Button variant="ghost" size="sm" className="hover:bg-gray-50 transition-colors font-medium">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {keywords.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No keywords tracked yet</p>
            <p className="text-sm">Start researching to see opportunities!</p>
          </div>
        ) : (
          keywords.slice(0, 6).map((keyword, index) => (
            <div key={keyword.id} className="group p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-black transition-colors">
                    {keyword.keyword}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(keyword.trending_status)} font-medium`} variant="secondary">
                      {keyword.trending_status}
                    </Badge>
                    <Badge className={`${getDifficultyColor(keyword.difficulty_level)} font-medium`} variant="secondary">
                      {keyword.difficulty_level}
                    </Badge>
                    {keyword.genre && (
                      <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                        {keyword.genre}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">
                    {keyword.opportunity_score}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Opportunity</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2 font-medium">Competition</div>
                  <Progress value={keyword.competition_score} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1 font-medium">{keyword.competition_score}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2 font-medium">Search Volume</div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-3 h-3 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">
                      {keyword.search_volume?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="font-medium">Avg Views: {keyword.avg_views?.toLocaleString() || 'N/A'}</span>
                <span className="font-medium">{keyword.upload_frequency || 0} uploads/month</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
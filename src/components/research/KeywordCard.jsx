import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Upload, 
  Target,
  Zap,
  Copy,
  ExternalLink
} from "lucide-react";

export default function KeywordCard({ keyword }) {
  const getStatusIcon = (status) => {
    const icons = {
      'hot': TrendingUp,
      'rising': TrendingUp,
      'stable': Target,
      'declining': TrendingDown
    };
    return icons[status] || Target;
  };

  const getStatusColor = (status) => {
    const colors = {
      'hot': 'bg-red-100 text-red-700 border-red-200',
      'rising': 'bg-orange-100 text-orange-700 border-orange-200',
      'stable': 'bg-blue-100 text-blue-700 border-blue-200',
      'declining': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[status] || colors.stable;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-700',
      'intermediate': 'bg-yellow-100 text-yellow-700',
      'advanced': 'bg-red-100 text-red-700'
    };
    return colors[difficulty] || colors.intermediate;
  };

  const getOpportunityGrade = (score) => {
    if (score >= 80) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 70) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { grade: 'B+', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 50) return { grade: 'B', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 40) return { grade: 'C', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const StatusIcon = getStatusIcon(keyword.trending_status);
  const opportunityGrade = getOpportunityGrade(keyword.opportunity_score);

  const copyKeyword = () => {
    navigator.clipboard.writeText(keyword.keyword);
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-300 group hover:scale-[1.01]">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {keyword.keyword}
              </h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={copyKeyword}
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-50"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={getStatusColor(keyword.trending_status)} variant="secondary">
                <StatusIcon className="w-3 h-3 mr-1" />
                {keyword.trending_status}
              </Badge>
              <Badge className={getDifficultyColor(keyword.difficulty_level)} variant="secondary">
                {keyword.difficulty_level}
              </Badge>
              {keyword.genre && (
                <Badge variant="outline" className="bg-white/50">
                  {keyword.genre}
                </Badge>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${opportunityGrade.bg} ${opportunityGrade.color} font-bold text-xl`}>
              {opportunityGrade.grade}
            </div>
            <p className="text-xs text-gray-500 mt-1">Opportunity</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Competition Level</span>
              <span className="text-sm font-bold text-gray-900">{keyword.competition_score}%</span>
            </div>
            <Progress 
              value={keyword.competition_score} 
              className="h-3"
              indicatorClassName={keyword.competition_score > 70 ? "bg-red-500" : keyword.competition_score > 40 ? "bg-yellow-500" : "bg-green-500"}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Opportunity Score</span>
              <span className="text-sm font-bold text-gray-900">{keyword.opportunity_score}%</span>
            </div>
            <Progress 
              value={keyword.opportunity_score} 
              className="h-3"
              indicatorClassName={keyword.opportunity_score > 70 ? "bg-green-500" : keyword.opportunity_score > 40 ? "bg-yellow-500" : "bg-red-500"}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-semibold text-gray-900">
                {keyword.search_volume?.toLocaleString() || 'N/A'}
              </p>
              <p className="text-gray-500 text-xs">Monthly Searches</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-semibold text-gray-900">
                {keyword.avg_views?.toLocaleString() || 'N/A'}
              </p>
              <p className="text-gray-500 text-xs">Avg Views</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-semibold text-gray-900">
                {keyword.upload_frequency || 0}
              </p>
              <p className="text-gray-500 text-xs">Uploads/Month</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-semibold text-gray-900">
                {keyword.opportunity_score >= 70 ? 'High' : keyword.opportunity_score >= 40 ? 'Medium' : 'Low'}
              </p>
              <p className="text-gray-500 text-xs">Potential</p>
            </div>
          </div>
        </div>

        {keyword.tags && keyword.tags.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600 mb-2">Suggested Tags:</p>
            <div className="flex flex-wrap gap-2">
              {keyword.tags.slice(0, 6).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Added {new Date(keyword.created_date).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
              <Target className="w-4 h-4 mr-2" />
              Track
            </Button>
            <Button variant="outline" size="sm" className="hover:bg-emerald-50 hover:border-emerald-300 transition-colors">
              <ExternalLink className="w-4 h-4 mr-2" />
              Analyze
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
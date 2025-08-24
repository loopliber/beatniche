import React, { useState, useEffect } from "react";
import { Keyword, TrendingArtist } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Eye, 
  Search, 
  Music,
  Sparkles,
  Flame,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import MetricCard from "../components/dashboard/MetricCard";
import TrendingKeywords from "../components/dashboard/TrendingKeywords";
import OpportunityFinder from "../components/dashboard/OpportunityFinder";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const [keywords, setKeywords] = useState([]);
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [keywordData, artistData] = await Promise.all([
        Keyword.list('-opportunity_score', 10),
        TrendingArtist.list('-trend_momentum', 5)
      ]);
      
      setKeywords(keywordData);
      setTrendingArtists(artistData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    const totalKeywords = keywords.length;
    const highOpportunity = keywords.filter(k => k.opportunity_score > 70).length;
    const avgCompetition = keywords.reduce((sum, k) => sum + k.competition_score, 0) / totalKeywords || 0;
    const risingTrends = trendingArtists.filter(a => a.trend_momentum > 80).length;

    return {
      totalKeywords,
      highOpportunity,
      avgCompetition: Math.round(avgCompetition),
      risingTrends
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 space-y-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                Dashboard
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Discover profitable type beat opportunities
              </p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Link to={createPageUrl("KeywordResearch")} className="flex-1 md:flex-none">
                <Button className="w-full bg-black hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                  <Search className="w-4 h-4 mr-2" />
                  Research Keywords
                </Button>
              </Link>
              <Link to={createPageUrl("TrendingArtists")} className="flex-1 md:flex-none">
                <Button variant="outline" className="w-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl transition-all duration-200">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Trends
                </Button>
              </Link>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <MetricCard
              title="Keywords Tracked"
              value={stats.totalKeywords}
              icon={Target}
              trend="+12% this week"
              trendUp={true}
              color="indigo"
            />
            <MetricCard
              title="High Opportunity"
              value={stats.highOpportunity}
              icon={Zap}
              trend="3 new today"
              trendUp={true}
              color="emerald"
            />
            <MetricCard
              title="Avg Competition"
              value={`${stats.avgCompetition}%`}
              icon={Eye}
              trend="-5% vs last week"
              trendUp={false}
              color="orange"
            />
            <MetricCard
              title="Rising Trends"
              value={stats.risingTrends}
              icon={Flame}
              trend="2 breaking out"
              trendUp={true}
              color="red"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Trending Keywords */}
            <div className="lg:col-span-2">
              <TrendingKeywords keywords={keywords} isLoading={isLoading} />
            </div>

            {/* Quick Actions */}
            <div>
              <QuickActions />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid lg:grid-cols-1 gap-8">
            <OpportunityFinder artists={trendingArtists} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
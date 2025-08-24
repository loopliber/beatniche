import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Sparkles, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const quickActions = [
  {
    title: "Find Keywords",
    description: "Discover profitable type beat niches",
    icon: Search,
    href: "KeywordResearch",
    color: "bg-indigo-500",
    bgColor: "bg-indigo-50 border-indigo-100"
  },
  {
    title: "Track Trends", 
    description: "Monitor rising artists and genres",
    icon: TrendingUp,
    href: "TrendingArtists",
    color: "bg-emerald-500",
    bgColor: "bg-emerald-50 border-emerald-100"
  },
  {
    title: "SEO Optimizer",
    description: "Generate optimized titles & tags",
    icon: Sparkles,
    href: "SEOTools",
    color: "bg-orange-500", 
    bgColor: "bg-orange-50 border-orange-100"
  }
];

export default function QuickActions() {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
          <div className="p-2 bg-black rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <Link key={index} to={createPageUrl(action.href)}>
            <div className={`p-4 rounded-xl border ${action.bgColor} hover:shadow-sm hover:scale-[1.02] transition-all duration-200 group cursor-pointer`}>
              <div className="flex items-center gap-4 w-full">
                <div className={`p-2.5 ${action.color} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-900 group-hover:text-black mb-1">
                    {action.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {action.description}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
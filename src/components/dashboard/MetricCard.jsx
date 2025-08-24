import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const colorClasses = {
  indigo: {
    bg: "bg-indigo-500",
    light: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-100"
  },
  emerald: {
    bg: "bg-emerald-500", 
    light: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100"
  },
  orange: {
    bg: "bg-orange-500",
    light: "bg-orange-50", 
    text: "text-orange-600",
    border: "border-orange-100"
  },
  red: {
    bg: "bg-red-500",
    light: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100"
  }
};

export default function MetricCard({ title, value, icon: Icon, trend, trendUp, color = "indigo" }) {
  const colors = colorClasses[color];
  
  return (
    <Card className={`bg-white border ${colors.border} hover:shadow-lg transition-all duration-300 group cursor-pointer`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className={`p-2.5 ${colors.light} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div className={`w-2 h-2 ${colors.bg} rounded-full opacity-60`} />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">
              {value}
            </p>
            
            {trend && (
              <div className="flex items-center gap-1.5">
                {trendUp ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                  {trend}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Hash, 
  FileText, 
  Copy,
  Sparkles,
  Zap,
  CheckCircle,
  Compass
} from "lucide-react";

import TitleGenerator from "../components/seo/TitleGenerator";
import TagSuggester from "../components/seo/TagSuggester";
import DescriptionBuilder from "../components/seo/DescriptionBuilder";

export default function SEOTools() {
  const [activeTab, setActiveTab] = useState("title");

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-600 bg-clip-text text-transparent">
              SEO Optimization Suite
            </h1>
            <p className="text-gray-600 text-lg">
              Generate optimized titles, tags, and descriptions for maximum visibility
            </p>
          </div>
        </div>

        {/* Tool Tabs */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card 
            className={`cursor-pointer transition-all duration-300 border-2 ${
              activeTab === "title" 
                ? "border-indigo-400 bg-gradient-to-r from-indigo-50 to-cyan-50 shadow-lg" 
                : "border-gray-200 hover:border-indigo-200 bg-white/80"
            }`}
            onClick={() => setActiveTab("title")}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                activeTab === "title" ? "bg-gradient-to-r from-indigo-500 to-cyan-500" : "bg-gray-100"
              }`}>
                <FileText className={`w-6 h-6 ${activeTab === "title" ? "text-white" : "text-gray-600"}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Title Generator</h3>
              <p className="text-sm text-gray-600">Create SEO-optimized titles that rank higher</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-300 border-2 ${
              activeTab === "tags" 
                ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg" 
                : "border-gray-200 hover:border-emerald-200 bg-white/80"
            }`}
            onClick={() => setActiveTab("tags")}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                activeTab === "tags" ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gray-100"
              }`}>
                <Hash className={`w-6 h-6 ${activeTab === "tags" ? "text-white" : "text-gray-600"}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Tag Suggester</h3>
              <p className="text-sm text-gray-600">Get 15-30 optimized tags for discovery</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-300 border-2 ${
              activeTab === "description" 
                ? "border-orange-400 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg" 
                : "border-gray-200 hover:border-orange-200 bg-white/80"
            }`}
            onClick={() => setActiveTab("description")}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                activeTab === "description" ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gray-100"
              }`}>
                <Target className={`w-6 h-6 ${activeTab === "description" ? "text-white" : "text-gray-600"}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Description Builder</h3>
              <p className="text-sm text-gray-600">Build keyword-rich descriptions</p>
            </CardContent>
          </Card>
        </div>

        {/* Tool Content */}
        <div className="space-y-6">
          {activeTab === "title" && <TitleGenerator />}
          {activeTab === "tags" && <TagSuggester />}
          {activeTab === "description" && <DescriptionBuilder />}
        </div>
      </div>
    </div>
  );
}
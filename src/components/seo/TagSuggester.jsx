
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Hash, Copy, CheckCircle, Sparkles } from "lucide-react";

export default function TagSuggester() {
  const [keyword, setKeyword] = useState("");
  const [generatedTags, setGeneratedTags] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateTags = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const baseTags = [
        keyword.toLowerCase(),
        `${keyword} type beat`,
        `${keyword} instrumental`,
        "type beat",
        "instrumental",
        "rap beat",
        "hip hop beat",
        "trap beat",
        "free beat",
        "beat",
        "producer",
        "music",
        "rap",
        "hip hop",
        "trap",
        "beats",
        "instrumentals",
        "type beats",
        "rap instrumentals",
        "hip hop instrumentals",
        "trap instrumentals",
        "free instrumentals",
        "beat maker",
        "music producer",
        "recording",
        "studio",
        "freestyle",
        "rap freestyle",
        "cypher beat",
        "hard beat"
      ];

      setGeneratedTags(baseTags.slice(0, 25));
      setIsGenerating(false);
    }, 800);
  };

  const copyAllTags = () => {
    const tagString = generatedTags.join(', ');
    navigator.clipboard.writeText(tagString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
            <Hash className="w-5 h-5 text-white" />
          </div>
          YouTube Tag Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Main Keyword/Artist</label>
            <Input
              placeholder="e.g., Drake, Dark Trap, Melodic Beat"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="text-lg placeholder:text-gray-400"
            />
          </div>

          <Button
            onClick={generateTags}
            disabled={isGenerating || !keyword.trim()}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 text-lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Generating Tags...
              </>
            ) : (
              <>
                <Hash className="w-5 h-5 mr-2" />
                Generate 25 Optimized Tags
              </>
            )}
          </Button>
        </div>

        {/* Generated Tags */}
        {generatedTags.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Generated Tags ({generatedTags.length})</h3>
              <Button
                variant="outline"
                onClick={copyAllTags}
                className="hover:bg-emerald-50 hover:border-emerald-300"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </>
                )}
              </Button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {generatedTags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-white border border-gray-200 hover:border-emerald-300 transition-colors cursor-default"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Tips:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use all 25 tags for maximum reach</li>
                <li>Mix broad and specific keywords</li>
                <li>Include your main keyword in multiple variations</li>
                <li>Copy and paste directly into YouTube</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

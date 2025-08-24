
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Copy, CheckCircle, Sparkles } from "lucide-react";

export default function TitleGenerator() {
  const [inputs, setInputs] = useState({
    artist: "",
    genre: "",
    mood: "",
    year: "2024"
  });
  const [generatedTitles, setGeneratedTitles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const generateTitles = () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const templates = [
        `${inputs.artist} Type Beat - "${inputs.mood}" | ${inputs.genre} Instrumental ${inputs.year}`,
        `"${inputs.mood}" ${inputs.artist} Type Beat | Hard ${inputs.genre} Instrumental`,
        `${inputs.artist} x [Artist] Type Beat - "${inputs.mood}" (${inputs.genre} ${inputs.year})`,
        `[FREE] ${inputs.artist} Type Beat "${inputs.mood}" | ${inputs.genre} Instrumental`,
        `${inputs.mood} ${inputs.artist} Type Beat | ${inputs.genre} Beat ${inputs.year}`,
        `"${inputs.mood}" - ${inputs.artist} Type Beat (${inputs.genre} Instrumental)`,
        `${inputs.artist} Type Beat - ${inputs.mood} ${inputs.genre} Beat | Free ${inputs.year}`,
        `${inputs.mood} ${inputs.genre} Beat | ${inputs.artist} Type Beat ${inputs.year}`
      ];

      setGeneratedTitles(templates.slice(0, 6));
      setIsGenerating(false);
    }, 1000);
  };

  const copyTitle = (title, index) => {
    navigator.clipboard.writeText(title);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getCharacterCount = (title) => {
    const count = title.length;
    if (count <= 60) return { count, color: 'text-green-600', bg: 'bg-green-100' };
    if (count <= 100) return { count, color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { count, color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          YouTube Title Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Artist/Style</label>
            <Input
              placeholder="e.g., Drake, Travis Scott"
              value={inputs.artist}
              onChange={(e) => setInputs({...inputs, artist: e.target.value})}
              className="placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Genre</label>
            <Select value={inputs.genre} onValueChange={(value) => setInputs({...inputs, genre: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Trap">Trap</SelectItem>
                <SelectItem value="Drill">Drill</SelectItem>
                <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                <SelectItem value="R&B">R&B</SelectItem>
                <SelectItem value="Afrobeat">Afrobeat</SelectItem>
                <SelectItem value="Pop">Pop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Mood/Vibe</label>
            <Input
              placeholder="e.g., Dark, Melodic, Hard"
              value={inputs.mood}
              onChange={(e) => setInputs({...inputs, mood: e.target.value})}
              className="placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Year</label>
            <Input
              value={inputs.year}
              onChange={(e) => setInputs({...inputs, year: e.target.value})}
              className="placeholder:text-gray-400"
            />
          </div>
        </div>

        <Button
          onClick={generateTitles}
          disabled={isGenerating || !inputs.artist || !inputs.genre}
          className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white py-3 text-lg"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Generating Titles...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Optimized Titles
            </>
          )}
        </Button>

        {/* Generated Titles */}
        {generatedTitles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated Titles</h3>
            <div className="space-y-3">
              {generatedTitles.map((title, index) => {
                const charInfo = getCharacterCount(title);
                return (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <p className="flex-1 font-medium text-gray-900 pr-4">{title}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyTitle(title, index)}
                        className="shrink-0 hover:bg-indigo-50"
                      >
                        {copiedIndex === index ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge className={`${charInfo.bg} ${charInfo.color} border-0`}>
                        {charInfo.count} characters
                      </Badge>
                      <div className="text-xs text-gray-500">
                        {charInfo.count <= 60 ? '✅ Optimal' : charInfo.count <= 100 ? '⚠️ Long' : '❌ Too Long'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

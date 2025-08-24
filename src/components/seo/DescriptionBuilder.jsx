
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Copy, CheckCircle, Sparkles } from "lucide-react";

export default function DescriptionBuilder() {
  const [inputs, setInputs] = useState({
    artist: "",
    genre: "",
    mood: "",
    bpm: "",
    key: "",
    contact: "",
    website: ""
  });
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateDescription = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const description = `🔥 ${inputs.artist} Type Beat - "${inputs.mood}" | ${inputs.genre} Instrumental

${inputs.bpm ? `⚡ BPM: ${inputs.bpm}` : ''}
${inputs.key ? `🎵 Key: ${inputs.key}` : ''}
${inputs.mood ? `🎨 Vibe: ${inputs.mood}` : ''}

This ${inputs.genre.toLowerCase()} instrumental is perfect for artists looking for that ${inputs.artist} sound. Professional quality beat ready for recording.

📧 For exclusive rights & custom beats:
${inputs.contact ? `Email: ${inputs.contact}` : 'Email: [Your Email]'}
${inputs.website ? `Website: ${inputs.website}` : 'Website: [Your Website]'}

🏷️ TAGS:
#${inputs.artist.replace(/\s+/g, '')}TypeBeat #${inputs.genre}Beat #TypeBeat #${inputs.mood}Beat #Instrumental #RapBeat #HipHopBeat #TrapBeat #FreeBeat #Beat #Producer #${inputs.artist.replace(/\s+/g, '')} #${inputs.genre} #Rap #HipHop

💰 License Information:
- This beat is free for non-profit use only
- Credit required: "Prod. by [Your Name]"
- For commercial use, purchase exclusive rights

🎧 More beats: [Link to your channel/playlist]
📱 Follow me: [Social media links]

© All rights reserved. Unauthorized distribution is prohibited.`;

      setGeneratedDescription(description);
      setIsGenerating(false);
    }, 1000);
  };

  const copyDescription = () => {
    navigator.clipboard.writeText(generatedDescription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          YouTube Description Builder
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
            <Input
              placeholder="e.g., Trap, Drill, Hip Hop"
              value={inputs.genre}
              onChange={(e) => setInputs({...inputs, genre: e.target.value})}
              className="placeholder:text-gray-400"
            />
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
            <label className="text-sm font-medium text-gray-700 mb-2 block">BPM</label>
            <Input
              placeholder="e.g., 140"
              value={inputs.bpm}
              onChange={(e) => setInputs({...inputs, bpm: e.target.value})}
              className="placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Key</label>
            <Input
              placeholder="e.g., C Minor, F# Major"
              value={inputs.key}
              onChange={(e) => setInputs({...inputs, key: e.target.value})}
              className="placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Contact Email</label>
            <Input
              placeholder="your@email.com"
              value={inputs.contact}
              onChange={(e) => setInputs({...inputs, contact: e.target.value})}
              className="placeholder:text-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Website/Portfolio</label>
          <Input
            placeholder="https://yourwebsite.com"
            value={inputs.website}
            onChange={(e) => setInputs({...inputs, website: e.target.value})}
            className="placeholder:text-gray-400"
          />
        </div>

        <Button
          onClick={generateDescription}
          disabled={isGenerating || !inputs.artist || !inputs.genre}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Building Description...
            </>
          ) : (
            <>
              <Target className="w-5 h-5 mr-2" />
              Generate SEO Description
            </>
          )}
        </Button>

        {/* Generated Description */}
        {generatedDescription && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Generated Description</h3>
              <Button
                variant="outline"
                onClick={copyDescription}
                className="hover:bg-orange-50 hover:border-orange-300"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Description
                  </>
                )}
              </Button>
            </div>

            <Textarea
              value={generatedDescription}
              onChange={(e) => setGeneratedDescription(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              placeholder="Generated description will appear here..."
            />

            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Description includes:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>SEO-optimized title and keywords</li>
                <li>Professional contact information</li>
                <li>Licensing and usage terms</li>
                <li>Relevant hashtags for discovery</li>
                <li>Beat specifications (BPM, Key)</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

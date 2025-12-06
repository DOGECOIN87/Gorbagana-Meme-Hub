"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanSearch, Terminal, Wand2 } from "lucide-react";
import { analyzePhotoForLooksmaxxing } from "@/ai/flows/photo-analysis-looksmaxxing";
import { PlaceHolderImages } from "@/lib/placeholder-images";

// A simple trick to get a data URI from a URL for the AI flow
async function toDataUri(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}


export default function AnalysisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analysisImage = PlaceHolderImages.find(p => p.id === 'analysis-photo');
  const imageUrl = analysisImage?.imageUrl ?? "https://picsum.photos/seed/109/600/600";
  const imageHint = analysisImage?.imageHint ?? "person serious";

  const handleAnalysis = async () => {
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    try {
      const dataUri = await toDataUri(imageUrl);
      const result = await analyzePhotoForLooksmaxxing({ photoDataUri: dataUri });
      setAnalysisResult(result.advice);
    } catch (err) {
      setError("Failed to analyze photo. The Gorbagana mainframe might be down.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex items-center gap-2 text-3xl font-bold text-primary mb-6 animate-float">
        <ScanSearch size={32} />
        <h1>Looksmaxxing Analysis</h1>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Your Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-accent/50 shadow-inner">
              <Image
                src={imageUrl}
                alt="Profile for analysis"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                data-ai-hint={imageHint}
              />
              {isLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center overflow-hidden">
                      <div className="animate-scan w-full h-full"></div>
                      <p className="text-primary font-bold text-2xl z-10 glitch-text">ANALYZING...</p>
                  </div>
              )}
            </div>
            <Button
              onClick={handleAnalysis}
              disabled={isLoading}
              className="w-full mt-4"
              size="lg"
            >
              {isLoading ? "Scanning..." : "Analyze Your Look"}
              <Wand2 className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="text-accent" />
              AI Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="font-code text-sm">
            {isLoading && (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {analysisResult && <p className="text-primary whitespace-pre-wrap">{analysisResult}</p>}
            {!isLoading && !analysisResult && !error && (
              <p className="text-muted-foreground">Click the analyze button to get your satirical looksmaxxing advice from the Gorbagana community AI.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

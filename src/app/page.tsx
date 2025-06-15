'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FeaturedFashion } from '@/components/featured-fashion';
import { DemoPlayback } from '@/components/demo-playback';
import { AIAssistantPanel } from '@/components/ai-assistant-panel';
import { getFashionKeywordsAction } from '@/lib/actions';
import { SAMPLE_IMAGE_DATA_URI } from '@/lib/static-data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiAssistantContext, setAiAssistantContext] = useState<string | undefined>(undefined);
  const [isDripSeekLoading, setIsDripSeekLoading] = useState(false);
  const { toast } = useToast();

  const handleDripSeekClick = async () => {
    setIsDripSeekLoading(true);
    setAiAssistantContext(undefined); // Reset context
    setIsAIAssistantOpen(true);

    try {
      // In a real app, you'd capture a snapshot here. We use a sample.
      const result = await getFashionKeywordsAction({ photoDataUri: SAMPLE_IMAGE_DATA_URI });
      if (result.success && result.data) {
        setAiAssistantContext(result.data.keywords);
        toast({
          title: "Keywords Found!",
          description: `AI identified: ${result.data.keywords}. Ask the assistant for more details!`,
        });
      } else {
        throw new Error(result.error || 'Failed to extract keywords.');
      }
    } catch (error) {
      setAiAssistantContext("Could not identify items. You can still ask general fashion questions!");
       toast({
        variant: "destructive",
        title: "DripSeek Error",
        description: error instanceof Error ? error.message : "Could not process the image.",
      });
    } finally {
      setIsDripSeekLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center py-16">
          <h1 className="text-5xl font-headline font-extrabold mb-6">
            Unlock On-Screen Style with <span className="text-primary">Fashion Decoder</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Instantly identify and explore fashion from your favorite shows and movies.
            Click the DripSeek button in our demo below to get started!
          </p>
          <Button size="lg" onClick={() => document.getElementById('demo-playback-section')?.scrollIntoView({ behavior: 'smooth' })}>
            <Sparkles className="mr-2 h-5 w-5" />
            Try Demo Now
          </Button>
        </section>
        
        <FeaturedFashion />
        
        <div id="demo-playback-section">
          <DemoPlayback onDripSeekClick={handleDripSeekClick} />
        </div>

        {isDripSeekLoading && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-[100]">
            <div className="bg-card p-8 rounded-lg shadow-xl text-center">
              <Sparkles className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-lg font-semibold">Decoding Fashion...</p>
              <p className="text-muted-foreground">Please wait a moment.</p>
            </div>
          </div>
        )}

      </main>
      <AIAssistantPanel
        isOpen={isAIAssistantOpen}
        onOpenChange={setIsAIAssistantOpen}
        initialContext={aiAssistantContext}
      />
      <Footer />
    </div>
  );
}

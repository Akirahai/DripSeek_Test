
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FeaturedFashion } from '@/components/featured-fashion';
import { DemoPlayback } from '@/components/demo-playback';
import { AIAssistantPanel } from '@/components/ai-assistant-panel';
import { getFashionKeywordsAction } from '@/lib/actions';
import { SAMPLE_IMAGE_DATA_URI, SAMPLE_XRAY_ITEMS } from '@/lib/static-data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import type { XRayFashionItem } from '@/lib/types';

export default function HomePage() {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [aiAssistantContext, setAiAssistantContext] = useState<string | undefined>(undefined);
  const [identifiedPanelItems, setIdentifiedPanelItems] = useState<XRayFashionItem[]>(SAMPLE_XRAY_ITEMS); // For "Identified Items" tab
  const [activeTabInPanel, setActiveTabInPanel] = useState<'chat' | 'identified' | 'suggestions'>('chat');
  const [isDripSeekLoading, setIsDripSeekLoading] = useState(false);
  const { toast } = useToast();

  const handleDripSeekClick = async () => {
    setIsDripSeekLoading(true);
    setAiAssistantContext(undefined); // Reset context
    setIdentifiedPanelItems(SAMPLE_XRAY_ITEMS); // Populate with sample items for demo
    setActiveTabInPanel('identified'); // Default to identified items tab on DripSeek
    setIsRightPanelOpen(true);

    try {
      const result = await getFashionKeywordsAction({ photoDataUri: SAMPLE_IMAGE_DATA_URI });
      if (result.success && result.data) {
        setAiAssistantContext(result.data.keywords);
        toast({
          title: "Fashion Decoded!",
          description: `Identified keywords: "${result.data.keywords}". Explore items or chat with the AI in the panel!`,
        });
      } else {
        throw new Error(result.error || 'Failed to extract keywords.');
      }
    } catch (error) {
      setAiAssistantContext("Could not identify items. Ask general fashion questions!");
       toast({
        variant: "destructive",
        title: "DripSeek Error",
        description: error instanceof Error ? error.message : "Could not process the image.",
      });
    } finally {
      setIsDripSeekLoading(false);
    }
  };

  // Handler for when an item is clicked (e.g., from X-Ray overlay or "Identified Items" tab in the right panel)
  const handleItemClickedForAIAssistance = (item: XRayFashionItem | { name: string; searchKeywords: string }) => {
    setAiAssistantContext(item.searchKeywords || item.name);
    // SAMPLE_XRAY_ITEMS is already used for the "Identified Items" tab, so no need to change it here.
    // If the X-Ray overlay provided different items, we might want to pass them to identifiedPanelItems.
    // For now, let's assume X-Ray items are a subset or similar to what DripSeek might find.
    setActiveTabInPanel('chat'); // Switch to chat tab for specific questions
    setIsRightPanelOpen(true);
     toast({
        title: `Exploring: ${item.name}`,
        description: "Ask the AI assistant for more details, styling tips, or where to find similar items!",
      });
  };
  
  const handlePanelClose = () => {
    setIsRightPanelOpen(false);
  }

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
            Try the DripSeek or X-Ray buttons in our demo below!
          </p>
          <Button size="lg" onClick={() => document.getElementById('demo-playback-section')?.scrollIntoView({ behavior: 'smooth' })}>
            <Sparkles className="mr-2 h-5 w-5" />
            Try Demo Now
          </Button>
        </section>
        
        <FeaturedFashion /> 
        
        <div id="demo-playback-section" className="flex flex-col md:flex-row gap-4 items-start">
          <div className={`transition-all duration-300 ease-in-out ${isRightPanelOpen ? 'md:w-2/3' : 'w-full'}`}>
            <DemoPlayback 
              onDripSeekClick={handleDripSeekClick}
              onXRayItemClicked={handleItemClickedForAIAssistance} // Pass handler for X-Ray item clicks
            />
          </div>
          
          {isRightPanelOpen && (
            <div className="w-full md:w-1/3 md:max-w-md lg:max-w-lg xl:max-w-xl h-[calc(var(--vh,1vh)*80)] md:h-auto md:sticky md:top-24">
              <AIAssistantPanel
                isOpen={isRightPanelOpen}
                onCloseRequest={handlePanelClose}
                initialContext={aiAssistantContext}
                identifiedItems={identifiedPanelItems} 
                onItemClickedForChat={handleItemClickedForAIAssistance}
                initialActiveTab={activeTabInPanel}
                onActiveTabChange={setActiveTabInPanel}
              />
            </div>
          )}
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
      <Footer />
    </div>
  );
}

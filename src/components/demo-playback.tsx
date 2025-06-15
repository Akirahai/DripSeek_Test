
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, PlayCircle, AlertTriangle, ListMusic } from 'lucide-react'; // Added ListMusic for X-Ray toggle
import { useToast } from '@/hooks/use-toast';
import { FashionXRayOverlay } from './fashion-xray-overlay'; // Import the X-Ray overlay
import type { XRayFashionItem } from '@/lib/types';
import { SAMPLE_XRAY_ITEMS } from '@/lib/static-data'; // For demo purposes

interface DemoPlaybackProps {
  onDripSeekClick: () => void;
  onXRayItemClicked: (item: XRayFashionItem) => void; // Callback when an X-Ray item is clicked
}

const DEFAULT_VIDEO_ID = "ia2Ph61bYzc"; 

function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  let videoId = null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    videoId = match[1];
  }
  return videoId;
}

export function DemoPlayback({ onDripSeekClick, onXRayItemClicked }: DemoPlaybackProps) {
  const [youtubeUrlInput, setYoutubeUrlInput] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(DEFAULT_VIDEO_ID);
  const [isLeftXRayOverlayVisible, setIsLeftXRayOverlayVisible] = useState(false);
  const { toast } = useToast();

  const handleLoadVideo = () => {
    const videoId = extractYouTubeVideoId(youtubeUrlInput);
    if (videoId) {
      setCurrentVideoId(videoId);
    } else {
      setCurrentVideoId(null);
      toast({
        variant: "destructive",
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video link and try again.",
      });
    }
  };

  const handleToggleLeftXRayOverlay = () => {
    setIsLeftXRayOverlayVisible(!isLeftXRayOverlayVisible);
  };

  const handleXRayItemClickAndCloseOverlay = (item: XRayFashionItem) => {
    onXRayItemClicked(item);
    // setIsLeftXRayOverlayVisible(false); // Optionally close overlay on item click, or leave it open
  };

  const embedUrl = currentVideoId ? `https://www.youtube.com/embed/${currentVideoId}` : '';

  return (
    <section className="py-12 bg-secondary rounded-lg">
      <div className="container mx-auto">
        <h2 className="text-3xl font-headline font-bold text-center mb-2">See It In Action</h2>
        <p className="text-lg text-muted-foreground text-center mb-6">
          Enter a YouTube URL or watch the demo. Click DripSeek to identify fashion or X-Ray for scene items!
        </p>
        <div className="flex flex-col sm:flex-row gap-2 mb-6 max-w-xl mx-auto">
          <Input
            type="url"
            value={youtubeUrlInput}
            onChange={(e) => setYoutubeUrlInput(e.target.value)}
            placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=...)"
            className="flex-grow bg-card"
            aria-label="YouTube video URL input"
          />
          <Button onClick={handleLoadVideo} variant="outline">
            <PlayCircle size={20} className="mr-2" /> Load Video
          </Button>
        </div>

        {currentVideoId ? (
          <div className="aspect-video bg-card rounded-lg shadow-2xl overflow-hidden relative mx-auto max-w-full group">
             <FashionXRayOverlay
              items={SAMPLE_XRAY_ITEMS} // Using sample items for demo
              onItemClick={handleXRayItemClickAndCloseOverlay}
              onClose={handleToggleLeftXRayOverlay}
              isVisible={isLeftXRayOverlayVisible}
            />
            <iframe
              key={currentVideoId}
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
            
            <div className="absolute top-4 left-4 z-40">
              <Button
                onClick={handleToggleLeftXRayOverlay}
                variant="secondary"
                size="icon"
                className="rounded-full shadow-lg"
                aria-label="Toggle X-Ray Overlay"
              >
                <ListMusic size={22} />
              </Button>
            </div>

            <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-40">
              <Button
                onClick={onDripSeekClick}
                variant="default"
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-xl animate-pulse hover:animate-none"
                aria-label="Activate DripSeek fashion recognition"
              >
                <Zap size={24} className="mr-2" />
                DripSeek
              </Button>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-card rounded-lg shadow-xl overflow-hidden relative mx-auto max-w-full flex flex-col items-center justify-center text-center p-8">
            <AlertTriangle size={48} className="text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Video Not Loaded</h3>
            <p className="text-muted-foreground">
              The YouTube URL was invalid or no video is currently loaded. Please enter a valid URL and click "Load Video".
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

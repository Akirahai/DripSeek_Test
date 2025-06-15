
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, PlayCircle, AlertTriangle, Film } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { XRayFashionItem } from '@/lib/types';
import { FashionXRayOverlay } from './fashion-xray-overlay'; // Import the new component

// Sample X-Ray items for demo
const SAMPLE_XRAY_ITEMS: XRayFashionItem[] = [
  { id: 'xr1', name: 'Elegant Red Evening Gown', imageUrl: 'https://placehold.co/100x150.png', dataAiHint: 'red gown', description: 'Worn by lead actress', searchKeywords: 'elegant red evening gown' },
  { id: 'xr2', name: 'Sharp Navy Blue Suit', imageUrl: 'https://placehold.co/100x150.png', dataAiHint: 'blue suit', description: 'Seen on main actor', searchKeywords: 'sharp navy blue suit' },
  { id: 'xr3', name: 'Vintage Leather Jacket', imageUrl: 'https://placehold.co/100x150.png', dataAiHint: 'leather jacket', description: 'Iconic scene outfit', searchKeywords: 'vintage leather jacket' },
  { id: 'xr4', name: 'Bohemian Floral Scarf', imageUrl: 'https://placehold.co/100x150.png', dataAiHint: 'floral scarf', description: 'Accessory detail', searchKeywords: 'bohemian floral scarf' },
];


interface DemoPlaybackProps {
  onDripSeekClick: () => void;
  onXRayItemClicked: (item: XRayFashionItem) => void; // Callback for when an X-Ray item is clicked
}

const DEFAULT_VIDEO_ID = "ia2Ph61bYzc"; // Default video

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
  const [isXRayVisible, setIsXRayVisible] = useState(false);
  const [currentXRayItems, setCurrentXRayItems] = useState<XRayFashionItem[]>([]);
  const { toast } = useToast();

  const handleLoadVideo = () => {
    const videoId = extractYouTubeVideoId(youtubeUrlInput);
    if (videoId) {
      setCurrentVideoId(videoId);
      setIsXRayVisible(false); // Close X-Ray when new video loads
    } else {
      setCurrentVideoId(null);
      toast({
        variant: "destructive",
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video link and try again.",
      });
    }
  };

  const handleToggleXRay = () => {
    if (!isXRayVisible) {
      // For demo, always show the same sample items.
      // In a real app, this might fetch items based on video ID or current timestamp.
      setCurrentXRayItems(SAMPLE_XRAY_ITEMS);
      toast({
        title: "Fashion X-Ray Activated",
        description: "Showing identified fashion items (simulated for demo). Click an item to ask the AI about it!",
      });
    }
    setIsXRayVisible(!isXRayVisible);
  };

  const handleXRayItemClickInternal = (item: XRayFashionItem) => {
    onXRayItemClicked(item);
    setIsXRayVisible(false); // Close X-Ray after item click
  };

  const embedUrl = currentVideoId ? `https://www.youtube.com/embed/${currentVideoId}` : '';

  return (
    <section className="py-12 bg-secondary">
      <div className="container mx-auto">
        <h2 className="text-3xl font-headline font-bold text-center mb-2">See It In Action</h2>
        <p className="text-lg text-muted-foreground text-center mb-6">
          Enter a YouTube URL or watch the demo. Click X-Ray to see (simulated) fashion items or DripSeek to identify from a scene!
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
          <div className="aspect-video bg-card rounded-lg shadow-2xl overflow-hidden relative mx-auto max-w-4xl group">
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
            
            {isXRayVisible && (
              <FashionXRayOverlay 
                items={currentXRayItems} 
                onClose={() => setIsXRayVisible(false)} 
                onItemClick={handleXRayItemClickInternal} 
              />
            )}

            <div className="absolute top-4 left-4 z-40 flex gap-2">
              <Button
                onClick={handleToggleXRay}
                variant="secondary"
                size="sm"
                className="bg-black/60 hover:bg-black/80 text-white rounded-md shadow-xl"
                aria-label="Toggle Fashion X-Ray"
              >
                <Film size={18} className="mr-1.5" /> X-Ray
              </Button>
              <div className="bg-black/50 text-white px-3 py-1.5 rounded text-xs h-fit">
                DEMO VIDEO
              </div>
            </div>

            <div className="absolute inset-0 bg-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {/* Overlay for hover effects if needed, but keep it non-interactive */}
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
          <div className="aspect-video bg-card rounded-lg shadow-xl overflow-hidden relative mx-auto max-w-4xl flex flex-col items-center justify-center text-center p-8">
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

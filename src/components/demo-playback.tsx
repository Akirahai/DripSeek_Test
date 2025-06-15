
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, PlayCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DemoPlaybackProps {
  onDripSeekClick: () => void;
}

const DEFAULT_VIDEO_ID = "ia2Ph61bYzc"; // Default video

// Helper function to extract YouTube video ID from various URL formats
function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  let videoId = null;
  // Regular expression to cover most YouTube URL formats
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    videoId = match[1];
  }
  return videoId;
}

export function DemoPlayback({ onDripSeekClick }: DemoPlaybackProps) {
  const [youtubeUrlInput, setYoutubeUrlInput] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(DEFAULT_VIDEO_ID);
  const { toast } = useToast();

  const handleLoadVideo = () => {
    const videoId = extractYouTubeVideoId(youtubeUrlInput);
    if (videoId) {
      setCurrentVideoId(videoId);
      // setYoutubeUrlInput(''); // Optionally clear input after successful load
    } else {
      setCurrentVideoId(null); // Clear video if URL is invalid
      toast({
        variant: "destructive",
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video link and try again.",
      });
    }
  };

  const embedUrl = currentVideoId ? `https://www.youtube.com/embed/${currentVideoId}` : '';

  return (
    <section className="py-12 bg-secondary">
      <div className="container mx-auto">
        <h2 className="text-3xl font-headline font-bold text-center mb-2">See It In Action</h2>
        <p className="text-lg text-muted-foreground text-center mb-6">
          Enter a YouTube URL below or watch the default demo. Click DripSeek to identify fashion!
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
              key={currentVideoId} // Add key to force iframe reload on src change
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {/* Controls overlay can be added here, pointer-events-none allows clicks to pass through */}
            </div>
            <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-10">
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
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm z-10">
              DEMO VIDEO
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-card rounded-lg shadow-xl overflow-hidden relative mx-auto max-w-4xl flex flex-col items-center justify-center text-center p-8">
            <AlertTriangle size={48} className="text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Video Not Loaded</h3>
            <p className="text-muted-foreground">
              The YouTube URL was invalid or no video is currently loaded. Please enter a valid URL in the field above and click "Load Video".
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

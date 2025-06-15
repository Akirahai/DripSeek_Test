
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react'; // Using Zap icon for DripSeek

interface DemoPlaybackProps {
  onDripSeekClick: () => void;
}

export function DemoPlayback({ onDripSeekClick }: DemoPlaybackProps) {
  const youtubeVideoId = "ia2Ph61bYzc"; // Extracted from https://www.youtube.com/watch?v=ia2Ph61bYzc
  const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}`;

  return (
    <section className="py-12 bg-secondary">
      <div className="container mx-auto">
        <h2 className="text-3xl font-headline font-bold text-center mb-2">See It In Action</h2>
        <p className="text-lg text-muted-foreground text-center mb-8">
          Click the DripSeek button on the demo player to discover fashion items.
        </p>
        <div className="aspect-video bg-card rounded-lg shadow-2xl overflow-hidden relative mx-auto max-w-4xl group">
          <iframe
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
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-10"> {/* Added z-10 to ensure button is above iframe */}
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
           <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm z-10"> {/* Added z-10 */}
            DEMO VIDEO
          </div>
        </div>
      </div>
    </section>
  );
}

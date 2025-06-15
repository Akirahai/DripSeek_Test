
'use client';

import Image from 'next/image';
import type { XRayFashionItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Search } from 'lucide-react';

interface FashionXRayOverlayProps {
  items: XRayFashionItem[];
  onClose: () => void;
  onItemClick: (item: XRayFashionItem) => void;
}

export function FashionXRayOverlay({ items, onClose, onItemClick }: FashionXRayOverlayProps) {
  return (
    <div className="absolute top-0 left-0 h-full w-full sm:w-2/5 md:w-1/3 bg-black/80 text-white p-4 z-30 flex flex-col shadow-2xl rounded-r-lg sm:rounded-r-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-headline">Fashion X-Ray</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X size={20} />
          <span className="sr-only">Close X-Ray</span>
        </Button>
      </div>
      <ScrollArea className="flex-grow">
        <div className="space-y-3">
          {items.length === 0 && (
            <p className="text-center text-gray-300">No fashion items identified for this scene currently.</p>
          )}
          {items.map((item) => (
            <Card 
              key={item.id} 
              className="bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border-none"
              onClick={() => onItemClick(item)}
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && onItemClick(item)}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div className="relative w-16 h-20 rounded overflow-hidden shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={item.dataAiHint || 'fashion item'}
                  />
                </div>
                <div className="flex-grow">
                  <CardTitle className="text-sm font-semibold text-white mb-0.5">{item.name}</CardTitle>
                  {item.description && <p className="text-xs text-gray-300 mb-1 truncate">{item.description}</p>}
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary hover:text-primary/80 text-xs">
                     <Search size={12} className="mr-1"/> Ask AI Assistant
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <p className="text-xs text-gray-400 mt-4 text-center">Items are illustrative for demo purposes.</p>
    </div>
  );
}

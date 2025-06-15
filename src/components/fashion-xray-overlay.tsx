
'use client';

import type { XRayFashionItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FashionXRayOverlayProps {
  items: XRayFashionItem[];
  onItemClick: (item: XRayFashionItem) => void;
  onClose: () => void;
  isVisible: boolean;
}

export function FashionXRayOverlay({ items, onItemClick, onClose, isVisible }: FashionXRayOverlayProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 h-full w-full sm:w-64 md:w-72 bg-black/70 backdrop-blur-sm p-4 z-30 overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">X-Ray</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X size={20} />
        </Button>
      </div>
      <div className="space-y-3 flex-grow">
        {items.length === 0 && (
          <p className="text-center text-neutral-300 py-8">No items identified in this scene.</p>
        )}
        {items.map((item) => (
          <Card
            key={item.id}
            className="bg-neutral-800/80 hover:bg-neutral-700/90 transition-colors cursor-pointer border-neutral-700"
            onClick={() => onItemClick(item)}
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onItemClick(item)}
          >
            <CardContent className="p-3 flex items-center gap-3">
              <div className="relative w-16 h-20 rounded overflow-hidden shrink-0 bg-neutral-700">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={item.dataAiHint || 'fashion item'}
                />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-semibold text-white mb-0.5">{item.name}</p>
                {item.description && <p className="text-xs text-neutral-300 mb-1 truncate">{item.description}</p>}
                <p className="text-xs text-primary hover:underline">Ask AI</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

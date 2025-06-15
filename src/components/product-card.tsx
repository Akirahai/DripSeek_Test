import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Palette, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="aspect-[3/4] relative w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={product.dataAiHint || 'fashion product'}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1 truncate" title={product.name}>{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Palette size={14} /> {product.color}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Tag size={14} /> {product.style}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <p className="text-xl font-semibold text-primary">{product.price}</p>
        <Button size="sm" variant="default" aria-label={`Shop ${product.name}`}>
          <ShoppingCart size={16} className="mr-2" /> Shop
        </Button>
      </CardFooter>
    </Card>
  );
}

import Image from 'next/image';
import { FEATURED_ITEMS } from '@/lib/static-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export function FeaturedFashion() {
  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-headline font-bold text-center mb-2">Featured Fashion</h2>
        <p className="text-lg text-muted-foreground text-center mb-8">
          Get inspired by the latest trends and iconic looks.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_ITEMS.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardHeader className="p-0">
                <div className="aspect-video relative w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={item.dataAiHint || 'fashion scene'}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl font-headline mb-2">{item.title}</CardTitle>
                <CardDescription className="text-muted-foreground mb-4 h-16 overflow-hidden text-ellipsis">
                  {item.description}
                </CardDescription>
                <Button variant="outline" className="w-full">
                  <Eye size={18} className="mr-2" /> Explore Looks
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

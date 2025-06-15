import { Shirt } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shirt size={32} />
          <h1 className="text-2xl font-headline font-bold">Fashion Decoder</h1>
        </div>
        {/* Navigation items can be added here if needed */}
      </div>
    </header>
  );
}

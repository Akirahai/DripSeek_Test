'use client';

import { useState, useMemo } from 'react';
import type { Product, ProductFiltersType } from '@/lib/types';
import { ALL_PRODUCTS } from '@/lib/static-data';
import { ProductCard } from './product-card';
import { ProductFilters } from './product-filters';
import { ScrollArea } from '@/components/ui/scroll-area';

const INITIAL_FILTERS: ProductFiltersType = {
  color: 'All',
  style: 'All',
  brand: 'All',
  priceRange: 'All',
};

export function FashionSuggestionsDisplay() {
  const [filters, setFilters] = useState<ProductFiltersType>(INITIAL_FILTERS);

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const colorMatch = filters.color === 'All' || product.color === filters.color;
      const styleMatch = filters.style === 'All' || product.style === filters.style;
      const brandMatch = filters.brand === 'All' || product.brand === filters.brand;
      
      let priceMatch = true;
      if (filters.priceRange !== 'All') {
        const productPrice = parseFloat(product.price.replace('€', ''));
        const [min, max] = filters.priceRange.split('-').map(parseFloat);
        if (filters.priceRange.endsWith('+')) {
            priceMatch = productPrice >= min;
        } else {
            priceMatch = productPrice >= min && productPrice <= max;
        }
      }
      
      return colorMatch && styleMatch && brandMatch && priceMatch;
    });
  }, [filters]);

  const handleFilterChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters);
  };
  
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="py-6">
      <h2 className="text-2xl font-headline font-semibold mb-2 px-4">Fashion Suggestions</h2>
      <p className="text-muted-foreground mb-6 px-4">
        Explore curated fashion items. Use filters to narrow down your search.
      </p>
      <ProductFilters filters={filters} onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} />
      
      {filteredProducts.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-400px)] px-4"> {/* Adjust height as needed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6"> {/* Adjusted xl:grid-cols-2 for better fit in Sheet */}
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          <p className="text-lg">No products match your current filters.</p>
          <p>Try adjusting your search or resetting the filters.</p>
        </div>
      )}
    </div>
  );
}

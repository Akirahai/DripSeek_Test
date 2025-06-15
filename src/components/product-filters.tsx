'use client';

import type { ProductFiltersType } from '@/lib/types';
import { AVAILABLE_COLORS, AVAILABLE_STYLES, AVAILABLE_BRANDS, PRICE_RANGES } from '@/lib/static-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from './ui/button';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFilterChange: (newFilters: ProductFiltersType) => void;
  onResetFilters: () => void;
}

export function ProductFilters({ filters, onFilterChange, onResetFilters }: ProductFiltersProps) {
  const handleSelectChange = (filterName: keyof ProductFiltersType, value: string) => {
    onFilterChange({ ...filters, [filterName]: value });
  };

  return (
    <div className="p-4 border-b mb-4 bg-card rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-headline font-semibold flex items-center">
          <SlidersHorizontal size={20} className="mr-2 text-primary" />
          Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={onResetFilters} className="text-muted-foreground hover:text-foreground">
           <RotateCcw size={16} className="mr-1" /> Reset
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="color-filter" className="text-sm font-medium">Color</Label>
          <Select
            value={filters.color}
            onValueChange={(value) => handleSelectChange('color', value)}
            
          >
            <SelectTrigger id="color-filter" className="w-full">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Colors</SelectItem>
              {AVAILABLE_COLORS.map((color) => (
                <SelectItem key={color} value={color}>{color}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="style-filter" className="text-sm font-medium">Style</Label>
          <Select
            value={filters.style}
            onValueChange={(value) => handleSelectChange('style', value)}
          >
            <SelectTrigger id="style-filter" className="w-full">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Styles</SelectItem>
              {AVAILABLE_STYLES.map((style) => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="brand-filter" className="text-sm font-medium">Brand</Label>
          <Select
            value={filters.brand}
            onValueChange={(value) => handleSelectChange('brand', value)}
          >
            <SelectTrigger id="brand-filter" className="w-full">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Brands</SelectItem>
              {AVAILABLE_BRANDS.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="price-filter" className="text-sm font-medium">Price Range</Label>
          <Select
            value={filters.priceRange}
            onValueChange={(value) => handleSelectChange('priceRange', value)}
          >
            <SelectTrigger id="price-filter" className="w-full">
              <SelectValue placeholder="Select price" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map((range) => (
                <SelectItem key={range} value={range}>{range === "All" ? "All Prices" : `€${range}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

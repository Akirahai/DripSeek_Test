import type { FeaturedItem, Product } from './types';

export const FEATURED_ITEMS: FeaturedItem[] = [
  {
    id: '1',
    title: 'Street Style Revolution',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'street style',
    description: 'Explore the latest trends from the streets of fashion capitals.',
  },
  {
    id: '2',
    title: 'Red Carpet Glamour',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'red carpet',
    description: 'Iconic looks from the most glamorous events.',
  },
  {
    id: '3',
    title: 'Vintage Vibes',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'vintage fashion',
    description: 'Timeless pieces that never go out of style.',
  },
];

export const ALL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Classic Blue Denim Jacket',
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'denim jacket',
    brand: 'Urban Threads',
    price: '€79.99',
    color: 'Blue',
    style: 'Casual',
    category: 'Outerwear',
  },
  {
    id: 'p2',
    name: 'Silk Floral Maxi Dress',
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'floral dress',
    brand: 'Boho Chic',
    price: '€129.00',
    color: 'Multicolor',
    style: 'Bohemian',
    category: 'Dresses',
  },
  {
    id: 'p3',
    name: 'Minimalist White Sneakers',
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'white sneakers',
    brand: 'Everlane',
    price: '€95.50',
    color: 'White',
    style: 'Minimalist',
    category: 'Shoes',
  },
  {
    id: 'p4',
    name: 'Leather Crossbody Bag',
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'leather bag',
    brand: 'Artisan Co.',
    price: '€150.00',
    color: 'Black',
    style: 'Chic',
    category: 'Accessories',
  },
  {
    id: 'p5',
    name: 'Cotton Graphic T-Shirt',
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'graphic t-shirt',
    brand: 'Street Smart',
    price: '€35.00',
    color: 'Gray',
    style: 'Streetwear',
    category: 'Tops',
  },
  {
    id: 'p6',
    name: 'Wool Blend Peacoat',
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'peacoat',
    brand: 'Heritage Line',
    price: '€220.00',
    color: 'Navy',
    style: 'Classic',
    category: 'Outerwear',
  },
   {
    id: 'p7',
    name: 'Striped Linen Shirt',
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'linen shirt',
    brand: 'Coastal Living',
    price: '€65.00',
    color: 'White',
    style: 'Relaxed',
    category: 'Tops',
  },
  {
    id: 'p8',
    name: 'High-Waisted Tailored Trousers',
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'tailored trousers',
    brand: 'Office Elegance',
    price: '€89.90',
    color: 'Beige',
    style: 'Formal',
    category: 'Bottoms',
  },
];

export const SAMPLE_IMAGE_DATA_URI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; // 1x1 Transparent Pixel, replace with a more meaningful small image if possible or instruct user. For testing, this is fine.
// A slightly more complex, small placeholder (e.g., a 10x10 colored square) might be better if the AI flow needs some visual input.
// Example 10x10 blue square:
// export const SAMPLE_IMAGE_DATA_URI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAAhKDveK6fL4AAAAAElFTkSuQmCC';

export const AVAILABLE_COLORS = Array.from(new Set(ALL_PRODUCTS.map(p => p.color)));
export const AVAILABLE_STYLES = Array.from(new Set(ALL_PRODUCTS.map(p => p.style)));
export const AVAILABLE_BRANDS = Array.from(new Set(ALL_PRODUCTS.map(p => p.brand)));
export const PRICE_RANGES = ["All", "0-50", "50-100", "100-200", "200+"];


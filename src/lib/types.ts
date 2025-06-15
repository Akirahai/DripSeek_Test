
export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  dataAiHint?: string;
  brand: string;
  price: string;
  color: string;
  style: string; // e.g., "Casual", "Formal", "Vintage"
  category: string; // e.g., "Tops", "Dresses", "Accessories"
}

export interface FeaturedItem {
  id: string;
  title: string;
  imageUrl: string;
  dataAiHint?: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export type ProductFiltersType = {
  color: string;
  style: string;
  brand: string;
  priceRange: string; // e.g. "0-50", "50-100", "100+"
};

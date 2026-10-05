export type StockTracking = {
  sku: string;
  warehouse: string;
  quantity: number;
  lowStockThreshold: number;
  reorderAuto: boolean;
  batchNumber?: string;
};

export type Specifications = {
  format?: string;
  dimensions?: string;
  weightGrams?: number;
  techStack?: string[];
  edition?: string;
  targetAudience?: string;
  customAttributes?: Record<string, string>;
};

export type Book = {
  id: string;
  title: string;
  slug?: string;
  author: string;
  genre: string;
  price: string;
  discountPercentage?: number;
  rating: number;
  description: string;
  publisher: string;
  publishedDate: string;
  isbn: string;
  pages: number;
  isFeatured?: boolean;
  stockTracking?: StockTracking;
  specifications?: Specifications;
  reviews: { reviewer: string; stars: number; comment: string; date: string; verifiedPurchase?: boolean }[];
  // Mongoose Virtuals
  inStock?: boolean;
  discountedPrice?: string | number;
  inventoryStatus?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
};

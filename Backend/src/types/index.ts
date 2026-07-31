export interface ProductFilterParams {
  q?: string;
  family?: string;
  gender?: string;
  occasion?: string;
  meter?: string;
  notes?: string;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

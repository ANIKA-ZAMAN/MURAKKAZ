export interface ReviewItem {
  id: string;
  name: string;
  avatar?: string;
  stars: number;
  quote: string;
  productName: string;
  productSlug: string;
  productImage: string;
  longevity: string;
  projection: string;
  compliments: string;
  verifiedPurchase: boolean;
  date: string;
}

export const customerReviews: ReviewItem[] = [];

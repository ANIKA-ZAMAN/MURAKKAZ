export interface Review {
  id?: string;
  name: string;
  avatar?: string;
  perfume: string;
  inspired: string;
  stars: number;
  quote: string;
  longevity: string;
  projection: string;
  compliments: string;
}

export const reviewsData: Review[] = [];
export const customerReviews = reviewsData;

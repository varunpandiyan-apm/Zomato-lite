export type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

export type RestaurantResponse = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

export interface Review {
  _id?: string;
  recipeId: string;
  userId: string;
  rating: number; // 1-5 stars
  comment?: string;
  photos?: string[]; // URLs to photos
  modifications?: {
    ingredient: string;
    change: string;
  }[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeToCook: number; // in minutes
  wouldMakeAgain: boolean;
  createdAt: Date;
  updatedAt: Date;
} 
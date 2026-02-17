export interface Recipe {
  _id?: string;
  title: string;
  cuisine: string;
  mealType?: string;
  dietaryRestrictions?: string[];
  ingredients: {
    name: string;
    quantity: string;
    unit?: string;
  }[];
  instructions: string[];
  cookingTime: number;
  servingSize: number;
  equipment?: string[];
  createdAt: Date;
  updatedAt: Date;
} 
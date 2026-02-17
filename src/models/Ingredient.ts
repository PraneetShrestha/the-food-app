export interface Ingredient {
  _id?: string;
  name: string;
  category: string; // e.g., 'vegetables', 'meat', 'spices'
  commonUnits: string[]; // e.g., ['g', 'kg', 'oz', 'lb']
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    servingSize?: string;
  };
  alternatives?: string[]; // Array of alternative ingredient names
  isCommon: boolean; // Whether this is a commonly used ingredient
  createdAt: Date;
  updatedAt: Date;
} 
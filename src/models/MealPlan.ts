export interface MealPlan {
  _id?: string;
  userId: string;
  weekStartDate: Date;
  meals: {
    date: Date;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    recipeId: string;
    notes?: string;
    isCompleted: boolean;
  }[];
  shoppingList?: {
    ingredientId: string;
    quantity: number;
    unit: string;
    isChecked: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
} 
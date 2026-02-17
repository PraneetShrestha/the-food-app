export interface User {
  _id?: string;
  email: string;
  name: string;
  password: string; // Hashed password
  preferences?: {
    dietaryRestrictions?: string[];
    allergies?: string[];
    favoriteCuisines?: string[];
    cookingSkillLevel?: 'beginner' | 'intermediate' | 'advanced';
  };
  savedRecipes?: string[]; // Array of recipe IDs
  createdAt: Date;
  updatedAt: Date;
}

import { supabase } from './supabase';
import type { Database } from './supabase';

type Recipe = Database['public']['Tables']['recipes']['Row'];
type RecipeInsert = Database['public']['Tables']['recipes']['Insert'];
type RecipeUpdate = Database['public']['Tables']['recipes']['Update'];

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export class SupabaseDB {
  // Recipe operations
  static async getRecipes(): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getRecipeById(id: string): Promise<Recipe | null> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createRecipe(recipe: RecipeInsert): Promise<Recipe> {
    const { data, error } = await supabase
      .from('recipes')
      .insert(recipe)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateRecipe(id: string, recipe: RecipeUpdate): Promise<Recipe> {
    const { data, error } = await supabase
      .from('recipes')
      .update({ ...recipe, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteRecipe(id: string): Promise<void> {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // User operations
  static async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createUser(user: UserInsert): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUser(id: string, user: UserUpdate): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({ ...user, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Search and filter operations
  static async searchRecipes(query: string): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .or(`title.ilike.%${query}%,cuisine.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getRecipesByCuisine(cuisine: string): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('cuisine', cuisine)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getRecipesByDietaryRestrictions(restrictions: string[]): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .overlaps('dietary_restrictions', restrictions)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
} 
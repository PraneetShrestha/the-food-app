import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (you can generate these from your Supabase dashboard)
export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: {
          id: string;
          title: string;
          cuisine: string;
          meal_type?: string;
          dietary_restrictions?: string[];
          ingredients: {
            name: string;
            quantity: string;
            unit?: string;
          }[];
          instructions: string[];
          cooking_time: number;
          serving_size: number;
          equipment?: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          cuisine: string;
          meal_type?: string;
          dietary_restrictions?: string[];
          ingredients: {
            name: string;
            quantity: string;
            unit?: string;
          }[];
          instructions: string[];
          cooking_time: number;
          serving_size: number;
          equipment?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          cuisine?: string;
          meal_type?: string;
          dietary_restrictions?: string[];
          ingredients?: {
            name: string;
            quantity: string;
            unit?: string;
          }[];
          instructions?: string[];
          cooking_time?: number;
          serving_size?: number;
          equipment?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          preferences?: {
            dietary_restrictions?: string[];
            allergies?: string[];
            favorite_cuisines?: string[];
            cooking_skill_level?: 'beginner' | 'intermediate' | 'advanced';
          };
          saved_recipes?: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          preferences?: {
            dietary_restrictions?: string[];
            allergies?: string[];
            favorite_cuisines?: string[];
            cooking_skill_level?: 'beginner' | 'intermediate' | 'advanced';
          };
          saved_recipes?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          preferences?: {
            dietary_restrictions?: string[];
            allergies?: string[];
            favorite_cuisines?: string[];
            cooking_skill_level?: 'beginner' | 'intermediate' | 'advanced';
          };
          saved_recipes?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 
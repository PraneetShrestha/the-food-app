import { NextResponse } from 'next/server';
import { SupabaseDB } from '@/lib/supabase-db';

export async function GET() {
  try {
    const recipes = await SupabaseDB.getRecipes();
    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const recipeData = await request.json();
    
    // Basic validation
    if (!recipeData.title || !recipeData.cuisine || !recipeData.ingredients || !recipeData.instructions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const recipe = await SupabaseDB.createRecipe({
      ...recipeData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
} 
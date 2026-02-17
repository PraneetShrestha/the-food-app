import { NextResponse } from 'next/server';
import { GeminiClient } from '@/app/client/gemini-client';

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();
    
    // Enhanced input validation
    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json({ error: 'Ingredients must be an array.' }, { status: 400 });
    }
    
    if (ingredients.length === 0) {
      return NextResponse.json({ error: 'Ingredients array cannot be empty.' }, { status: 400 });
    }
    
    if (!ingredients.every(ingredient => typeof ingredient === 'string' && ingredient.trim().length > 0)) {
      return NextResponse.json({ error: 'All ingredients must be non-empty strings.' }, { status: 400 });
    }

    const geminiClient = GeminiClient.getInstance();
    const recipe = await geminiClient.generateRecipeFromIngredients(ingredients);

    return NextResponse.json({ recipe });

  } catch (error) {
    console.error('Gemini error:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('authentication')) {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
      }
      if (error.message.includes('API error')) {
        return NextResponse.json({ error: 'Gemini API error' }, { status: 502 });
      }
    }
    
    return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 });
  }
} 
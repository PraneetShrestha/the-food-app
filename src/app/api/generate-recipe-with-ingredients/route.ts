import { NextResponse } from 'next/server';
import { GeminiClient } from '@/app/client/gemini-client';

export async function POST(request: Request) {
  try {
    const { cuisine, dietaryRestrictions, mealType } = await request.json();
    
    // Input validation
    if (!cuisine || typeof cuisine !== 'string') {
      return NextResponse.json({ error: 'Cuisine type is required.' }, { status: 400 });
    }

    const geminiClient = GeminiClient.getInstance();
    const recipe = await geminiClient.generateRecipeWithParameters({
      cuisine,
      mealType,
      dietaryRestrictions
    });

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
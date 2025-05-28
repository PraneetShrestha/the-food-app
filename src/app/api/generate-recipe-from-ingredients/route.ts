import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

const PROJECT_ID = process.env.GCP_PROJECT_ID;
// Force us-central1 as it's guaranteed to have Gemini Pro
const REGION = 'us-central1';
const MODEL = 'gemini-2.5-pro-preview-05-06';
const ENDPOINT = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:generateContent`;

// Validate required environment variables
if (!PROJECT_ID) {
  throw new Error('GCP_PROJECT_ID environment variable is required');
}

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();
    console.log(ENDPOINT);
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

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const vertexResponse = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{
            text: `Create a simple recipe using these ingredients: ${ingredients.join(', ')}. Include ingredients list, steps, and cooking time. Keep it concise.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 5000,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      }),
    });

    if (!vertexResponse.ok) {
      const errorData = await vertexResponse.json().catch(() => null);
      console.error('Vertex AI Error:', errorData);
      throw new Error(`Gemini API error: ${vertexResponse.status} ${errorData?.error?.message || vertexResponse.statusText}`);
    }

    const data = await vertexResponse.json();
    console.log('Gemini Response:', JSON.stringify(data, null, 2));

    // Handle the response based on the actual structure
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      // If we get a thought response, try to extract useful information
      const thought = data.candidates?.[0]?.content?.parts?.[0]?.thought;
      if (thought) {
        console.log('Received thought response:', thought);
        return NextResponse.json({ 
          recipe: "I apologize, but I couldn't generate a complete recipe. Please try again with fewer ingredients or a different combination."
        });
      }
      
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response format from Gemini');
    }

    return NextResponse.json({ recipe: content });

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
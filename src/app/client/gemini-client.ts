import { GoogleAuth } from 'google-auth-library';

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const REGION = 'us-central1';
const MODEL = 'gemini-2.5-pro';
const ENDPOINT = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:generateContent`;

// Validate required environment variables
if (!PROJECT_ID) {
  throw new Error('GCP_PROJECT_ID environment variable is required');
}

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        thought?: boolean;
      }>;
    };
  }>;
}

export class GeminiClient {
  private static instance: GeminiClient;
  private accessToken: string | null = null;

  private constructor() {}

  public static getInstance(): GeminiClient {
    if (!GeminiClient.instance) {
      GeminiClient.instance = new GeminiClient();
    }
    return GeminiClient.instance;
  }

  private async getAccessToken(): Promise<string> {
    if (!this.accessToken) {
      const client = await auth.getClient();
      const token = await client.getAccessToken();
      
      if (!token?.token) {
        throw new Error('Failed to get access token');
      }
      
      this.accessToken = token.token;
    }
    
    if (!this.accessToken) {
      throw new Error('Access token is not available');
    }
    
    return this.accessToken;
  }

  private async makeRequest(prompt: string): Promise<string> {
    const token = await this.getAccessToken();

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{
            text: prompt
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Vertex AI Error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${errorData?.error?.message || response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    console.log('Gemini Response:', JSON.stringify(data, null, 2));

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      const thought = data.candidates?.[0]?.content?.parts?.[0]?.thought;
      if (thought) {
        console.log('Received thought response:', thought);
        throw new Error("Couldn't generate a complete response. Please try again with different parameters.");
      }
      throw new Error('Invalid response format from Gemini');
    }

    return content;
  }

  public async generateRecipeFromIngredients(ingredients: string[]): Promise<string> {
    const prompt = `Create a simple recipe using these ingredients: ${ingredients.join(', ')}. Include ingredients list, steps, and cooking time. Keep it concise.`;
    return this.makeRequest(prompt);
  }

  public async generateRecipeWithParameters(params: {
    cuisine: string;
    mealType?: string;
    dietaryRestrictions?: string[];
  }): Promise<string> {
    let prompt = `Create a ${params.cuisine} recipe`;
    if (params.mealType) {
      prompt += ` for ${params.mealType}`;
    }
    if (params.dietaryRestrictions && params.dietaryRestrictions.length > 0) {
      prompt += ` that is ${params.dietaryRestrictions.join(', ')}`;
    }
    prompt += `. Please provide:\n1. A complete list of ingredients with quantities\n2. Step-by-step cooking instructions\n3. Estimated cooking time\n4. Serving size\n5. Any special equipment needed\nKeep the recipe simple and easy to follow.`;

    return this.makeRequest(prompt);
  }
}

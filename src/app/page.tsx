'use client';

import React, { useState } from 'react';

export default function Home() {
  // State for /api/generate-recipe-from-ingredients
  const [ingredients, setIngredients] = useState('');
  const [recipeResult, setRecipeResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // State for /api/generate-recipe-with-ingredients
  const [cuisine, setCuisine] = useState('');
  const [mealType, setMealType] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [recipeWithParams, setRecipeWithParams] = useState<string | null>(null);
  const [loadingParams, setLoadingParams] = useState(false);

  // Handler for /api/generate-recipe-from-ingredients
  const handleGenerateRecipe = async () => {
    setLoading(true);
    setRecipeResult(null);
    try {
      const res = await fetch('/api/generate-recipe-from-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredients.split(',').map(i => i.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      setRecipeResult(data.recipe || data.error || 'No recipe found.');
    } catch {
      setRecipeResult('Error fetching recipe.');
    }
    setLoading(false);
  };

  // Handler for /api/generate-recipe-with-ingredients
  const handleGenerateRecipeWithParams = async () => {
    setLoadingParams(true);
    setRecipeWithParams(null);
    try {
      const res = await fetch('/api/generate-recipe-with-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cuisine,
          mealType,
          dietaryRestrictions: dietaryRestrictions
            .split(',')
            .map(i => i.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      setRecipeWithParams(data.recipe || data.error || 'No recipe found.');
    } catch {
      setRecipeWithParams('Error fetching recipe.');
    }
    setLoadingParams(false);
  };

  return (
    <main style={{
      maxWidth: 600,
      margin: '2rem auto',
      fontFamily: 'system-ui, sans-serif',
      padding: 16
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Food App Demo</h1>

      <section style={{ marginBottom: 48, border: '1px solid #eee', borderRadius: 8, padding: 24 }}>
        <h2>Generate Recipe from Ingredients</h2>
        <input
          type="text"
          placeholder="Enter ingredients (comma separated)"
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, marginTop: 8 }}
        />
        <button
          onClick={handleGenerateRecipe}
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generating...' : 'Generate Recipe'}
        </button>
        {recipeResult && (
          <pre style={{
            background: '#f9f9f9',
            padding: 12,
            marginTop: 16,
            borderRadius: 4,
            whiteSpace: 'pre-wrap'
          }}>
            {recipeResult}
          </pre>
        )}
      </section>

      <section style={{ border: '1px solid #eee', borderRadius: 8, padding: 24 }}>
        <h2>Generate Recipe with Parameters</h2>
        <input
          type="text"
          placeholder="Cuisine (e.g. Italian)"
          value={cuisine}
          onChange={e => setCuisine(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, marginTop: 8 }}
        />
        <input
          type="text"
          placeholder="Meal Type (e.g. dinner)"
          value={mealType}
          onChange={e => setMealType(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="Dietary Restrictions (comma separated)"
          value={dietaryRestrictions}
          onChange={e => setDietaryRestrictions(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <button
          onClick={handleGenerateRecipeWithParams}
          disabled={loadingParams}
          style={{
            padding: '8px 16px',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: loadingParams ? 'not-allowed' : 'pointer'
          }}
        >
          {loadingParams ? 'Generating...' : 'Generate Recipe'}
        </button>
        {recipeWithParams && (
          <pre style={{
            background: '#f9f9f9',
            padding: 12,
            marginTop: 16,
            borderRadius: 4,
            whiteSpace: 'pre-wrap'
          }}>
            {recipeWithParams}
          </pre>
        )}
      </section>
    </main>
  );
}
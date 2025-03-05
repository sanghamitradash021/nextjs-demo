'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchMealTypeRecipes } from '../services/HomePage';

interface Recipe {
  recipe_id: number;
  title: string;
  description: string;
  image: string;
}

export function useMealTypeRecipes() {
  const searchParams = useSearchParams();
  const initialMealType = searchParams?.get('mealType') || null;
  const [selectedMealType, setSelectedMealType] = useState<string | null>(
    initialMealType
  );
  const [mealTypeRecipes, setMealTypeRecipes] = useState<Recipe[]>([]);

  const fetchMealTypeRecipesHandler = async (mealType: string) => {
    try {
      const recipes = await fetchMealTypeRecipes(mealType);
      setMealTypeRecipes(recipes);
      setSelectedMealType(mealType);
    } catch (error) {
      console.error('Failed to fetch meal type recipes:', error);
    }
  };

  return {
    selectedMealType,
    mealTypeRecipes,
    fetchMealTypeRecipesHandler,
  };
}

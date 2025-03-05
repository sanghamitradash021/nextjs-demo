'use client';

import React from 'react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import RecipeDetailContent from '../components/RecipeDetail';

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  ingredients: string[] | string;
  instructions: string;
  preparationTime: number;
  difficulty: string;
  cuisine: string;
  mealType: string;
  rating: number;
  user_id: number;
}

interface Comment {
  id: number;
  content: string;
  username: string;
  createdAt: string;
}

interface RecipeDetailClientProps {
  initialRecipe: Recipe | null;
  initialComments: Comment[];
  initialAverageRating: number | null;
}

const RecipeDetailClient: React.FC<RecipeDetailClientProps> = ({
  initialRecipe,
  initialComments,
  initialAverageRating,
}) => {
  return (
    <ThemeProvider>
      <RecipeDetailContent
        initialRecipe={initialRecipe}
        initialComments={initialComments}
        initialAverageRating={initialAverageRating}
      />
    </ThemeProvider>
  );
};

export default RecipeDetailClient;

'use client';

import React from 'react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import RecipeDetailContent from './RecipeDetail';

/**
 * Interface representing a Recipe object.
 * @interface Recipe
 * @property {number} id - The unique identifier for the recipe.
 * @property {string} title - The title of the recipe.
 * @property {string} description - A short description of the recipe.
 * @property {string} image - The URL of the recipe's image.
 * @property {string[] | string} ingredients - The list of ingredients for the recipe, can be a string or array of strings.
 * @property {string} instructions - The preparation instructions for the recipe.
 * @property {number} preparationTime - The preparation time in minutes.
 * @property {string} difficulty - The difficulty level of the recipe.
 * @property {string} cuisine - The cuisine type of the recipe.
 * @property {string} mealType - The type of meal (e.g., breakfast, lunch).
 * @property {number} rating - The average rating of the recipe.
 * @property {number} user_id - The ID of the user who created the recipe.
 */

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

/**
 * Interface representing a Comment object.
 * @interface Comment
 * @property {number} id - The unique identifier for the comment.
 * @property {string} content - The content of the comment.
 * @property {string} username - The username of the user who made the comment.
 * @property {string} createdAt - The date when the comment was created.
 */

interface Comment {
  id: number;
  content: string;
  username: string;
  createdAt: string;
}

/**
 * Props for the RecipeDetailClient component.
 * @interface RecipeDetailClientProps
 * @property {Recipe | null} initialRecipe - The initial recipe data to be displayed.
 * @property {Comment[]} initialComments - The initial list of comments for the recipe.
 * @property {number | null} initialAverageRating - The initial average rating of the recipe.
 */

interface RecipeDetailClientProps {
  initialRecipe: Recipe | null;
  initialComments: Comment[];
  initialAverageRating: number | null;
}

/**
 * RecipeDetailClient component that wraps RecipeDetailContent with the ThemeProvider.
 *
 * @component
 * @param {RecipeDetailClientProps} props - The properties passed to the component.
 * @returns {JSX.Element} - The JSX to render the component.
 */

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

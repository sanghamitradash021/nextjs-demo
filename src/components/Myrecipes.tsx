'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { MyRecipesConstants } from '../constants/MyrecipesConstant';

interface Recipe {
  id: number;
  recipe_id: number;
  title: string;
  description: string;
  image: string;
  cuisine: string;
  preparationTime: string;
  difficulty: string;
  createdAt: string;
}

interface RecipeListProps {
  initialRecipes: Recipe[];
  initialError: string | null;
}

const RecipeList: React.FC<RecipeListProps> = ({
  initialRecipes,
  initialError,
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [error, setError] = useState<string | null>(initialError);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();
  const { theme } = useTheme();

  const handleViewMore = (recipeId: number) => {
    router.push(`/recipe/${recipeId}`);
  };

  const sortedRecipes = [...recipes].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div
      className={`${
        theme === 'light'
          ? 'bg-gradient-to-r from-indigo-50 to-blue-50'
          : 'bg-gradient-to-r from-gray-800 to-gray-900'
      } min-h-screen p-8 `}
    >
      <h2
        className={`text-4xl font-extrabold text-center mb-12 mt-20 ${
          theme === 'light' ? 'text-indigo-800' : 'text-white'
        }`}
      >
        {MyRecipesConstants.title}
      </h2>

      <div className="flex justify-end mb-4">
        <select
          className={`border rounded-lg px-4 py-2 text-gray-700 shadow-md ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800 text-white'
          }`}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {error ? (
        <div className="flex justify-center items-center h-screen">
          <div
            className={`${
              theme === 'light'
                ? 'bg-red-100 border-red-500 text-red-700'
                : 'bg-red-900 border-red-700 text-red-100'
            } border-l-4 p-4`}
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedRecipes.length > 0 ? (
            sortedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className={`${MyRecipesConstants.recipeCardClasses} ${
                  theme === 'light' ? 'bg-white' : 'bg-gray-800 text-white'
                }`}
              >
                <div className="relative h-48">
                  <img
                    src={recipe.image || '/placeholder.svg'}
                    alt={recipe.title}
                    className={MyRecipesConstants.recipeImageClasses}
                  />
                  <div
                    className={`${MyRecipesConstants.recipeCuisineClasses} ${
                      theme === 'light' ? 'text-gray-900' : 'text-gray-300'
                    }`}
                  >
                    {recipe.cuisine}
                  </div>
                </div>
                <div
                  className={`${MyRecipesConstants.recipeDetailsClasses} ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}
                >
                  <h3
                    className={`${MyRecipesConstants.recipeTitleClasses} ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}
                  >
                    {recipe.title}
                  </h3>
                  <p
                    className={`${
                      MyRecipesConstants.recipeDescriptionClasses
                    } ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}
                  >
                    {recipe.description}
                  </p>
                  <div
                    className={`${MyRecipesConstants.recipeTimeClasses} ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}
                  >
                    <span>{recipe.preparationTime} mins</span>
                    <span
                      className={MyRecipesConstants.recipeDifficultyClasses}
                    >
                      {recipe.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={() => handleViewMore(recipe.recipe_id)}
                    className={`${MyRecipesConstants.viewRecipeButtonClasses} ${
                      theme === 'light'
                        ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                        : 'bg-indigo-700 text-white hover:bg-indigo-600'
                    }`}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center">
              <p
                className={`${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-300'
                } text-2xl`}
              >
                {MyRecipesConstants.noRecipesAvailableMessage}
              </p>
              <button
                onClick={() => router.push('/create-recipe')}
                className={`${MyRecipesConstants.createRecipeButtonClasses} ${
                  theme === 'light'
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                    : 'bg-indigo-700 text-white hover:bg-indigo-600'
                }`}
              >
                {MyRecipesConstants.createFirstRecipeMessage}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeList;

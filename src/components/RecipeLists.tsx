'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { CONSTANTS } from '../constants/RecipelistConstant';

interface Recipe {
  recipe_id: number;
  title: string;
  description: string;
  image: string;
  preparationTime: number;
  difficulty: string;
  cuisine: string;
  mealType: string;
}

interface RecipeListContentProps {
  initialRecipes: Recipe[];
}

const RecipeListContent: React.FC<RecipeListContentProps> = ({
  initialRecipes,
}) => {
  const [recipes] = useState<Recipe[]>(initialRecipes);
  const router = useRouter();
  const { theme } = useTheme();

  const handleRecipeClick = (id: number) => {
    router.push(`/recipes/${id}`);
  };

  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-5 ${
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      }`}
    >
      <h2
        className={`text-3xl font-bold mb-8 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}
      >
        {CONSTANTS.ALL_RECIPES_TITLE}
      </h2>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {recipes.map((recipe) => (
            <div
              key={recipe.recipe_id}
              className={`${
                theme === 'light' ? 'bg-white' : 'bg-gray-700'
              } rounded-lg shadow-lg overflow-hidden transition-all hover:scale-105 cursor-pointer`}
              onClick={() => handleRecipeClick(recipe.recipe_id)}
            >
              <div className="relative h-48">
                <img
                  src={recipe.image || '/images/default-recipe.jpg'}
                  alt={recipe.title}
                  className={CONSTANTS.RECIPE_IMAGE_CLASSES}
                />
                <div
                  className={`${
                    theme === 'light'
                      ? 'bg-gradient-to-t from-black/60 to-transparent'
                      : 'bg-gradient-to-t from-black/80 to-transparent'
                  } absolute inset-0`}
                >
                  <div className={CONSTANTS.RECIPE_CUISINE_CLASSES}>
                    {recipe.cuisine}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3
                  className={`${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  } ${CONSTANTS.RECIPE_TITLE_CLASSES}`}
                >
                  {recipe.title}
                </h3>
                <p
                  className={`${
                    theme === 'light' ? 'text-gray-600' : 'text-white'
                  } ${CONSTANTS.RECIPE_DESCRIPTION_CLASSES}`}
                >
                  {recipe.description}
                </p>
                <div
                  className={`flex justify-between items-center text-sm ${
                    theme === 'light' ? 'text-gray-500' : 'text-white'
                  }`}
                >
                  <span>{recipe.preparationTime} mins</span>
                  <span
                    className={`${
                      theme === 'light' ? 'text-gray-700' : 'text-black'
                    } ${CONSTANTS.RECIPE_DIFFICULTY_CLASSES}`}
                  >
                    {recipe.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p
          className={`text-xl text-center ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}
        >
          {CONSTANTS.NO_RECIPES_MESSAGE}
        </p>
      )}
    </div>
  );
};

export default RecipeListContent;

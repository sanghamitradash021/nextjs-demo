'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useMealTypeRecipes } from '../hooks/Mealtype';

export default function MealTypeRecipes() {
  const router = useRouter();
  const { theme } = useTheme();
  const { selectedMealType, mealTypeRecipes } = useMealTypeRecipes();

  const handleRecipeClick = (id?: number) => {
    if (id) {
      router.push(`/recipes/${id}`);
    } else {
      console.error('Invalid Recipe ID:', id);
    }
  };

  if (!selectedMealType) return null;

  return (
    <section>
      <h2
        className={`text-3xl font-bold ${
          theme === 'light' ? 'text-gray-900' : 'text-gray-100'
        } mb-8`}
      >
        {selectedMealType} Recipes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {mealTypeRecipes.length > 0 ? (
          mealTypeRecipes.map((recipe) => (
            <div
              key={recipe.recipe_id}
              className={`rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}
              onClick={() => handleRecipeClick(recipe.recipe_id)}
            >
              <img
                src={recipe.image || '/images/default-recipe.jpg'}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3
                  className={`text-lg font-semibold ${
                    theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                  } mb-2`}
                >
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                  {recipe.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No recipes found for {selectedMealType}.</p>
        )}
      </div>
      <div className="text-center mt-6">
        <button
          onClick={() => router.push(`/recipes/meal-type/${selectedMealType}`)}
          aria-label="Choose MealType"
          className={`px-6 py-3 rounded-lg font-medium text-lg transition-all duration-300 ${
            theme === 'light'
              ? 'bg-gray-900 text-white hover:bg-gray-700'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-300'
          }`}
        >
          View All
        </button>
      </div>
    </section>
  );
}

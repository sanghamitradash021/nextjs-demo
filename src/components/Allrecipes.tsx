'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { fetchAllRecipes } from '../services/HomePage';

interface Recipe {
  recipe_id: number;
  title: string;
  description: string;
  image: string;
}

export default function AllRecipes() {
  const router = useRouter();
  const { theme } = useTheme();
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const recipes = await fetchAllRecipes();
        setAllRecipes(recipes.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      }
    };

    loadRecipes();
  }, []);

  return (
    <section>
      <h2
        className={`text-3xl font-bold ${
          theme === 'light' ? 'text-gray-900' : 'text-gray-100'
        } mb-4`}
      >
        All Recipes
      </h2>
      <div className="overflow-x-auto whitespace-nowrap py-4">
        <div className="flex space-x-6">
          {allRecipes.map((recipe) => (
            <div
              key={recipe.recipe_id}
              className={`rounded-lg shadow-lg w-64 flex-shrink-0 overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}
              onClick={() => router.push(`/recipes/${recipe.recipe_id}`)}
            >
              <img
                src={recipe.image || '/images/default-recipe.jpg'}
                alt={recipe.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3
                  className={`text-lg font-semibold ${
                    theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                  } mb-1`}
                >
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {recipe.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-6">
        <button
          onClick={() => router.push('/recipes')}
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

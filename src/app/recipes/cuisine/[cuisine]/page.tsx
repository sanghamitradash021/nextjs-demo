'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

interface Recipe {
  recipe_id: number;
  title: string;
  description: string;
  image: string;
}

interface CuisineRecipesProps {
  theme: 'light' | 'dark';
}

// Modify Params to match the Next.js params type
interface Params {
  [key: string]: string | string[] | undefined; // Allow any string keys
}

const CuisineRecipes: React.FC = () => {
  // Explicitly type the params and handle potential null
  const { cuisine } = useParams<Params>();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Ensure cuisine is a valid string
    if (!cuisine || Array.isArray(cuisine)) {
      setError('Invalid cuisine parameter');
      return;
    }

    const fetchRecipes = async () => {
      try {
        console.log('Fetching recipes for cuisine:', cuisine);
        const response = await axios.get(`/api/recipes/cuisine/${cuisine}`);
        setRecipes(response.data);
        setError(null); // Reset error if successful
      } catch (error: any) {
        console.error('Failed to fetch recipes:', error);
        setError(error.response?.data?.message || 'Something went wrong');
      }
    };

    fetchRecipes();
  }, [cuisine]);

  return (
    <ThemeProvider>
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
          theme === 'light' ? 'bg-white' : 'bg-gray-900'
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-8 ${
            theme === 'light' ? 'text-gray-900' : 'text-gray-100'
          }`}
        >
          {cuisine ? `${cuisine} Recipes` : 'Loading...'}
        </h2>

        {error ? (
          <p
            className={`${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}
          >
            Error: {error}
          </p>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {recipes.map((recipe) => (
              <div
                key={recipe.recipe_id}
                className={`${
                  theme === 'light' ? 'bg-white' : 'bg-gray-800'
                } rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                onClick={() => router.push(`/recipes/${recipe.recipe_id}`)}
              >
                <img
                  src={recipe.image || '/images/default-recipe.jpg'}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div
                  className={`p-4 ${
                    theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                    }`}
                  >
                    {recipe.title}
                  </h3>
                  <p
                    className={`text-sm line-clamp-2 mb-3 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}
                  >
                    {recipe.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p
            className={`${
              theme === 'light' ? 'text-gray-900' : 'text-gray-100'
            }`}
          >
            No recipes found for {cuisine || 'this cuisine'}.
          </p>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CuisineRecipes;

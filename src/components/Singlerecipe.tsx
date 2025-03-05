'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import EditRecipeModal from '../components/EditRecipeModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@/context/ThemeContext';
import {
  API_URL,
  PLACEHOLDER_IMAGE,
  TOAST_SUCCESS_MESSAGE,
  TOAST_ERROR_MESSAGE,
  DELETE_CONFIRMATION_MESSAGE,
  ERROR_DELETING_RECIPE,
} from '../constants/SinglepageConstant';

interface Recipe {
  recipe_id: number;
  title: string;
  description: string;
  ingredients: string[] | string;
  instructions: string;
  preparationTime: number;
  difficulty: string;
  image: string;
  cuisine: string;
  mealType: string;
  createdAt: string;
  updatedAt: string;
}

interface SingleRecipeClientProps {
  initialRecipe: Recipe | null;
  initialError: string | null;
}

const SingleRecipeClient: React.FC<SingleRecipeClientProps> = ({
  initialRecipe,
  initialError,
}) => {
  const [recipe, setRecipe] = useState<Recipe | null>(initialRecipe);
  const [error, setError] = useState<string | null>(initialError);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const handleDelete = async () => {
    const confirmed = window.confirm(DELETE_CONFIRMATION_MESSAGE);
    if (confirmed) {
      try {
        const token = sessionStorage.getItem('token');
        await axios.delete(`${API_URL}${recipe?.recipe_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Recipe deleted successfully!');
        router.push('/my-recipes');
      } catch (error) {
        console.error('Error deleting recipe:', error);
        toast.error(ERROR_DELETING_RECIPE);
      }
    }
  };

  const refreshRecipe = async () => {
    if (!recipe?.recipe_id) return;

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${API_URL}${recipe.recipe_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipe(response.data);
    } catch (error) {
      console.error('Error fetching updated recipe:', error);
      toast.error(TOAST_ERROR_MESSAGE);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!recipe) return <p>No recipe found</p>;

  return (
    <>
      <div
        className={`min-h-screen bg-gradient-to-b ${
          theme === 'light' ? 'from-gray-50 to-white' : 'from-gray-800 to-black'
        } px-4 py-16`}
      >
        <article className="mx-auto max-w-4xl space-y-8">
          <div
            className={`overflow-hidden rounded-2xl shadow-lg ${
              theme === 'light' ? 'bg-white' : 'bg-gray-800'
            }`}
          >
            <div className="relative h-[400px] w-full">
              <img
                src={recipe.image || PLACEHOLDER_IMAGE}
                alt={recipe.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8">
              <h1 className="text-4xl font-bold">{recipe.title}</h1>
              <p className="text-lg text-gray-600">{recipe.description}</p>
            </div>

            <div className="grid gap-8 p-8 lg:grid-cols-3">
              <div className="lg:col-span-2 lg:border-r lg:pr-8">
                <section className="mb-8">
                  <h2 className="mb-4 flex items-center text-xl font-semibold">
                    Ingredients
                  </h2>
                  <ul className="list-inside list-disc space-y-2">
                    {Array.isArray(recipe.ingredients)
                      ? recipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="text-gray-600">
                            {ingredient}
                          </li>
                        ))
                      : recipe.ingredients
                      ? recipe.ingredients
                          .split('\n')
                          .map((ingredient, index) => (
                            <li key={index} className="text-gray-600">
                              {ingredient}
                            </li>
                          ))
                      : null}
                  </ul>
                </section>

                <section>
                  <h2 className="mb-4 flex items-center text-xl font-semibold">
                    Instructions
                  </h2>
                  <p className="whitespace-pre-wrap text-gray-600">
                    {recipe.instructions}
                  </p>
                </section>
              </div>

              <div className="space-y-6 lg:col-span-1">
                <div className="rounded-lg p-6 bg-gray-50">
                  <h3 className="mb-4 text-lg font-semibold">Recipe Details</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="flex items-center text-sm font-medium text-gray-500">
                        Preparation Time
                      </dt>
                      <dd className="mt-1 text-gray-700">
                        {recipe.preparationTime} minutes
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center text-sm font-medium text-gray-500">
                        Difficulty
                      </dt>
                      <dd className="mt-1 text-gray-700">
                        {recipe.difficulty}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center text-sm font-medium text-gray-500">
                        Cuisine
                      </dt>
                      <dd className="mt-1 text-gray-700">{recipe.cuisine}</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                  >
                    Edit Recipe
                  </button>
                  <button
                    onClick={handleDelete}
                    className="border border-red-200 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 ml-4"
                  >
                    Delete Recipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {showEditModal && (
          <EditRecipeModal
            recipe={{
              ...recipe,
              ingredients: Array.isArray(recipe.ingredients)
                ? recipe.ingredients.join(', ')
                : recipe.ingredients,
              preparationTime: recipe.preparationTime.toString(),
            }}
            onClose={() => {
              setShowEditModal(false);
              refreshRecipe();
            }}
            onUpdate={(updatedRecipe) => {
              setRecipe(updatedRecipe);
              toast.success(TOAST_SUCCESS_MESSAGE);
            }}
          />
        )}

        <ToastContainer />
      </div>
    </>
  );
};

export default SingleRecipeClient;

import { useState } from 'react';
import axios from 'axios';
import { FORM_LABELS } from '../constants/formlabels';
import Cookies from 'js-cookie';

interface EditRecipeModalProps {
  recipe: {
    recipe_id: number;
    title: string;
    description: string;
    ingredients: string;
    instructions: string;
    preparationTime: string;
    difficulty: string;
    cuisine: string;
    mealType: string;
    image?: string;
  };
  onClose: () => void;
  onUpdate: (updatedRecipe: any) => void;
}

const EditRecipeModal: React.FC<EditRecipeModalProps> = ({
  recipe,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    title: recipe.title,
    description: recipe.description,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    preparationTime: recipe.preparationTime,
    difficulty: recipe.difficulty,
    cuisine: recipe.cuisine,
    mealType: recipe.mealType,
    image: recipe.image || '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookies.get('auth_token');
      const response = await axios.put(
        `/api/recipes/${recipe.recipe_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Failed to update recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl max-h-[90vh]">
          <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Edit Recipe</h2>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-1 text-white hover:bg-white/20"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6 p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {FORM_LABELS.recipeTitle || 'Recipe Title'}
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2.5 transition-colors focus:border-purple-500 focus:bg-white focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {FORM_LABELS.description || 'Description'}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2.5 transition-colors focus:border-purple-500 focus:bg-white focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {FORM_LABELS.ingredients || 'Ingredients'}
                </label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2.5 transition-colors focus:border-purple-500 focus:bg-white focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {FORM_LABELS.instructions || 'Instructions'}
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2.5 transition-colors focus:border-purple-500 focus:bg-white focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {FORM_LABELS.preparationTime || 'Preparation Time (minutes)'}
                </label>
                <input
                  type="number"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2.5 transition-colors focus:border-purple-500 focus:bg-white focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {FORM_LABELS.difficulty || 'Difficulty'}
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2.5 transition-colors focus:border-purple-500 focus:bg-white focus:ring-purple-500"
                    required
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {FORM_LABELS.cuisine || 'Cuisine'}
                  </label>
                  <select
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2.5 transition-colors focus:border-purple-500 focus:bg-white focus:ring-purple-500"
                    required
                  >
                    <option value="indian">Indian</option>
                    <option value="italian">Italian</option>
                    <option value="chinese">Chinese</option>
                    <option value="mexican">Mexican</option>
                    <option value="japanese">Japanese</option>
                    <option value="thai">Thai</option>
                    <option value="american">American</option>
                    <option value="anglo-indian">Anglo-Indian</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {FORM_LABELS.mealType || 'Meal Type'}
                  </label>
                  <select
                    name="mealType"
                    value={formData.mealType}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2.5 transition-colors focus:border-purple-500 focus:bg-white focus:ring-purple-500"
                    required
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {FORM_LABELS.recipeImage || 'Recipe Image URL'}
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2.5 transition-colors focus:border-purple-500 focus:bg-white focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 border-t pt-6">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                aria-label="Update Recipe"
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {loading ? 'Updating...' : 'Update Recipe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRecipeModal;

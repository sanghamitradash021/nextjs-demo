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
  const [formData, setFormData] = useState({ ...recipe });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookies.get('auth_token');
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${recipe.recipe_id}`,
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
              &times;
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6 p-6">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="text-sm font-medium text-gray-700">
                  {FORM_LABELS[key as keyof typeof FORM_LABELS] || key}
                </label>
                <input
                  type="text"
                  name={key}
                  value={value as string}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2.5"
                  required
                />
              </div>
            ))}
            <div className="flex items-center justify-end space-x-4 border-t pt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white"
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

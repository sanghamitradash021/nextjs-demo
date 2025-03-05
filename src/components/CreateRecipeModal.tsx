// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import Cookies from 'js-cookie';

// interface CreateRecipeModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dmenponou/image/upload';
// const CLOUDINARY_UPLOAD_PRESET = 'image_upload';

// const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({
//   isOpen,
//   onClose,
//   onSuccess,
// }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     ingredients: '',
//     instructions: '',
//     preparationTime: '',
//     difficulty: 'medium',
//     mealType: 'lunch',
//     cuisine: 'indian',
//     image: null as string | null,
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [uploading, setUploading] = useState(false);

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setUploading(true);
//       setError('');

//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('cloud_name', 'dmenponou');
//       formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

//       try {
//         const response = await axios.post(CLOUDINARY_URL, formData);
//         setFormData((prev) => ({ ...prev, image: response.data.secure_url }));
//       } catch (err) {
//         setError('Image upload failed. Try again.');
//       } finally {
//         setUploading(false);
//       }
//     }
//   };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   setError('');

//   //   try {
//   //     const token = Cookies.get('auth_token');
//   //     if (!token) {
//   //       setError('User is not authenticated.');
//   //       return;
//   //     }

//   //     const decodedToken: any = jwtDecode(token);
//   //     const userId = decodedToken?.id;

//   //     if (!userId) {
//   //       setError('User ID not found in token.');
//   //       return;
//   //     }

//   //     // Create FormData to send to the backend
//   //     const formDataToSend = new FormData();
//   //     formDataToSend.append('user_id', userId);

//   //     // Append the rest of the form fields to formData
//   //     Object.entries(formData).forEach(([key, value]) => {
//   //       if (value !== null && key !== 'image') {
//   //         formDataToSend.append(key, value);
//   //       }
//   //     });

//   //     if (formData.image) {
//   //       formDataToSend.append('image', formData.image);
//   //     }

//   //     // Make the API call to create the recipe
//   //     await axios.post('/api/recipes/create', formDataToSend, {
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //     });

//   //     onSuccess();
//   //     onClose();
//   //   } catch (err) {
//   //     setError('Failed to create recipe. Please try again.');
//   //     console.error('Error creating recipe:', err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const token = Cookies.get('auth_token');
//       if (!token) {
//         setError('User is not authenticated.');
//         return;
//       }

//       const decodedToken: any = jwtDecode(token);
//       const userId = decodedToken?.id;

//       if (!userId) {
//         setError('User ID not found in token.');
//         return;
//       }

//       // Create FormData to send to the backend
//       const formDataToSend = new FormData();
//       formDataToSend.append('user_id', userId);

//       // Append the rest of the form fields to formData
//       // Object.entries(formData).forEach(([key, value]) => {
//       //   if (value !== null && key !== 'image') {
//       //     formDataToSend.append(key, value);
//       //   }
//       // });

//       // if (formData.image) {
//       //   formDataToSend.append('image', formData.image);
//       // }

//       const recipeData = {
//         title: formData.title,
//         user_id: userId,
//         description: formData.description,
//         ingredients: formData.ingredients,
//         instructions: formData.instructions,
//         preparationTime: formData.preparationTime,
//         difficulty: formData.difficulty,
//         cuisine: formData.cuisine,
//         mealType: formData.mealType,
//         image: formData.image,
//       };

//       // Make the API call to create the recipe
//       await axios.post('/api/recipes/create', recipeData, {
//         headers: {
//           // 'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//           // Do not manually set Content-Type when using FormData
//         },
//       });

//       onSuccess();
//       onClose();
//     } catch (err) {
//       setError('Failed to create recipe. Please try again.');
//       console.error('Error creating recipe:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
//             Create Your Culinary Masterpiece
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
//             <p className="font-semibold">Oops! Something went wrong:</p>
//             <p>{error}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Recipe Title
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 required
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
//                 placeholder="E.g., vegetable soup"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Preparation Time (minutes)
//               </label>
//               <input
//                 type="number"
//                 name="preparationTime"
//                 required
//                 value={formData.preparationTime}
//                 onChange={handleInputChange}
//                 min="1"
//                 className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
//                 placeholder="E.g., 45"
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Description
//             </label>
//             <textarea
//               name="description"
//               required
//               value={formData.description}
//               onChange={handleInputChange}
//               rows={3}
//               className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
//               placeholder="Describe your recipe in a few sentences..."
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Ingredients
//             </label>
//             <textarea
//               name="ingredients"
//               required
//               value={formData.ingredients}
//               onChange={handleInputChange}
//               rows={4}
//               className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
//               placeholder="Enter ingredients, one per line"
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Instructions
//             </label>
//             <textarea
//               name="instructions"
//               required
//               value={formData.instructions}
//               onChange={handleInputChange}
//               rows={4}
//               className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
//               placeholder="Enter step-by-step instructions"
//             />
//           </div>

//           <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Difficulty
//               </label>
//               <select
//                 name="difficulty"
//                 value={formData.difficulty}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
//               >
//                 <option value="easy">Easy</option>
//                 <option value="medium">Medium</option>
//                 <option value="hard">Hard</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Meal Type
//               </label>
//               <select
//                 name="mealType"
//                 value={formData.mealType}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
//               >
//                 <option value="breakfast">Breakfast</option>
//                 <option value="lunch">Lunch</option>
//                 <option value="dinner">Dinner</option>
//                 <option value="snack">Snack</option>
//                 <option value="dessert">Dessert</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Cuisine
//               </label>
//               <select
//                 name="cuisine"
//                 value={formData.cuisine}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
//               >
//                 <option value="indian">Indian</option>
//                 <option value="italian">Italian</option>
//                 <option value="chinese">Chinese</option>
//                 <option value="mexican">Mexican</option>
//                 <option value="japanese">Japanese</option>
//                 <option value="thai">Thai</option>
//                 <option value="american">American</option>
//                 <option value="anglo-indian">Anglo-Indian</option>
//               </select>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Recipe Image
//             </label>
//             <input
//               type="file"
//               name="image"
//               accept="image/*"
//               onChange={handleImageChange}
//               disabled={uploading}
//               className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-200"
//             />
//             {uploading && (
//               <p className="text-sm text-indigo-500">Uploading image...</p>
//             )}
//           </div>

//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full border border-transparent shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full border border-transparent shadow-sm hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
//             >
//               {loading ? 'Creating...' : 'Create Recipe'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateRecipeModal;

'use client';

import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dmenponou/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'image_upload';

interface FormValues {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  preparationTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
  cuisine:
    | 'indian'
    | 'italian'
    | 'chinese'
    | 'mexican'
    | 'japanese'
    | 'thai'
    | 'american'
    | 'anglo-indian';
}

const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit: validateSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      ingredients: '',
      instructions: '',
      preparationTime: '',
      difficulty: 'medium',
      mealType: 'lunch',
      cuisine: 'indian',
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('cloud_name', 'dmenponou');
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await axios.post(CLOUDINARY_URL, formData);
        setImage(response.data.secure_url);
      } catch (err) {
        setError('Image upload failed. Try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError('');

    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        setError('User is not authenticated.');
        return;
      }

      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken?.id;

      if (!userId) {
        setError('User ID not found in token.');
        return;
      }

      const recipeData = {
        title: data.title,
        user_id: userId,
        description: data.description,
        ingredients: data.ingredients,
        instructions: data.instructions,
        preparationTime: data.preparationTime,
        difficulty: data.difficulty,
        cuisine: data.cuisine,
        mealType: data.mealType,
        image: image,
      };

      // Make the API call to create the recipe
      await axios.post('/api/recipes/create', recipeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      reset();
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to create recipe. Please try again.');
      console.error('Error creating recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Create Your Culinary Masterpiece
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
            <p className="font-semibold">Oops! Something went wrong:</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={validateSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Recipe Title
              </label>
              <input
                type="text"
                {...register('title', {
                  required: 'Recipe title is required',
                  minLength: {
                    value: 3,
                    message: 'Title must be at least 3 characters',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Title must not exceed 100 characters',
                  },
                })}
                className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
                placeholder="E.g., vegetable soup"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Preparation Time (minutes)
              </label>
              <input
                type="number"
                {...register('preparationTime', {
                  required: 'Preparation time is required',
                  min: {
                    value: 1,
                    message: 'Preparation time must be at least 1 minute',
                  },
                  max: {
                    value: 200,
                    message: 'Preparation time cannot exceed 200 minutes',
                  },
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
                placeholder="E.g., 45"
              />
              {errors.preparationTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.preparationTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters',
                },
                maxLength: {
                  value: 500,
                  message: 'Description must not exceed 500 characters',
                },
              })}
              rows={3}
              className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
              placeholder="Describe your recipe in a few sentences..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ingredients
            </label>
            <textarea
              {...register('ingredients', {
                required: 'Ingredients are required',
                minLength: {
                  value: 5,
                  message: 'Ingredients must be at least 5 characters',
                },
              })}
              rows={4}
              className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
              placeholder="Enter ingredients, one per line"
            />
            {errors.ingredients && (
              <p className="text-red-500 text-xs mt-1">
                {errors.ingredients.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Instructions
            </label>
            <textarea
              {...register('instructions', {
                required: 'Instructions are required',
                minLength: {
                  value: 20,
                  message: 'Instructions must be at least 20 characters',
                },
              })}
              rows={4}
              className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
              placeholder="Enter step-by-step instructions"
            />
            {errors.instructions && (
              <p className="text-red-500 text-xs mt-1">
                {errors.instructions.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                {...register('difficulty', {
                  required: 'Difficulty is required',
                })}
                className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {errors.difficulty && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.difficulty.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Meal Type
              </label>
              <select
                {...register('mealType', { required: 'Meal type is required' })}
                className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
                <option value="dessert">Dessert</option>
              </select>
              {errors.mealType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mealType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cuisine
              </label>
              <select
                {...register('cuisine', { required: 'Cuisine is required' })}
                className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
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
              {errors.cuisine && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.cuisine.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Recipe Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-200"
            />
            {uploading && (
              <p className="text-sm text-indigo-500">Uploading image...</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full border border-transparent shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full border border-transparent shadow-sm hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              {loading ? 'Creating...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipeModal;

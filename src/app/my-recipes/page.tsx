// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import { MyRecipesConstants } from '../../constants/MyrecipesConstant';
// import { ThemeProvider, useTheme } from '@/context/ThemeContext';

// const MyRecipes = () => {
//   const [recipes, setRecipes] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
//   const router = useRouter();

//   const handleViewMore = (recipeId: number) => {
//     router.push(`/recipe/${recipeId}`);
//   };
//   const { theme } = useTheme();

//   const fetchRecipes = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const user = JSON.parse(Cookies.get('user') || '{}');
//       const token = Cookies.get('auth_token');

//       if (!token || !user.id) {
//         setError(MyRecipesConstants.userNotAuthenticated);
//         return;
//       }

//       const response = await axios.get(
//         `${MyRecipesConstants.apiUrl}/my-recipes/${user.id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.length === 0) {
//         setError(MyRecipesConstants.noRecipesFound);
//       }

//       setRecipes(response.data);
//     } catch (error) {
//       console.error(MyRecipesConstants.errorFetchingRecipes, error);
//       setError(MyRecipesConstants.errorFetchingRecipes);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecipes();
//   }, []);

//   const sortedRecipes = [...recipes].sort((a, b) => {
//     const dateA = new Date(a.createdAt).getTime();
//     const dateB = new Date(b.createdAt).getTime();
//     return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
//   });

//   return (
//     <ThemeProvider>
//       <div
//         className={`${
//           theme === 'light'
//             ? 'bg-gradient-to-r from-indigo-50 to-blue-50'
//             : 'bg-gradient-to-r from-gray-800 to-gray-900'
//         } min-h-screen p-8`}
//       >
//         <h2
//           className={`text-4xl font-extrabold text-center mb-12 mt-5 ${
//             theme === 'light' ? 'text-indigo-800' : 'text-white'
//           }`}
//         >
//           {MyRecipesConstants.title}
//         </h2>

//         <div className="flex justify-end mb-4">
//           <select
//             className={`border rounded-lg px-4 py-2 text-gray-700 shadow-md ${
//               theme === 'light' ? 'bg-white' : 'bg-gray-800 text-white'
//             }`}
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
//           >
//             <option value="desc">Newest First</option>
//             <option value="asc">Oldest First</option>
//           </select>
//         </div>

//         {loading && (
//           <div className="flex justify-center items-center h-screen">
//             <div
//               className={`animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 ${
//                 theme === 'light' ? 'border-indigo-500' : 'border-white'
//               }`}
//             ></div>
//           </div>
//         )}

//         {error ? (
//           <div className="flex justify-center items-center h-screen">
//             <div
//               className={`${
//                 theme === 'light'
//                   ? 'bg-red-100 border-red-500 text-red-700'
//                   : 'bg-red-900 border-red-700 text-red-100'
//               } border-l-4 p-4`}
//               role="alert"
//             >
//               <p className="font-bold">Error</p>
//               <p>{error}</p>
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {sortedRecipes.length > 0 ? (
//               sortedRecipes.map((recipe) => (
//                 <div
//                   key={recipe.id}
//                   className={`${MyRecipesConstants.recipeCardClasses} ${
//                     theme === 'light' ? 'bg-white' : 'bg-gray-800 text-white'
//                   }`}
//                 >
//                   <div className="relative h-48">
//                     <img
//                       src={recipe.image || '/placeholder.svg'}
//                       alt={recipe.title}
//                       className={MyRecipesConstants.recipeImageClasses}
//                     />
//                     <div
//                       className={`${MyRecipesConstants.recipeCuisineClasses} ${
//                         theme === 'light' ? 'text-gray-900' : 'text-gray-300'
//                       }`}
//                     >
//                       {recipe.cuisine}
//                     </div>
//                   </div>
//                   <div
//                     className={`${MyRecipesConstants.recipeDetailsClasses} ${
//                       theme === 'light' ? 'text-gray-900' : 'text-white'
//                     }`}
//                   >
//                     <h3
//                       className={`${MyRecipesConstants.recipeTitleClasses} ${
//                         theme === 'light' ? 'text-gray-900' : 'text-white'
//                       }`}
//                     >
//                       {recipe.title}
//                     </h3>
//                     <p
//                       className={`${
//                         MyRecipesConstants.recipeDescriptionClasses
//                       } ${
//                         theme === 'light' ? 'text-gray-600' : 'text-gray-400'
//                       }`}
//                     >
//                       {recipe.description}
//                     </p>
//                     <div
//                       className={`${MyRecipesConstants.recipeTimeClasses} ${
//                         theme === 'light' ? 'text-gray-600' : 'text-gray-300'
//                       }`}
//                     >
//                       <span>{recipe.preparationTime} mins</span>
//                       <span
//                         className={MyRecipesConstants.recipeDifficultyClasses}
//                       >
//                         {recipe.difficulty}
//                       </span>
//                     </div>
//                     <button
//                       onClick={() => handleViewMore(recipe.recipe_id)}
//                       className={`${
//                         MyRecipesConstants.viewRecipeButtonClasses
//                       } ${
//                         theme === 'light'
//                           ? 'bg-indigo-500 text-white hover:bg-indigo-600'
//                           : 'bg-indigo-700 text-white hover:bg-indigo-600'
//                       }`}
//                     >
//                       View Recipe
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full text-center">
//                 <p
//                   className={`${
//                     theme === 'light' ? 'text-gray-500' : 'text-gray-300'
//                   } text-2xl`}
//                 >
//                   {MyRecipesConstants.noRecipesAvailableMessage}
//                 </p>
//                 <button
//                   onClick={() => router.push('/create-recipe')}
//                   className={`${MyRecipesConstants.createRecipeButtonClasses} ${
//                     theme === 'light'
//                       ? 'bg-indigo-500 text-white hover:bg-indigo-600'
//                       : 'bg-indigo-700 text-white hover:bg-indigo-600'
//                   }`}
//                 >
//                   {MyRecipesConstants.createFirstRecipeMessage}
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default MyRecipes;

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { MyRecipesConstants } from '../../constants/MyrecipesConstant';
import { fetchUserRecipes } from '@/services/Myrecipes'; // Import the new service

const MyRecipes = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();

  const handleViewMore = (recipeId: number) => {
    router.push(`/recipe/${recipeId}`);
  };
  const { theme } = useTheme();

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(Cookies.get('user') || '{}');
      const token = Cookies.get('auth_token');

      if (!token || !user.id) {
        setError('User not authenticated.');
        return;
      }

      const response = await fetchUserRecipes(user.id, token); // Call the service function

      if (response.length === 0) {
        setError('No recipes found.');
      }

      setRecipes(response);
    } catch (error: any) {
      console.error('Error in fetching recipes:', error.message || error);
      setError('Error fetching recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const sortedRecipes = [...recipes].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <ThemeProvider>
      <div
        className={`${
          theme === 'light'
            ? 'bg-gradient-to-r from-indigo-50 to-blue-50'
            : 'bg-gradient-to-r from-gray-800 to-gray-900'
        } min-h-screen p-8`}
      >
        <h2
          className={`text-4xl font-extrabold text-center mb-12 mt-5 ${
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

        {loading && (
          <div className="flex justify-center items-center h-screen">
            <div
              className={`animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 ${
                theme === 'light' ? 'border-indigo-500' : 'border-white'
              }`}
            ></div>
          </div>
        )}

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
                      } ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}
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
                      className={`${
                        MyRecipesConstants.viewRecipeButtonClasses
                      } ${
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
    </ThemeProvider>
  );
};

export default MyRecipes;

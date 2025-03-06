// 'use client';

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation'; // Use Next.js's router

// import { CONSTANTS } from '../../constants/RecipelistConstant'; // Import constants
// import { ThemeProvider, useTheme } from '@/context/ThemeContext';

// interface Recipe {
//   recipe_id: number;
//   title: string;
//   description: string;
//   image: string;
//   preparationTime: number;
//   difficulty: string;
//   cuisine: string;
//   mealType: string;
// }

// interface RecipeListProps {
//   theme: string;
// }

// const RecipeList: React.FC = () => {
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter(); // Use Next.js's router for navigation
//   const { theme } = useTheme();

//   useEffect(() => {
//     const fetchRecipes = async () => {
//       try {
//         const response = await axios.get(CONSTANTS.API_URL);
//         setRecipes(response.data);
//       } catch (error) {
//         console.error('Failed to fetch recipes:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecipes();
//   }, []);

//   const handleRecipeClick = (id: number) => {
//     router.push(`/recipes/${id}`); // Navigate to recipe details page
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className={CONSTANTS.LOADING_SPINNER_CLASSES}></div>
//       </div>
//     );
//   }

//   return (
//     <ThemeProvider>
//       <div
//         className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
//           theme === 'light' ? 'bg-white' : 'bg-gray-800'
//         }`}
//       >
//         <h2
//           className={`text-3xl font-bold mb-8 ${
//             theme === 'light' ? 'text-gray-900' : 'text-white'
//           }`}
//         >
//           {CONSTANTS.ALL_RECIPES_TITLE}
//         </h2>

//         {recipes.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//             {recipes.map((recipe) => (
//               <div
//                 key={recipe.recipe_id}
//                 className={`${
//                   theme === 'light' ? 'bg-white' : 'bg-gray-700'
//                 } rounded-lg shadow-lg overflow-hidden transition-all hover:scale-105 cursor-pointer`}
//                 onClick={() => handleRecipeClick(recipe.recipe_id)}
//               >
//                 <div className="relative h-48">
//                   <img
//                     src={recipe.image || '/images/default-recipe.jpg'}
//                     alt={recipe.title}
//                     className={CONSTANTS.RECIPE_IMAGE_CLASSES}
//                   />
//                   <div
//                     className={`${
//                       theme === 'light'
//                         ? 'bg-gradient-to-t from-black/60 to-transparent'
//                         : 'bg-gradient-to-t from-black/80 to-transparent'
//                     } absolute inset-0`}
//                   >
//                     <div className={CONSTANTS.RECIPE_CUISINE_CLASSES}>
//                       {recipe.cuisine}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-4">
//                   <h3
//                     className={`${
//                       theme === 'light' ? 'text-gray-900' : 'text-white'
//                     } ${CONSTANTS.RECIPE_TITLE_CLASSES}`}
//                   >
//                     {recipe.title}
//                   </h3>
//                   <p
//                     className={`${
//                       theme === 'light' ? 'text-gray-600' : 'text-white'
//                     } ${CONSTANTS.RECIPE_DESCRIPTION_CLASSES}`}
//                   >
//                     {recipe.description}
//                   </p>
//                   <div
//                     className={`flex justify-between items-center text-sm ${
//                       theme === 'light' ? 'text-gray-500' : 'text-white'
//                     }`}
//                   >
//                     <span>{recipe.preparationTime} mins</span>
//                     <span
//                       className={`${
//                         theme === 'light' ? 'text-gray-700' : 'text-black'
//                       } ${CONSTANTS.RECIPE_DIFFICULTY_CLASSES}`}
//                     >
//                       {recipe.difficulty}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p
//             className={`text-xl text-center ${
//               theme === 'light' ? 'text-gray-600' : 'text-gray-400'
//             }`}
//           >
//             {CONSTANTS.NO_RECIPES_MESSAGE}
//           </p>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default RecipeList;

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useTheme } from '@/context/ThemeContext';
// import { fetchRecipes } from '@/services/RecipeList';
// import { CONSTANTS } from '../../constants/RecipelistConstant';

// interface Recipe {
//   recipe_id: number;
//   title: string;
//   description: string;
//   image: string;
//   preparationTime: number;
//   difficulty: string;
//   cuisine: string;
//   mealType: string;
// }

// const RecipeList: React.FC = () => {
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const { theme } = useTheme();

//   useEffect(() => {
//     const getRecipes = async () => {
//       try {
//         const data = await fetchRecipes();
//         setRecipes(data);
//       } catch (error) {
//         console.error('Failed to fetch recipes:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getRecipes();
//   }, []);

//   const handleRecipeClick = (id: number) => {
//     router.push(`/recipes/${id}`);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className={CONSTANTS.LOADING_SPINNER_CLASSES}></div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12  mt-5 ${
//         theme === 'light' ? 'bg-white' : 'bg-gray-800'
//       }`}
//     >
//       <h2
//         className={`text-3xl font-bold mb-8 ${
//           theme === 'light' ? 'text-gray-900' : 'text-white'
//         }`}
//       >
//         {CONSTANTS.ALL_RECIPES_TITLE}
//       </h2>

//       {recipes.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {recipes.map((recipe) => (
//             <div
//               key={recipe.recipe_id}
//               className={`${
//                 theme === 'light' ? 'bg-white' : 'bg-gray-700'
//               } rounded-lg shadow-lg overflow-hidden transition-all hover:scale-105 cursor-pointer`}
//               onClick={() => handleRecipeClick(recipe.recipe_id)}
//             >
//               <div className="relative h-48">
//                 <img
//                   src={recipe.image || '/images/default-recipe.jpg'}
//                   alt={recipe.title}
//                   className={CONSTANTS.RECIPE_IMAGE_CLASSES}
//                 />
//                 <div
//                   className={`${
//                     theme === 'light'
//                       ? 'bg-gradient-to-t from-black/60 to-transparent'
//                       : 'bg-gradient-to-t from-black/80 to-transparent'
//                   } absolute inset-0`}
//                 >
//                   <div className={CONSTANTS.RECIPE_CUISINE_CLASSES}>
//                     {recipe.cuisine}
//                   </div>
//                 </div>
//               </div>
//               <div className="p-4">
//                 <h3
//                   className={`${
//                     theme === 'light' ? 'text-gray-900' : 'text-white'
//                   } ${CONSTANTS.RECIPE_TITLE_CLASSES}`}
//                 >
//                   {recipe.title}
//                 </h3>
//                 <p
//                   className={`${
//                     theme === 'light' ? 'text-gray-600' : 'text-white'
//                   } ${CONSTANTS.RECIPE_DESCRIPTION_CLASSES}`}
//                 >
//                   {recipe.description}
//                 </p>
//                 <div
//                   className={`flex justify-between items-center text-sm ${
//                     theme === 'light' ? 'text-gray-500' : 'text-white'
//                   }`}
//                 >
//                   <span>{recipe.preparationTime} mins</span>
//                   <span
//                     className={`${
//                       theme === 'light' ? 'text-gray-700' : 'text-black'
//                     } ${CONSTANTS.RECIPE_DIFFICULTY_CLASSES}`}
//                   >
//                     {recipe.difficulty}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p
//           className={`text-xl text-center ${
//             theme === 'light' ? 'text-gray-600' : 'text-gray-400'
//           }`}
//         >
//           {CONSTANTS.NO_RECIPES_MESSAGE}
//         </p>
//       )}
//     </div>
//   );
// };

// export default RecipeList;

// import React from 'react';
// // import { ThemeProvider } from '@/context/ThemeContext';
// import RecipeListContent from '../../components/RecipeLists';
// import { fetchRecipes } from '@/services/RecipeList';

// export default async function RecipeListPage() {
//   const initialRecipes = await fetchRecipes();

//   return <RecipeListContent initialRecipes={initialRecipes} />;
// }

import React from 'react';
import RecipeListContent from '../../components/RecipeLists';
import { fetchRecipes } from '@/services/RecipeList';

// Add metadata for SEO
export const metadata = {
  title: 'Recipe List',
  description: 'Browse our collection of delicious recipes',
};

// Add dynamic options to control revalidation
export const revalidate = 3600; // Revalidate content every hour

export default async function RecipeListPage() {
  try {
    const initialRecipes = await fetchRecipes();

    return <RecipeListContent initialRecipes={initialRecipes} />;
  } catch (error) {
    // Handle fetch errors gracefully
    console.error('Error fetching recipes:', error);

    // Return fallback UI
    return (
      <div>
        <h1>Unable to load recipes</h1>
        <p>Please try again later</p>
      </div>
    );
  }
}

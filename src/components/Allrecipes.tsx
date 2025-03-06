// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useTheme } from '@/context/ThemeContext';
// import { fetchAllRecipes } from '../services/HomePage';

// interface Recipe {
//   recipe_id: number;
//   title: string;
//   description: string;
//   image: string;
// }

// export default function AllRecipes() {
//   const router = useRouter();
//   const { theme } = useTheme();
//   const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

//   useEffect(() => {
//     const loadRecipes = async () => {
//       try {
//         const recipes = await fetchAllRecipes();
//         setAllRecipes(recipes.slice(0, 6));
//       } catch (error) {
//         console.error('Failed to fetch recipes:', error);
//       }
//     };

//     loadRecipes();
//   }, []);

//   return (
//     <section>
//       <h2
//         className={`text-3xl font-bold ${
//           theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//         } mb-4`}
//       >
//         All Recipes
//       </h2>
//       <div className="overflow-x-auto whitespace-nowrap py-4">
//         <div className="flex space-x-6">
//           {allRecipes.map((recipe) => (
//             <div
//               key={recipe.recipe_id}
//               className={`rounded-lg shadow-lg w-64 flex-shrink-0 overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 ${
//                 theme === 'light' ? 'bg-white' : 'bg-gray-800'
//               }`}
//               onClick={() => router.push(`/recipes/${recipe.recipe_id}`)}
//             >
//               <img
//                 src={recipe.image || '/images/default-recipe.jpg'}
//                 alt={recipe.title}
//                 className="w-full h-40 object-cover"
//               />
//               <div className="p-4">
//                 <h3
//                   className={`text-lg font-semibold ${
//                     theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//                   } mb-1`}
//                 >
//                   {recipe.title}
//                 </h3>
//                 <p className="text-sm text-gray-400 line-clamp-2">
//                   {recipe.description}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="text-center mt-6">
//         <button
//           onClick={() => router.push('/recipes')}
//           className={`px-6 py-3 rounded-lg font-medium text-lg transition-all duration-300 ${
//             theme === 'light'
//               ? 'bg-gray-900 text-white hover:bg-gray-700'
//               : 'bg-gray-100 text-gray-900 hover:bg-gray-300'
//           }`}
//         >
//           View All
//         </button>
//       </div>
//     </section>
//   );
// }

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useTheme } from '@/context/ThemeContext';
// import { fetchAllRecipes } from '../services/HomePage';

// interface Recipe {
//   recipe_id: number;
//   title: string;
//   description: string;
//   image: string;
// }

// export default function AllRecipes() {
//   const router = useRouter();
//   const { theme } = useTheme();
//   // Fix: Properly type the state with Recipe[]
//   const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

//   useEffect(() => {
//     const loadRecipes = async () => {
//       try {
//         const recipes = await fetchAllRecipes();
//         setAllRecipes(recipes.slice(0, 6));
//       } catch (error) {
//         console.error('Failed to fetch recipes:', error);
//       }
//     };

//     loadRecipes();
//   }, []);

//   return (
//     <section
//       aria-labelledby="all-recipes-heading"
//       className="container mx-auto px-4 py-12"
//     >
//       <h2
//         id="all-recipes-heading"
//         className="text-3xl font-bold mb-8 text-center"
//       >
//         All Recipes
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {allRecipes.map((recipe) => (
//           <div
//             key={recipe.recipe_id}
//             onClick={() => router.push(`/recipes/${recipe.recipe_id}`)}
//             className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
//             role="button"
//             aria-label={`View ${recipe.title} recipe details`}
//             tabIndex={0}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter' || e.key === ' ') {
//                 e.preventDefault();
//                 router.push(`/recipes/${recipe.recipe_id}`);
//               }
//             }}
//           >
//             <img
//               src={recipe.image}
//               alt={`${recipe.title}`}
//               className="w-full h-48 object-cover"
//               loading="lazy"
//             />
//             <div className="p-4">
//               <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
//               <p className="text-gray-600">{recipe.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-12 flex justify-center">
//         <button
//           onClick={() => router.push('/recipes')}
//           className={`px-6 py-3 rounded-lg font-medium text-lg transition-all duration-300 ${
//             theme === 'light'
//               ? 'bg-gray-900 text-white hover:bg-gray-700'
//               : 'bg-gray-100 text-gray-900 hover:bg-gray-300'
//           }`}
//           aria-label="View all recipes"
//         >
//           View All
//         </button>
//       </div>
//     </section>
//   );
// }

// 'use client';
// import { useRouter } from 'next/navigation';
// import { useTheme } from '@/context/ThemeContext';
// import type { Recipe } from '../types/Recipe';

// interface AllRecipesProps {
//   recipes: Recipe[];
// }

// export default function AllRecipesClient({ recipes }: AllRecipesProps) {
//   const router = useRouter();
//   const { theme } = useTheme();

//   return (
//     <section
//       aria-labelledby="all-recipes-heading"
//       className="container mx-auto px-4 py-12"
//     >
//       <h2
//         id="all-recipes-heading"
//         className={`text-3xl font-bold ${
//           theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//         } mb-8 text-center`}
//       >
//         All Recipes
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {recipes.map((recipe) => (
//           <div
//             key={recipe.recipe_id}
//             onClick={() => router.push(`/recipes/${recipe.recipe_id}`)}
//             className={`cursor-pointer rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 ${
//               theme === 'light' ? 'bg-white' : 'bg-gray-800'
//             }`}
//             role="button"
//             aria-label={`View ${recipe.title} recipe details`}
//             tabIndex={0}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter' || e.key === ' ') {
//                 e.preventDefault();
//                 router.push(`/recipes/${recipe.recipe_id}`);
//               }
//             }}
//           >
//             <img
//               src={recipe.image || '/images/default-recipe.jpg'}
//               alt={`${recipe.title}`}
//               className="w-full h-48 object-cover"
//               loading="lazy"
//             />
//             <div className="p-4">
//               <h3
//                 className={`text-xl font-semibold mb-2 ${
//                   theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//                 }`}
//               >
//                 {recipe.title}
//               </h3>
//               <p className="text-gray-600 dark:text-gray-300">
//                 {recipe.description}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-12 flex justify-center">
//         <button
//           onClick={() => router.push('/recipes')}
//           className={`px-6 py-3 rounded-lg font-medium text-lg transition-all duration-300 ${
//             theme === 'light'
//               ? 'bg-gray-900 text-white hover:bg-gray-700'
//               : 'bg-gray-100 text-gray-900 hover:bg-gray-300'
//           }`}
//           aria-label="View all recipes"
//         >
//           View All
//         </button>
//       </div>
//     </section>
//   );
// }

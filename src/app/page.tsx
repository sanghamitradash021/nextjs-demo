// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import axios from 'axios';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import 'swiper/swiper-bundle.css';
// import { HomeConstants } from '../constants/HomeConstant';
// import { ThemeProvider, useTheme } from '@/context/ThemeContext';
// import {
//   fetchAllRecipes,
//   fetchCuisineTypeRecipes,
//   fetchMealTypeRecipes,
// } from '../services/HomePage';

// interface Recipe {
//   recipe_id: number;
//   title: string;
//   description: string;
//   image: string;
//   rating?: number;
//   cuisine?: string;
//   mealType?: string;
//   preparationTime?: string;
//   difficulty?: string;
// }

// const Home: React.FC = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const initialMealType = searchParams?.get('mealType') || null;
//   const [, setCuisineRecipes] = useState<{ [key: string]: Recipe[] }>({});
//   const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
//   const [mealTypeRecipes, setMealTypeRecipes] = useState<Recipe[]>([]);
//   const [selectedMealType, setSelectedMealType] = useState<string | null>(
//     initialMealType
//   );

//   const { cuisineTypes, featuredCategories } = HomeConstants;
//   const { theme } = useTheme();

//   useEffect(() => {
//     const loadRecipes = async () => {
//       try {
//         const allRecipes = await fetchAllRecipes();
//         setAllRecipes(allRecipes.slice(0, 6));

//         const cuisineData: { [key: string]: Recipe[] } = {};
//         await Promise.all(
//           cuisineTypes.map(async (cuisine) => {
//             cuisineData[cuisine] = await fetchCuisineTypeRecipes(cuisine);
//           })
//         );
//         setCuisineRecipes(cuisineData);
//       } catch (error) {
//         console.error('Failed to fetch recipes:', error);
//       }
//     };

//     loadRecipes();
//   }, [cuisineTypes]);

//   // Fetch recipes for a given meal type and update the URL query string
//   const fetchMealTypeRecipesHandler = async (mealType: string) => {
//     try {
//       const recipes = await fetchMealTypeRecipes(mealType);
//       setMealTypeRecipes(recipes);
//       setSelectedMealType(mealType);
//     } catch (error) {
//       console.error('Failed to fetch meal type recipes:', error);
//     }
//   };

//   const handleRecipeClick = (id?: number) => {
//     if (id) {
//       router.push(`/recipes/${id}`);
//     } else {
//       console.error('Invalid Recipe ID:', id);
//     }
//   };

//   return (
//     <ThemeProvider>
//       <div
//         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 mt-10"
//         style={{
//           background: theme === 'light' ? '#fff' : '#333',
//           color: theme === 'light' ? '#000' : '#fff',
//         }}
//       >
//         <section>
//           <h2
//             className={`text-3xl font-bold ${
//               theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//             } mb-8`}
//           >
//             Featured Categories
//           </h2>
//           <Swiper
//             modules={[Navigation, Pagination, Autoplay]}
//             spaceBetween={20}
//             slidesPerView={1}
//             navigation
//             pagination={{ clickable: true }}
//             autoplay={{ delay: 3000 }}
//             breakpoints={{
//               640: { slidesPerView: 2 },
//               768: { slidesPerView: 3 },
//               1024: { slidesPerView: 4 },
//             }}
//             className="rounded-xl"
//           >
//             {featuredCategories.map((category, index) => (
//               <SwiperSlide key={index}>
//                 <div
//                   className="relative h-72 rounded-xl overflow-hidden cursor-pointer group"
//                   onClick={() => fetchMealTypeRecipesHandler(category.name)}
//                 >
//                   <img
//                     src={category.image || '/placeholder.svg'}
//                     alt={category.name}
//                     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
//                   <div className="absolute bottom-0 left-0 right-0 p-6">
//                     <h3 className="text-white text-2xl font-bold mb-2">
//                       {category.name}
//                     </h3>
//                     <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       Explore {category.name.toLowerCase()} recipes
//                     </p>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </section>

//         {selectedMealType && (
//           <section>
//             <h2
//               className={`text-3xl font-bold ${
//                 theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//               } mb-8`}
//             >
//               {selectedMealType} Recipes
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//               {mealTypeRecipes.length > 0 ? (
//                 mealTypeRecipes.map((recipe) => (
//                   <div
//                     key={recipe.recipe_id}
//                     className={`rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
//                       theme === 'light' ? 'bg-white' : 'bg-gray-800'
//                     }`}
//                     onClick={() => handleRecipeClick(recipe.recipe_id)}
//                   >
//                     <img
//                       src={recipe.image || '/images/default-recipe.jpg'}
//                       alt={recipe.title}
//                       className="w-full h-48 object-cover"
//                     />
//                     <div className="p-4">
//                       <h3
//                         className={`text-lg font-semibold ${
//                           theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//                         } mb-2`}
//                       >
//                         {recipe.title}
//                       </h3>
//                       <p className="text-sm text-gray-400 line-clamp-2 mb-3">
//                         {recipe.description}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p>No recipes found for {selectedMealType}.</p>
//               )}
//             </div>
//             <div className="text-center mt-6">
//               <button
//                 onClick={() =>
//                   router.push(`/recipes/meal-type/${selectedMealType}`)
//                 }
//                 className={`px-6 py-3 rounded-lg font-medium text-lg transition-all duration-300 ${
//                   theme === 'light'
//                     ? 'bg-gray-900 text-white hover:bg-gray-700'
//                     : 'bg-gray-100 text-gray-900 hover:bg-gray-300'
//                 }`}
//               >
//                 View All
//               </button>
//             </div>
//           </section>
//         )}

//         {/* Additional sections such as Popular Cuisines and All Recipes remain unchanged */}

//         {/* Popular Cuisines Section */}
//         <section>
//           <h2
//             className={`text-3xl font-bold ${
//               theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//             } mb-8`}
//           >
//             Popular Cuisines
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
//             {cuisineTypes.map((cuisine) => (
//               <div
//                 key={cuisine}
//                 className={`relative rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 group ${
//                   theme === 'light' ? 'bg-white' : 'bg-gray-800'
//                 }`}
//                 onClick={() => router.push(`/recipes/cuisine/${cuisine}`)} // Using Next.js router.push for navigation
//               >
//                 <img
//                   src={`/assets/${cuisine.toLowerCase()}.jpeg`}
//                   alt={cuisine}
//                   className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 flex items-center justify-center group-hover:opacity-90 transition-opacity duration-300">
//                   <h3 className="text-white text-2xl font-bold">{cuisine}</h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* All Recipes Section */}
//         <section>
//           <h2
//             className={`text-3xl font-bold ${
//               theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//             } mb-4`}
//           >
//             All Recipes
//           </h2>
//           <div className="overflow-x-auto whitespace-nowrap py-4">
//             <div className="flex space-x-6">
//               {allRecipes.map((recipe) => (
//                 <div
//                   key={recipe.recipe_id}
//                   className={`rounded-lg shadow-lg w-64 flex-shrink-0 overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 ${
//                     theme === 'light' ? 'bg-white' : 'bg-gray-800'
//                   }`}
//                   onClick={() => router.push(`/recipes/${recipe.recipe_id}`)} // Using Next.js router.push for navigation
//                 >
//                   <img
//                     src={recipe.image || '/images/default-recipe.jpg'}
//                     alt={recipe.title}
//                     className="w-full h-40 object-cover"
//                   />
//                   <div className="p-4">
//                     <h3
//                       className={`text-lg font-semibold ${
//                         theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//                       } mb-1`}
//                     >
//                       {recipe.title}
//                     </h3>
//                     <p className="text-sm text-gray-400 line-clamp-2">
//                       {recipe.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="text-center mt-6">
//             <button
//               onClick={() => router.push('/recipes')} // Using Next.js router.push for navigation
//               className={`px-6 py-3 rounded-lg font-medium text-lg transition-all duration-300 ${
//                 theme === 'light'
//                   ? 'bg-gray-900 text-white hover:bg-gray-700'
//                   : 'bg-gray-100 text-gray-900 hover:bg-gray-300'
//               }`}
//             >
//               View All
//             </button>
//           </div>
//         </section>
//       </div>
//     </ThemeProvider>
//   );
// };

// export default Home;

// import { Suspense } from 'react';
// import HomeClient from '../components/Home';
// import { HomeConstants } from '../constants/HomeConstant';
// import {
//   fetchAllRecipes,
//   fetchCuisineTypeRecipes,
//   fetchMealTypeRecipes,
// } from '../services/HomePage';

// // Define Recipe interface
// interface Recipe {
//   recipe_id: number;
//   title: string;
//   description: string;
//   image: string;
//   rating?: number;
//   cuisine?: string;
//   mealType?: string;
//   preparationTime?: string;
//   difficulty?: string;
// }

// export default async function Page({
//   searchParams,
// }: {
//   searchParams: { mealType?: string };
// }) {
//   // Get the meal type from search params
//   const initialMealType = searchParams.mealType || null;

//   // Get the constants
//   const { cuisineTypes, featuredCategories } = HomeConstants;

//   // Server-side data fetching
//   const allRecipes = await fetchAllRecipes();
//   const slicedAllRecipes = allRecipes.slice(0, 6);

//   // Fetch cuisine type recipes
//   const cuisinePromises = cuisineTypes.map(async (cuisine) => {
//     const recipes = await fetchCuisineTypeRecipes(cuisine);
//     return { cuisine, recipes };
//   });

//   const cuisineResults = await Promise.all(cuisinePromises);
//   const cuisineRecipes: { [key: string]: Recipe[] } = {};
//   cuisineResults.forEach((result) => {
//     cuisineRecipes[result.cuisine] = result.recipes;
//   });

//   // Fetch meal type recipes if specified
//   let mealTypeRecipes: Recipe[] = [];
//   if (initialMealType) {
//     mealTypeRecipes = await fetchMealTypeRecipes(initialMealType);
//   }

//   // Pass all fetched data to the client component
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <HomeClient
//         initialMealType={initialMealType}
//         allRecipes={slicedAllRecipes}
//         cuisineRecipes={cuisineRecipes}
//         mealTypeRecipes={mealTypeRecipes}
//         featuredCategories={featuredCategories}
//         cuisineTypes={cuisineTypes}
//       />
//     </Suspense>
//   );
// }

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import HomeClient from '../components/Home';
import { HomeConstants } from '../constants/HomeConstant';
import {
  fetchAllRecipes,
  fetchCuisineTypeRecipes,
  fetchMealTypeRecipes,
} from '../services/HomePage';

// Define Recipe interface
interface Recipe {
  recipe_id: number;
  title: string;
  description: string;
  image: string;
  rating?: number;
  cuisine?: string;
  mealType?: string;
  preparationTime?: string;
  difficulty?: string;
}

// Define props for generateMetadata
export interface PageProps {
  searchParams: { mealType?: string };
}

// Dynamic metadata generation
export async function generateMetadata({ searchParams }: PageProps) {
  const mealType = searchParams.mealType;

  return {
    title: mealType
      ? `${mealType} Recipes | Cooking App`
      : 'Discover Delicious Recipes | Cooking App',
    description: mealType
      ? `Browse our collection of ${mealType} recipes for every occasion.`
      : 'Find the perfect recipe for any meal with our extensive collection.',
    openGraph: {
      images: ['/images/recipe-og-image.jpg'],
    },
  };
}

// Revalidation strategy
export const revalidate = 3600; // Revalidate data every hour

// Pre-render common meal types at build time
export async function generateStaticParams() {
  const commonMealTypes = ['breakfast', 'lunch', 'dinner', 'dessert'];
  return commonMealTypes.map((mealType) => ({ searchParams: { mealType } }));
}

export default async function Page({ searchParams }: PageProps) {
  try {
    // Get the meal type from search params
    const initialMealType = searchParams.mealType || null;

    // Get the constants
    const { cuisineTypes, featuredCategories } = HomeConstants;

    // Parallel data fetching with Promise.all for better performance
    const [allRecipes, cuisineResults, mealTypeRecipes] = await Promise.all([
      fetchAllRecipes(),
      Promise.all(
        cuisineTypes.map(async (cuisine) => {
          const recipes = await fetchCuisineTypeRecipes(cuisine);
          return { cuisine, recipes };
        })
      ),
      initialMealType
        ? fetchMealTypeRecipes(initialMealType)
        : Promise.resolve([]),
    ]);

    // Slice recipes after fetching to avoid unnecessary processing
    const slicedAllRecipes = allRecipes.slice(0, 6);

    // Process cuisine recipes
    const cuisineRecipes: { [key: string]: Recipe[] } = {};
    cuisineResults.forEach((result) => {
      cuisineRecipes[result.cuisine] = result.recipes;
    });

    // Return 404 if meal type is specified but no recipes found
    if (initialMealType && mealTypeRecipes.length === 0) {
      return notFound();
    }

    // Pass all fetched data to the client component
    return (
      <Suspense
        fallback={<div className="p-4 text-center">Loading recipes...</div>}
      >
        <HomeClient
          initialMealType={initialMealType}
          allRecipes={slicedAllRecipes}
          cuisineRecipes={cuisineRecipes}
          mealTypeRecipes={mealTypeRecipes}
          featuredCategories={featuredCategories}
          cuisineTypes={cuisineTypes}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading home page:', error);
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p>We're having trouble loading recipes. Please try again later.</p>
      </div>
    );
  }
}

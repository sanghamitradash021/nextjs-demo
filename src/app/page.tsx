// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // Use Next.js useRouter
// import axios from 'axios';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import 'swiper/swiper-bundle.css';
// import { HomeConstants } from '../constants/HomeConstant';

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

// interface HomeProps {
//   theme: 'light' | 'dark';
// }

// const Home: React.FC<HomeProps> = ({ theme }) => {
//   const router = useRouter(); // Using Next.js useRouter
//   const [, setCuisineRecipes] = useState<{
//     [key: string]: Recipe[];
//   }>({});
//   const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
//   const [mealTypeRecipes, setMealTypeRecipes] = useState<Recipe[]>([]);
//   const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
//   const { cuisineTypes, featuredCategories } = HomeConstants;

//   useEffect(() => {
//     const fetchRecipes = async () => {
//       try {
//         const cuisineData: { [key: string]: Recipe[] } = {};
//         await Promise.all(
//           cuisineTypes.map(async (cuisine) => {
//             const response = await axios.get(`api/recipes/cuisine/${cuisine}`);
//             cuisineData[cuisine] = response.data;
//           })
//         );
//         setCuisineRecipes(cuisineData);
//       } catch (error) {
//         console.error('Failed to fetch recipes:', error);
//       }
//     };

//     const fetchAllRecipes = async () => {
//       try {
//         const response = await axios.get('/api/recipes/getall');
//         setAllRecipes(response.data.slice(0, 6)); // Show only the first 6 recipes initially
//       } catch (error) {
//         console.error('Failed to fetch all recipes:', error);
//       }
//     };

//     fetchRecipes();
//     fetchAllRecipes();
//   }, [cuisineTypes]);

//   // const fetchMealTypeRecipes = async (mealType: string) => {
//   //   try {
//   //     const response = await axios.get(`/api/recipes/mealType/${mealType}`);
//   //     setMealTypeRecipes(response.data);
//   //     setSelectedMealType(mealType);
//   //   } catch (error) {
//   //     console.error('Failed to fetch meal type recipes:', error);
//   //   }
//   // };
//   const fetchMealTypeRecipes = async (mealType: string) => {
//     try {
//       const response = await axios.get(
//         `/api/recipes/mealType?mealType=${mealType.toLowerCase()}`
//       );
//       setMealTypeRecipes(response.data);
//       setSelectedMealType(mealType);
//     } catch (error) {
//       console.error('Failed to fetch meal type recipes:', error);
//     }
//   };

//   const handleRecipeClick = (id?: number) => {
//     if (id) {
//       router.push(`/recipes/${id}`); // Using Next.js router.push for navigation
//     } else {
//       console.error('Invalid Recipe ID:', id);
//     }
//   };

//   return (
//     <div
//       className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
//       style={{
//         background: theme === 'light' ? '#fff' : '#333',
//         color: theme === 'light' ? '#000' : '#fff',
//       }}
//     >
//       <section>
//         <h2
//           className={`text-3xl font-bold ${
//             theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//           } mb-8`}
//         >
//           Featured Categories
//         </h2>
//         <Swiper
//           modules={[Navigation, Pagination, Autoplay]}
//           spaceBetween={20}
//           slidesPerView={1}
//           navigation
//           pagination={{ clickable: true }}
//           autoplay={{ delay: 3000 }}
//           breakpoints={{
//             640: { slidesPerView: 2 },
//             768: { slidesPerView: 3 },
//             1024: { slidesPerView: 4 },
//           }}
//           className="rounded-xl"
//         >
//           {featuredCategories.map((category, index) => (
//             <SwiperSlide key={index}>
//               <div
//                 className="relative h-72 rounded-xl overflow-hidden cursor-pointer group"
//                 onClick={() => fetchMealTypeRecipes(category.name)}
//               >
//                 <img
//                   src={category.image || '/placeholder.svg'}
//                   alt={category.name}
//                   className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
//                 <div className="absolute bottom-0 left-0 right-0 p-6">
//                   <h3 className="text-white text-2xl font-bold mb-2">
//                     {category.name}
//                   </h3>
//                   <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     Explore {category.name.toLowerCase()} recipes
//                   </p>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </section>

//       {selectedMealType && (
//         <section>
//           <h2
//             className={`text-3xl font-bold ${
//               theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//             } mb-8`}
//           >
//             {selectedMealType} Recipes
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//             {mealTypeRecipes.length > 0 ? (
//               mealTypeRecipes.map((recipe) => (
//                 <div
//                   key={recipe.recipe_id}
//                   className={`rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
//                     theme === 'light' ? 'bg-white' : 'bg-gray-800'
//                   }`}
//                   onClick={() => handleRecipeClick(recipe.recipe_id)}
//                 >
//                   <img
//                     src={recipe.image || '/images/default-recipe.jpg'}
//                     alt={recipe.title}
//                     className="w-full h-48 object-cover"
//                   />
//                   <div className="p-4">
//                     <h3
//                       className={`text-lg font-semibold ${
//                         theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//                       } mb-2`}
//                     >
//                       {recipe.title}
//                     </h3>
//                     <p className="text-sm text-gray-400 line-clamp-2 mb-3">
//                       {recipe.description}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p>No recipes found for {selectedMealType}.</p>
//             )}
//           </div>
//           <div className="text-center mt-6">
//             <button
//               onClick={() =>
//                 router.push(`/recipes/meal-type/${selectedMealType}`)
//               } // Using Next.js router.push for navigation
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
//       )}

//       {/* Popular Cuisines Section */}
//       <section>
//         <h2
//           className={`text-3xl font-bold ${
//             theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//           } mb-8`}
//         >
//           Popular Cuisines
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
//           {cuisineTypes.map((cuisine) => (
//             <div
//               key={cuisine}
//               className={`relative rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 group ${
//                 theme === 'light' ? 'bg-white' : 'bg-gray-800'
//               }`}
//               onClick={() => router.push(`/recipes/cuisine/${cuisine}`)} // Using Next.js router.push for navigation
//             >
//               <img
//                 src={`/assets/${cuisine.toLowerCase()}.jpeg`}
//                 alt={cuisine}
//                 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 flex items-center justify-center group-hover:opacity-90 transition-opacity duration-300">
//                 <h3 className="text-white text-2xl font-bold">{cuisine}</h3>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* All Recipes Section */}
//       <section>
//         <h2
//           className={`text-3xl font-bold ${
//             theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//           } mb-4`}
//         >
//           All Recipes
//         </h2>
//         <div className="overflow-x-auto whitespace-nowrap py-4">
//           <div className="flex space-x-6">
//             {allRecipes.map((recipe) => (
//               <div
//                 key={recipe.recipe_id}
//                 className={`rounded-lg shadow-lg w-64 flex-shrink-0 overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 ${
//                   theme === 'light' ? 'bg-white' : 'bg-gray-800'
//                 }`}
//                 onClick={() => router.push(`/recipes/${recipe.recipe_id}`)} // Using Next.js router.push for navigation
//               >
//                 <img
//                   src={recipe.image || '/images/default-recipe.jpg'}
//                   alt={recipe.title}
//                   className="w-full h-40 object-cover"
//                 />
//                 <div className="p-4">
//                   <h3
//                     className={`text-lg font-semibold ${
//                       theme === 'light' ? 'text-gray-900' : 'text-gray-100'
//                     } mb-1`}
//                   >
//                     {recipe.title}
//                   </h3>
//                   <p className="text-sm text-gray-400 line-clamp-2">
//                     {recipe.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="text-center mt-6">
//           <button
//             onClick={() => router.push('/recipes')} // Using Next.js router.push for navigation
//             className={`px-6 py-3 rounded-lg font-medium text-lg transition-all duration-300 ${
//               theme === 'light'
//                 ? 'bg-gray-900 text-white hover:bg-gray-700'
//                 : 'bg-gray-100 text-gray-900 hover:bg-gray-300'
//             }`}
//           >
//             View All
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { HomeConstants } from '../constants/HomeConstant';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

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

// interface HomeProps {
//   theme: 'light' | 'dark';
// }

const Home: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMealType = searchParams?.get('mealType') || null;
  const [, setCuisineRecipes] = useState<{ [key: string]: Recipe[] }>({});
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [mealTypeRecipes, setMealTypeRecipes] = useState<Recipe[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(
    initialMealType
  );

  const { cuisineTypes, featuredCategories } = HomeConstants;
  const { theme } = useTheme();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const cuisineData: { [key: string]: Recipe[] } = {};
        await Promise.all(
          cuisineTypes.map(async (cuisine) => {
            const response = await axios.get(`api/recipes/cuisine/${cuisine}`);
            cuisineData[cuisine] = response.data;
          })
        );
        setCuisineRecipes(cuisineData);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      }
    };

    const fetchAllRecipes = async () => {
      try {
        const response = await axios.get('/api/recipes/getall');
        setAllRecipes(response.data.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch all recipes:', error);
      }
    };

    fetchRecipes();
    fetchAllRecipes();
  }, [cuisineTypes]);

  // Fetch recipes for a given meal type and update the URL query string
  const fetchMealTypeRecipes = async (mealType: string) => {
    try {
      // Update the URL to include the mealType as a dynamic segment
      const response = await axios.get(
        `/api/recipes/mealType/${mealType.toLowerCase()}`
      );
      setMealTypeRecipes(response.data);
      setSelectedMealType(mealType);
    } catch (error) {
      console.error('Failed to fetch meal type recipes:', error);
    }
  };

  const handleRecipeClick = (id?: number) => {
    if (id) {
      router.push(`/recipes/${id}`);
    } else {
      console.error('Invalid Recipe ID:', id);
    }
  };

  return (
    <ThemeProvider>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
        style={{
          background: theme === 'light' ? '#fff' : '#333',
          color: theme === 'light' ? '#000' : '#fff',
        }}
      >
        <section>
          <h2
            className={`text-3xl font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-gray-100'
            } mb-8`}
          >
            Featured Categories
          </h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="rounded-xl"
          >
            {featuredCategories.map((category, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative h-72 rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => fetchMealTypeRecipes(category.name)}
                >
                  <img
                    src={category.image || '/placeholder.svg'}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-2xl font-bold mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore {category.name.toLowerCase()} recipes
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {selectedMealType && (
          <section>
            <h2
              className={`text-3xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-gray-100'
              } mb-8`}
            >
              {selectedMealType} Recipes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {mealTypeRecipes.length > 0 ? (
                mealTypeRecipes.map((recipe) => (
                  <div
                    key={recipe.recipe_id}
                    className={`rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      theme === 'light' ? 'bg-white' : 'bg-gray-800'
                    }`}
                    onClick={() => handleRecipeClick(recipe.recipe_id)}
                  >
                    <img
                      src={recipe.image || '/images/default-recipe.jpg'}
                      alt={recipe.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3
                        className={`text-lg font-semibold ${
                          theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                        } mb-2`}
                      >
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {recipe.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No recipes found for {selectedMealType}.</p>
              )}
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() =>
                  router.push(`/recipes/meal-type/${selectedMealType}`)
                }
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
        )}

        {/* Additional sections such as Popular Cuisines and All Recipes remain unchanged */}

        {/* Popular Cuisines Section */}
        <section>
          <h2
            className={`text-3xl font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-gray-100'
            } mb-8`}
          >
            Popular Cuisines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {cuisineTypes.map((cuisine) => (
              <div
                key={cuisine}
                className={`relative rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 group ${
                  theme === 'light' ? 'bg-white' : 'bg-gray-800'
                }`}
                onClick={() => router.push(`/recipes/cuisine/${cuisine}`)} // Using Next.js router.push for navigation
              >
                <img
                  src={`/assets/${cuisine.toLowerCase()}.jpeg`}
                  alt={cuisine}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 flex items-center justify-center group-hover:opacity-90 transition-opacity duration-300">
                  <h3 className="text-white text-2xl font-bold">{cuisine}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Recipes Section */}
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
                  onClick={() => router.push(`/recipes/${recipe.recipe_id}`)} // Using Next.js router.push for navigation
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
              onClick={() => router.push('/recipes')} // Using Next.js router.push for navigation
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
      </div>
    </ThemeProvider>
  );
};

export default Home;

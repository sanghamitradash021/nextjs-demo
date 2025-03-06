'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { CONSTANTS } from '../constants/RecipelistConstant';

/**
 * Interface representing a Recipe object.
 * @interface Recipe
 * @property {number} recipe_id - The unique identifier for the recipe.
 * @property {string} title - The title of the recipe.
 * @property {string} description - A short description of the recipe.
 * @property {string} image - The URL of the recipe's image.
 * @property {number} preparationTime - The preparation time for the recipe in minutes.
 * @property {string} difficulty - The difficulty level of the recipe.
 * @property {string} cuisine - The cuisine type of the recipe.
 * @property {string} mealType - The type of meal (e.g., breakfast, lunch).
 */

interface Recipe {
  recipe_id: number;
  title: string;
  description: string;
  image: string;
  preparationTime: number;
  difficulty: string;
  cuisine: string;
  mealType: string;
}

/**
 * Props for the RecipeListContent component.
 * @interface RecipeListContentProps
 * @property {Recipe[]} initialRecipes - The list of initial recipes to display.
 */

interface RecipeListContentProps {
  initialRecipes: Recipe[];
}

/**
 * RecipeListContent component that displays a list of recipes and handles navigation to recipe details.
 *
 * @component
 * @param {RecipeListContentProps} props - The properties passed to the component.
 * @returns {JSX.Element} - The JSX to render the component.
 */

const RecipeListContent: React.FC<RecipeListContentProps> = ({
  initialRecipes,
}) => {
  const [recipes] = useState<Recipe[]>(initialRecipes);
  const router = useRouter();

  /**
   * Handles the click on a recipe card to navigate to the detailed recipe page.
   * @param {number} id - The unique identifier of the recipe clicked.
   */

  const handleRecipeClick = (id: number) => {
    router.push(`/recipes/${id}`);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-5 `}>
      <h2 className={`text-3xl font-bold mb-8 `}>
        {CONSTANTS.ALL_RECIPES_TITLE}
      </h2>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {recipes.map((recipe) => (
            <div
              key={recipe.recipe_id}
              className={` rounded-lg shadow-lg overflow-hidden transition-all hover:scale-105 cursor-pointer`}
              onClick={() => handleRecipeClick(recipe.recipe_id)}
            >
              <div className="relative h-48">
                <img
                  src={recipe.image || '/images/default-recipe.jpg'}
                  alt={recipe.title}
                  className={CONSTANTS.RECIPE_IMAGE_CLASSES}
                />
                <div className={` absolute inset-0`}>
                  <div className={CONSTANTS.RECIPE_CUISINE_CLASSES}>
                    {recipe.cuisine}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className={` ${CONSTANTS.RECIPE_TITLE_CLASSES}`}>
                  {recipe.title}
                </h3>
                <p className={` ${CONSTANTS.RECIPE_DESCRIPTION_CLASSES}`}>
                  {recipe.description}
                </p>
                <div className={`flex justify-between items-center text-sm `}>
                  <span>{recipe.preparationTime} mins</span>
                  <span className={` ${CONSTANTS.RECIPE_DIFFICULTY_CLASSES}`}>
                    {recipe.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={`text-xl text-center `}>{CONSTANTS.NO_RECIPES_MESSAGE}</p>
      )}
    </div>
  );
};

export default RecipeListContent;

// import { GetServerSideProps } from 'next';
// import { useRouter } from 'next/navigation';
// import { CONSTANTS } from '../constants/RecipelistConstant';

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

// interface RecipeListContentProps {
//   recipes: Recipe[];
// }

// const RecipeListContent: React.FC<RecipeListContentProps> = ({ recipes }) => {
//   const router = useRouter();

//   const handleRecipeClick = (id: number) => {
//     router.push(`/recipes/${id}`);
//   };

//   return (
//     <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-5`}>
//       <h2 className={`text-3xl font-bold mb-8`}>
//         {CONSTANTS.ALL_RECIPES_TITLE}
//       </h2>

//       {recipes.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {recipes.map((recipe) => (
//             <div
//               key={recipe.recipe_id}
//               className={`rounded-lg shadow-lg overflow-hidden transition-all hover:scale-105 cursor-pointer`}
//               onClick={() => handleRecipeClick(recipe.recipe_id)}
//             >
//               <div className="relative h-48">
//                 <img
//                   src={recipe.image || '/images/default-recipe.jpg'}
//                   alt={recipe.title}
//                   className={CONSTANTS.RECIPE_IMAGE_CLASSES}
//                 />
//                 <div className={`absolute inset-0`}>
//                   <div className={CONSTANTS.RECIPE_CUISINE_CLASSES}>
//                     {recipe.cuisine}
//                   </div>
//                 </div>
//               </div>
//               <div className="p-4">
//                 <h3 className={`${CONSTANTS.RECIPE_TITLE_CLASSES}`}>
//                   {recipe.title}
//                 </h3>
//                 <p className={`${CONSTANTS.RECIPE_DESCRIPTION_CLASSES}`}>
//                   {recipe.description}
//                 </p>
//                 <div className={`flex justify-between items-center text-sm`}>
//                   <span>{recipe.preparationTime} mins</span>
//                   <span className={`${CONSTANTS.RECIPE_DIFFICULTY_CLASSES}`}>
//                     {recipe.difficulty}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className={`text-xl text-center`}>{CONSTANTS.NO_RECIPES_MESSAGE}</p>
//       )}
//     </div>
//   );
// };

// // This function runs on the server and fetches the recipes
// export const getServerSideProps: GetServerSideProps = async () => {
//   try {
//     // Fetching the recipe data from your API or database
//     const res = await fetch('http://localhost:3000/api/recipes'); // Replace with actual API endpoint
//     const recipes: Recipe[] = await res.json();

//     return {
//       props: {
//         recipes,
//       },
//     };
//   } catch (error) {
//     return {
//       props: {
//         recipes: [],
//       },
//     };
//   }
// };

// export default RecipeListContent;

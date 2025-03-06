'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '@/context/ThemeContext';
import { RecipeDetailConstants } from '../constants/RecipedetailsConstant';
import { useAuthStore } from '@/store/AuthStore';

/**
 * Interface representing a recipe.
 */

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  ingredients: string[] | string;
  instructions: string;
  preparationTime: number;
  difficulty: string;
  cuisine: string;
  mealType: string;
  rating: number;
  user_id: number;
}

/**
 * Interface representing a comment on a recipe.
 */

interface Comment {
  id: number;
  content: string;
  username: string;
  createdAt: string;
}

/**
 * Props for the RecipeDetailContent component.
 * @property {Recipe | null} initialRecipe - The initial recipe data.
 * @property {Comment[]} initialComments - The initial comments for the recipe.
 * @property {number | null} initialAverageRating - The initial average rating of the recipe.
 */

interface RecipeDetailContentProps {
  initialRecipe: Recipe | null;
  initialComments: Comment[];
  initialAverageRating: number | null;
}

/**
 * RecipeDetailContent component for displaying recipe details, rating, and comments.
 * @param {RecipeDetailContentProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered component.
 */

const RecipeDetailContent: React.FC<RecipeDetailContentProps> = ({
  initialRecipe,
  initialComments,
  initialAverageRating,
}) => {
  const { theme } = useTheme();
  const { user } = useAuthStore();

  const [recipe] = useState<Recipe | null>(initialRecipe);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number | null>(
    initialAverageRating
  );
  const [showAllComments, setShowAllComments] = useState(false);

  if (!recipe)
    return (
      <p className="text-center text-2xl text-red-500 mt-8">Recipe not found</p>
    );

  const ingredientsArray = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : typeof recipe.ingredients === 'string'
    ? recipe.ingredients.split(',').map((item) => item.trim())
    : [];

  /**
   * Handles comment submission by sending the comment to the API and updating the state.
   * @async
   * @function handleCommentSubmit
   */

  const handleCommentSubmit = async () => {
    if (!user) {
      return;
    }

    if (!comment.trim() || !recipe.id) return;

    if (recipe.user_id === user.id) {
      alert("You can't comment on your own recipe.");
      return;
    }

    try {
      const response = await axios.post(`/api/comments/recipes/${recipe.id}`, {
        recipeId: recipe.id,
        userId: user.id,
        content: comment,
      });

      const newComment: Comment = {
        id: response.data.comment_id,
        content: response.data.content,
        username: response.data.username || user.username,
        createdAt: response.data.createdAt,
      };

      setComments((prev) => [newComment, ...prev]);
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  /**
   * Handles rating submission by sending the rating to the API and updating the state.
   * @async
   * @function handleRateSubmit
   * @param {number} ratingValue - The rating value to submit (1-5).
   */

  const handleRateSubmit = async (ratingValue: number) => {
    if (!user) {
      return;
    }

    if (recipe.user_id === user.id) {
      alert("You can't rate your own recipe.");
      return;
    }

    try {
      await axios.post(`/api/ratings/rate`, {
        recipeId: recipe.id,
        userId: user.id,
        rating: ratingValue,
      });

      localStorage.setItem(`userRating_${recipe.id}`, ratingValue.toString());
      setUserRating(ratingValue);
    } catch (error) {
      console.error('Error posting rating:', error);
    }
  };

  return (
    <div
      className={`max-w-4xl mx-auto p-6 rounded-xl shadow-lg mt-8 ${
        theme === 'light' ? 'bg-white' : 'bg-gray-800 text-white'
      }`}
    >
      <img
        src={recipe.image || '/images/default-recipe.jpg'}
        alt={recipe.title}
        className={RecipeDetailConstants.recipeImageClass}
      />
      <h1
        className={`${RecipeDetailConstants.recipeTitleClass} ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}
      >
        {recipe.title}
      </h1>

      <div className="flex items-center gap-2 mt-2">
        <span
          className={`text-xl font-semibold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}
        >
          Rating:
        </span>
        {typeof averageRating === 'number' && !isNaN(averageRating) ? (
          <span
            className={`text-yellow-500 text-lg font-bold ${
              theme === 'light' ? 'text-yellow-500' : 'text-yellow-400'
            }`}
          >
            {averageRating.toFixed(1)} ★
          </span>
        ) : (
          <span
            className={`text-gray-500 ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            No ratings yet
          </span>
        )}
      </div>

      <p
        className={`${RecipeDetailConstants.recipeDescriptionClass} ${
          theme === 'light' ? 'text-gray-800' : 'text-white'
        }`}
      >
        {recipe.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3
            className={`text-2xl font-semibold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}
          >
            Ingredients
          </h3>

          <ul className={RecipeDetailConstants.ingredientListClass}>
            {ingredientsArray.length > 0 ? (
              ingredientsArray.map((ingredient, index) => (
                <li
                  key={index}
                  className={`${
                    theme === 'light' ? 'text-gray-600' : 'text-white'
                  }`}
                >
                  {ingredient}
                </li>
              ))
            ) : (
              <p
                className={`${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                No ingredients available.
              </p>
            )}
          </ul>
        </div>

        <div>
          <h3
            className={`text-2xl font-semibold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}
          >
            Instructions
          </h3>
          <p
            className={`${RecipeDetailConstants.instructionTextClass} ${
              theme === 'light' ? 'text-gray-500' : 'text-white'
            }`}
          >
            {recipe.instructions}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div
            className={`${RecipeDetailConstants.detailTagClass} ${
              theme === 'light' ? 'text-gray-800' : 'text-black'
            }`}
          >
            <span className="font-semibold">Prep Time:</span>
            {recipe.preparationTime} mins
          </div>

          <div
            className={`${RecipeDetailConstants.detailTagClass} ${
              theme === 'light' ? 'text-gray-800' : 'text-black'
            }`}
          >
            <span className="font-semibold">Difficulty:</span>{' '}
            {recipe.difficulty}
          </div>

          <div
            className={`${RecipeDetailConstants.detailTagClass} ${
              theme === 'light' ? 'text-gray-800' : 'text-black'
            }`}
          >
            <span className="font-semibold">Cuisine:</span> {recipe.cuisine}
          </div>

          <div
            className={`${RecipeDetailConstants.detailTagClass} ${
              theme === 'light' ? 'text-gray-800' : 'text-black'
            }`}
          >
            <span className="font-semibold">Meal Type:</span> {recipe.mealType}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3
          className={`text-2xl font-semibold mb-4 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}
        >
          Rate this Recipe
        </h3>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRateSubmit(star)}
              className={`${RecipeDetailConstants.ratingButtonClass} ${
                userRating >= star ? 'text-yellow-400' : 'text-gray-300'
              } ${
                theme === 'light'
                  ? 'hover:text-yellow-400'
                  : 'hover:text-yellow-300'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3
          className={`text-2xl font-semibold mb-4 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}
        >
          Comments
        </h3>
        {comments.length > 0 ? (
          <>
            {comments
              .slice(0, showAllComments ? comments.length : 3)
              .map((c, index) => (
                <div
                  key={c.id || `comment-${index}`}
                  className={RecipeDetailConstants.commentContainerClass}
                >
                  <p
                    className={`${
                      theme === 'light' ? 'text-gray-800' : 'text-black'
                    }`}
                  >
                    <span className="font-semibold">{c.username}:</span>{' '}
                    {c.content}
                  </p>
                </div>
              ))}
            {comments.length > 3 && (
              <button
                onClick={() => setShowAllComments((prev) => !prev)}
                aria-label="Show all comments"
                className={`text-blue-500 hover:underline mt-2 ${
                  theme === 'light' ? 'text-blue-500' : 'text-blue-300'
                }`}
              >
                {showAllComments ? 'Show Less' : 'Show All Comments'}
              </button>
            )}
          </>
        ) : (
          <p
            className={`${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            No comments yet.
          </p>
        )}
      </div>

      {recipe.user_id !== user?.id && (
        <div className="mt-4">
          <h3
            className={`text-2xl font-semibold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}
          >
            Add a Comment
          </h3>
          <textarea
            className={`${RecipeDetailConstants.commentTextAreaClass} ${
              theme === 'light'
                ? 'bg-white text-gray-900'
                : 'bg-gray-700 text-white'
            }`}
            rows={3}
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={handleCommentSubmit}
            aria-label="Submit Comment"
            className={`${RecipeDetailConstants.submitButtonClass} ${
              theme === 'light'
                ? 'bg-indigo-500 text-white'
                : 'bg-indigo-700 text-white'
            }`}
          >
            Submit Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailContent;

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
// import { useAuth } from '../../../context/AuthContext';
import { RecipeDetailConstants } from '../../../constants/RecipedetailsConstant';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { useAuthStore } from '@/store/AuthStore';

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

interface Comment {
  id: number;
  content: string;
  username: string;
  createdAt: string;
}

// interface RecipeDetailProps {
//   theme: 'light' | 'dark'; // Explicitly define theme prop type
// }

const RecipeDetail: React.FC = () => {
  const params = useParams();
  // const id = params?.recipeId;
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id; // Ensure id is a string
  const { theme } = useTheme();

  if (!id) {
    return (
      <p className="text-center text-red-500 text-xl">Invalid Recipe ID</p>
    );
  }
  // const { id } = useParams(); // Using Next.js useRouter hook
  const { user } = useAuthStore();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `${RecipeDetailConstants.apiUrl}/${id}`
        );
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${RecipeDetailConstants.commentApiUrl}/comments/${id}`
        );
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const fetchUserRating = () => {
      const storedRating = localStorage.getItem(`userRating_${id}`);
      if (storedRating) {
        setUserRating(Number(storedRating));
      }
    };

    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(`/api/ratings/rate/${id}`);
        if (response.data && response.data.averageRating !== undefined) {
          const averageRating = parseFloat(response.data.averageRating);
          if (!isNaN(averageRating)) {
            setAverageRating(averageRating);
          }
        }
      } catch (error) {
        console.error('Error fetching average rating:', error);
      }
    };

    fetchRecipe();
    fetchComments();
    fetchUserRating();
    fetchAverageRating();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!user) {
      return; // Ensure to handle redirection or error if user is not logged in
    }

    if (!comment.trim() || !id) return;

    if (recipe && recipe.user_id === user.id) {
      alert("You can't comment on your own recipe.");
      return;
    }

    try {
      const response = await axios.post(`/api/comments/recipes/${id}`, {
        recipeId: id,
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

  const handleRateSubmit = async (ratingValue: number) => {
    if (!user) {
      return; // Ensure to handle redirection or error if user is not logged in
    }

    if (recipe && recipe.user_id === user.id) {
      alert("You can't rate your own recipe.");
      return;
    }

    try {
      await axios.post(`/api/ratings/rate`, {
        recipeId: id,
        userId: user.id,
        rating: ratingValue,
      });

      localStorage.setItem(`userRating_${id}`, ratingValue.toString());
      setUserRating(ratingValue);
    } catch (error) {
      console.error('Error posting rating:', error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className={RecipeDetailConstants.loadingSpinnerClass}></div>
      </div>
    );

  if (!recipe)
    return (
      <p className="text-center text-2xl text-red-500 mt-8">Recipe not found</p>
    );

  const ingredientsArray = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : typeof recipe.ingredients === 'string'
    ? recipe.ingredients.split(',').map((item) => item.trim())
    : [];

  return (
    <ThemeProvider>
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
              <span className="font-semibold">Meal Type:</span>{' '}
              {recipe.mealType}
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
                    key={c.id || `comment-${index}`} // Fallback to index if id is missing
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
    </ThemeProvider>
  );
};

export default RecipeDetail;

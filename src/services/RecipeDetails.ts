'use server'
import axios from 'axios';
import { RecipeDetailConstants } from '@/constants/RecipedetailsConstant';

/**
 * Fetches the details of a recipe.
 * @param {string} id - The ID of the recipe to fetch.
 * @returns {Promise<any>} A promise that resolves with the recipe data, or null if the fetch fails.
 */

export const fetchRecipe = async (id: string) => {
    try {
        const response = await axios.get(`${RecipeDetailConstants.apiUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return null;
    }
};

/**
 * Fetches the comments for a specific recipe.
 * @param {string} id - The ID of the recipe to fetch comments for.
 * @returns {Promise<any[]>} A promise that resolves with an array of comments, or an empty array if the fetch fails.
 */

export const fetchComments = async (id: string) => {
    try {
        const response = await axios.get(`${RecipeDetailConstants.commentApiUrl}comments/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
};

/**
 * Fetches the average rating of a specific recipe.
 * @param {string} id - The ID of the recipe to fetch the average rating for.
 * @returns {Promise<number | null>} A promise that resolves with the average rating, or null if the fetch fails.
 */

export const fetchAverageRating = async (id: string) => {
    try {
        const response = await axios.get(`/api/ratings/rate/${id}`);
        return response.data?.averageRating ?? null;
    } catch (error) {
        console.error('Error fetching average rating:', error);
        return null;
    }
};

/**
 * Posts a comment for a specific recipe.
 * @param {string} recipeId - The ID of the recipe to post the comment for.
 * @param {number} userId - The ID of the user posting the comment.
 * @param {string} content - The content of the comment.
 * @returns {Promise<any>} A promise that resolves with the response data, or throws an error if the post fails.
 */

export const postComment = async (recipeId: string, userId: number, content: string) => {
    try {
        const response = await axios.post(`/api/comments/recipes/${recipeId}`, { recipeId, userId, content });
        return response.data;
    } catch (error) {
        console.error('Error posting comment:', error);
        throw error;
    }
};

/**
 * Posts a rating for a specific recipe.
 * @param {string} recipeId - The ID of the recipe to post the rating for.
 * @param {number} userId - The ID of the user posting the rating.
 * @param {number} rating - The rating value.
 * @returns {Promise<void>} A promise that resolves when the rating is successfully posted, or throws an error if the post fails.
 */

export const postRating = async (recipeId: string, userId: number, rating: number) => {
    try {
        await axios.post(`/api/ratings/rate`, { recipeId, userId, rating });
        localStorage.setItem(`userRating_${recipeId}`, rating.toString());
    } catch (error) {
        console.error('Error posting rating:', error);
        throw error;
    }
};

/**
 * Fetches the user's rating for a specific recipe from local storage.
 * @param {string} id - The ID of the recipe.
 * @returns {number} The stored rating, or 0 if no rating is found in local storage.
 */

export const fetchUserRating = (id: string): number => {
    const storedRating = localStorage.getItem(`userRating_${id}`);
    return storedRating ? Number(storedRating) : 0;
};
'use server'
import axios from 'axios';
import { RecipeDetailConstants } from '@/constants/RecipedetailsConstant';

export const fetchRecipe = async (id: string) => {
    try {
        const response = await axios.get(`${RecipeDetailConstants.apiUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return null;
    }
};

export const fetchComments = async (id: string) => {
    try {
        const response = await axios.get(`${RecipeDetailConstants.commentApiUrl}comments/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
};

export const fetchAverageRating = async (id: string) => {
    try {
        const response = await axios.get(`/api/ratings/rate/${id}`);
        return response.data?.averageRating ?? null;
    } catch (error) {
        console.error('Error fetching average rating:', error);
        return null;
    }
};

export const postComment = async (recipeId: string, userId: number, content: string) => {
    try {
        const response = await axios.post(`/api/comments/recipes/${recipeId}`, { recipeId, userId, content });
        return response.data;
    } catch (error) {
        console.error('Error posting comment:', error);
        throw error;
    }
};

export const postRating = async (recipeId: string, userId: number, rating: number) => {
    try {
        await axios.post(`/api/ratings/rate`, { recipeId, userId, rating });
        localStorage.setItem(`userRating_${recipeId}`, rating.toString());
    } catch (error) {
        console.error('Error posting rating:', error);
        throw error;
    }
};
export const fetchUserRating = (id: string): number => {
    const storedRating = localStorage.getItem(`userRating_${id}`);
    return storedRating ? Number(storedRating) : 0;
};
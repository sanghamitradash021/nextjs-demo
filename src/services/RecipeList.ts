"use server";

import { CONSTANTS } from "../constants/RecipelistConstant";

/**
 * Fetches all recipes from the API.
 * @returns {Promise<any[]>} A promise that resolves with an array of recipes, or throws an error if the fetch fails.
 */

export const fetchRecipes = async () => {
    try {
        const response = await fetch(CONSTANTS.API_URL, {
            method: "GET",
            cache: "no-store", // Ensures fresh data
        });

        if (!response.ok) {
            throw new Error("Failed to fetch recipes");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }
};

/**
 * Fetches a single recipe by its ID from the API.
 * @param {number} id - The ID of the recipe to fetch.
 * @returns {Promise<any>} A promise that resolves with the recipe data, or throws an error if the fetch fails.
 */

export const fetchRecipeById = async (id: number) => {
    try {
        const response = await fetch(`${CONSTANTS.API_URL}/${id}`, {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch recipe with ID: ${id}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching recipe:", error);
        throw error;
    }
};

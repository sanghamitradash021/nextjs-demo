"use server";

import { CONSTANTS } from "../constants/RecipelistConstant";

// Fetch all recipes
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

// Fetch a single recipe by ID
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

"use server";

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

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

// Fetch all recipes
export const fetchAllRecipes = async (): Promise<Recipe[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/recipes/getall`);
        if (!response.ok) throw new Error("Failed to fetch all recipes");
        return response.json();
    } catch (error) {
        console.error("Error fetching all recipes:", error);
        return [];
    }
};

// Fetch recipes by cuisine type
export const fetchCuisineTypeRecipes = async (cuisine: string): Promise<Recipe[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/recipes/cuisine/${cuisine}`);
        if (!response.ok) throw new Error(`Failed to fetch recipes for cuisine: ${cuisine}`);
        return response.json();
    } catch (error) {
        console.error(`Error fetching recipes for cuisine ${cuisine}:`, error);
        return [];
    }
};

// Fetch recipes by meal type
export const fetchMealTypeRecipes = async (mealType: string): Promise<Recipe[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/recipes/mealType/${mealType.toLowerCase()}`);
        if (!response.ok) throw new Error(`Failed to fetch recipes for meal type: ${mealType}`);
        return response.json();
    } catch (error) {
        console.error(`Error fetching recipes for meal type ${mealType}:`, error);
        return [];
    }
};

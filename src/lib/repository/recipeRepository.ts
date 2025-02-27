


import sequelize from "@/db/models";
import { QueryTypes } from "sequelize";

/**
 * Repository for handling recipe-related database operations.
 * This includes creating, updating, deleting, and fetching recipes based on various criteria.
 * 
 * @class RecipeRepository
 */
class RecipeRepository {
    /**
     * Creates a new recipe and inserts it into the database.
     * 
     * @param {any} recipeData - The data for the new recipe.
     * @param {string} recipeData.title - The title of the recipe.
     * @param {number} recipeData.user_id - The ID of the user who created the recipe.
     * @param {string} recipeData.description - A brief description of the recipe.
     * @param {Array<string>} recipeData.ingredients - A list of ingredients for the recipe.
     * @param {string} recipeData.instructions - Instructions for preparing the recipe.
     * @param {string} recipeData.preparationTime - Time needed for preparation.
     * @param {string} recipeData.difficulty - Difficulty level of the recipe.
     * @param {string} recipeData.cuisine - Cuisine type (e.g., Italian, Chinese).
     * @param {string} recipeData.mealType - Type of meal (e.g., Breakfast, Dinner).
     * @param {string} recipeData.image - URL of the recipe's image.
     * @returns {Promise<number | null>} - A promise that resolves to the ID of the newly created recipe, or null if an error occurs.
     */
    async createRecipe(recipeData: any): Promise<number | null> {
        try {
            const { title, user_id, description, ingredients, instructions, preparationTime, difficulty, cuisine, mealType, image } = recipeData;

            const ingredientsJson = JSON.stringify(ingredients);

            await sequelize.query(
                `INSERT INTO Recipes (title, user_id, description, ingredients, instructions, preparationTime, difficulty, cuisine, mealType, image, createdAt, updatedAt) 
                VALUES (:title, :user_id, :description, :ingredients, :instructions, :preparationTime, :difficulty, :cuisine, :mealType, :image, NOW(), NOW())`,
                {
                    replacements: {
                        title,
                        user_id,
                        description,
                        ingredients: ingredientsJson,
                        instructions,
                        preparationTime,
                        difficulty,
                        cuisine,
                        mealType,
                        image,
                    },
                    type: QueryTypes.INSERT,
                }
            );

            const idResult: any = await sequelize.query("SELECT LAST_INSERT_ID() as id", { type: QueryTypes.SELECT });

            return idResult?.[0]?.id ?? null;
        } catch (error) {
            console.error("Error in createRecipe:", error);
            throw error;
        }
    }

    /**
     * Retrieves a recipe by its ID.
     * 
     * @param {number} id - The ID of the recipe to retrieve.
     * @returns {Promise<any>} - A promise that resolves to the recipe data if found, or null if not found.
     */
    async findById(id: number): Promise<any> {
        const recipe = await sequelize.query("SELECT * FROM Recipes WHERE recipe_id = :id", {
            replacements: { id },
            type: QueryTypes.SELECT,
        });

        return recipe.length > 0 ? recipe[0] : null;
    }

    /**
     * Searches for recipes based on a query string.
     * 
     * @param {string} query - The search query.
     * @returns {Promise<any[]>} - A promise that resolves to an array of recipes matching the query.
     */
    async searchRecipes(query: string): Promise<any[]> {
        return await sequelize.query(
            `SELECT * FROM Recipes 
            WHERE title LIKE :query OR ingredients LIKE :query OR cuisine LIKE :query OR mealType LIKE :query`,
            {
                replacements: { query: `%${query}%` },
                type: QueryTypes.SELECT,
            }
        );
    }

    /**
     * Retrieves all recipes with pagination.
     * 
     * @param {number} limit - The number of recipes to retrieve.
     * @param {number} offset - The offset for pagination.
     * @returns {Promise<any[]>} - A promise that resolves to an array of recipes.
     */
    async getAllRecipes(limit: number, offset: number): Promise<any[]> {
        return await sequelize.query("SELECT * FROM Recipes LIMIT :limit OFFSET :offset", {
            replacements: { limit, offset },
            type: QueryTypes.SELECT,
        });
    }

    /**
     * Updates a recipe by its ID.
     * 
     * @param {number} id - The ID of the recipe to update.
     * @param {any} recipeData - The data to update the recipe with.
     * @param {string} recipeData.title - The title of the recipe.
     * @param {string} recipeData.description - The description of the recipe.
     * @param {Array<string>} recipeData.ingredients - The ingredients for the recipe.
     * @param {string} recipeData.instructions - Instructions for preparing the recipe.
     * @param {string} recipeData.preparationTime - Time needed for preparation.
     * @param {string} recipeData.difficulty - Difficulty level of the recipe.
     * @param {string} recipeData.cuisine - Cuisine type (e.g., Italian, Chinese).
     * @param {string} recipeData.mealType - Type of meal (e.g., Breakfast, Dinner).
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the update was successful.
     */
    async updateRecipe(id: number, recipeData: any): Promise<boolean> {
        const { title, description, ingredients, instructions, preparationTime, difficulty, cuisine, mealType } = recipeData;
        const ingredientsJson = JSON.stringify(ingredients);

        const result = await sequelize.query(
            `UPDATE Recipes 
             SET title = :title, description = :description, ingredients = :ingredients, 
                 instructions = :instructions, preparationTime = :preparationTime, difficulty = :difficulty, 
                 cuisine = :cuisine, mealType = :mealType, updatedAt = NOW()
             WHERE recipe_id = :id`,
            {
                replacements: { id, title, description, ingredients: ingredientsJson, instructions, preparationTime, difficulty, cuisine, mealType },
                type: QueryTypes.UPDATE,
            }
        );

        const affectedRows = result && Array.isArray(result) && result[1] > 0 ? result[1] : 0; // Check if the affected rows is greater than 0
        return affectedRows > 0;
    }

    /**
     * Deletes a recipe by its ID.
     * 
     * @param {number} id - The ID of the recipe to delete.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the deletion was successful.
     */
    async deleteRecipe(id: number): Promise<boolean> {
        const result = await sequelize.query("DELETE FROM Recipes WHERE recipe_id = :id", {
            replacements: { id },
            type: QueryTypes.DELETE,
        });

        const affectedRows = Array.isArray(result) ? result[0] : 0;
        return affectedRows > 0;
    }

    /**
     * Retrieves recipes by their cuisine type.
     * 
     * @param {string} cuisine - The cuisine type to filter by (e.g., Italian, Mexican).
     * @returns {Promise<any[]>} - A promise that resolves to an array of recipes with the specified cuisine.
     */
    async getRecipesByCuisine(cuisine: string): Promise<any[]> {
        return await sequelize.query("SELECT * FROM Recipes WHERE cuisine = :cuisine", {
            replacements: { cuisine },
            type: QueryTypes.SELECT,
        });
    }

    /**
     * Retrieves recipes by their meal type (e.g., breakfast, dinner).
     * 
     * @param {string} mealType - The meal type to filter by (e.g., Breakfast, Dinner).
     * @returns {Promise<any[]>} - A promise that resolves to an array of recipes with the specified meal type.
     */
    async getRecipesByMealType(mealType: string): Promise<any[]> {
        return await sequelize.query("SELECT * FROM Recipes WHERE mealType = :mealType", {
            replacements: { mealType },
            type: QueryTypes.SELECT,
        });
    }

    /**
     * Retrieves all recipes created by a specific user.
     * 
     * @param {number} userId - The ID of the user to filter by.
     * @returns {Promise<any[]>} - A promise that resolves to an array of recipes created by the specified user.
     */
    async getUserRecipes(userId: number): Promise<any[]> {
        return await sequelize.query("SELECT * FROM Recipes WHERE user_id = :userId", {
            replacements: { userId },
            type: QueryTypes.SELECT,
        });
    }
}

export default new RecipeRepository();

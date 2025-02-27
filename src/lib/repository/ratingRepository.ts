// import { sequelize } from "../config/database";
// import { QueryTypes } from "sequelize";

// interface Rating {
//     recipe_id: number;
//     user_id: number;
//     rating: number;
//     rate_id: number;
//     createdAt: Date;
//     updatedAt: Date;
// }

// const RatingRepository = {
//     async getRatingByUserAndRecipe(recipeId: number, userId: number): Promise<Rating | undefined> {
//         const result = await sequelize.query<Rating>(
//             "SELECT * FROM Ratings WHERE recipe_id = :recipeId AND user_id = :userId",
//             {
//                 replacements: { recipeId, userId },
//                 type: QueryTypes.SELECT,
//             }
//         );
//         return result[0]; // Return the first result or undefined if not found
//     },

//     async addRating(recipeId: number, userId: number, rating: number) {
//         await sequelize.query(
//             "INSERT INTO Ratings (recipe_id, user_id, rating, createdAt, updatedAt) VALUES (:recipeId, :userId, :rating, NOW(), NOW())",
//             {
//                 replacements: { recipeId, userId, rating },
//                 type: QueryTypes.INSERT,
//             }
//         );
//     },

//     async updateRating(recipeId: number, userId: number, rating: number) {
//         await sequelize.query(
//             "UPDATE Ratings SET rating = :rating, updatedAt = NOW() WHERE recipe_id = :recipeId AND user_id = :userId",
//             {
//                 replacements: { recipeId, userId, rating },
//                 type: QueryTypes.UPDATE,
//             }
//         );
//     },

//     async getAverageRating(recipeId: number): Promise<number> {
//         const result = await sequelize.query<{ avg_rating: number }>(
//             "SELECT AVG(rating) AS avg_rating FROM Ratings WHERE recipe_id = :recipeId",
//             {
//                 replacements: { recipeId },
//                 type: QueryTypes.SELECT,
//             }
//         );
//         return result[0]?.avg_rating ?? 0; // Return avg_rating or 0 if undefined
//     },

//     async deleteRating(ratingId: number) {
//         await sequelize.query(
//             "DELETE FROM Ratings WHERE rate_id = :ratingId",
//             {
//                 replacements: { ratingId },
//                 type: QueryTypes.DELETE,
//             }
//         );
//     },

//     async getRatingByIdAndUser(ratingId: number, userId: number): Promise<Rating | undefined> {
//         const result = await sequelize.query<Rating>(
//             "SELECT * FROM Ratings WHERE rate_id = :ratingId AND user_id = :userId",
//             {
//                 replacements: { ratingId, userId },
//                 type: QueryTypes.SELECT,
//             }
//         );
//         return result[0]; // Return the first result or undefined if not found
//     }
// };

// export default RatingRepository;


import sequelize from "@/db/models";
import { QueryTypes } from "sequelize";

/**
 * Interface representing a Rating entity.
 * 
 * @interface
 */
interface Rating {
    recipe_id: number;
    user_id: number;
    rating: number;
    rate_id: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Repository for handling rating-related database operations.
 * This includes adding, retrieving, updating, deleting ratings, and calculating average ratings.
 * 
 * @namespace RatingRepository
 */
const RatingRepository = {
    /**
     * Retrieves the rating for a specific recipe by a specific user.
     * 
     * @param {number} recipeId - The ID of the recipe for which the rating is being fetched.
     * @param {number} userId - The ID of the user who rated the recipe.
     * @returns {Promise<Rating | undefined>} - A promise that resolves to the rating if found, or undefined.
     */
    async getRatingByUserAndRecipe(recipeId: number, userId: number): Promise<Rating | undefined> {
        const result = await sequelize.query<Rating>(
            "SELECT * FROM Ratings WHERE recipe_id = :recipeId AND user_id = :userId",
            {
                replacements: { recipeId, userId },
                type: QueryTypes.SELECT,
            }
        );
        return result[0]; // Return the first result or undefined if not found
    },

    /**
     * Adds a new rating for a specific recipe by a specific user.
     * 
     * @param {number} recipeId - The ID of the recipe being rated.
     * @param {number} userId - The ID of the user who is adding the rating.
     * @param {number} rating - The rating value given by the user.
     * @returns {Promise<void>} - A promise that resolves when the rating is successfully added.
     */
    async addRating(recipeId: number, userId: number, rating: number): Promise<void> {
        await sequelize.query(
            "INSERT INTO Ratings (recipe_id, user_id, rating, createdAt, updatedAt) VALUES (:recipeId, :userId, :rating, NOW(), NOW())",
            {
                replacements: { recipeId, userId, rating },
                type: QueryTypes.INSERT,
            }
        );
    },

    /**
     * Updates the rating for a specific recipe by a specific user.
     * 
     * @param {number} recipeId - The ID of the recipe being rated.
     * @param {number} userId - The ID of the user who is updating their rating.
     * @param {number} rating - The new rating value.
     * @returns {Promise<void>} - A promise that resolves when the rating is successfully updated.
     */
    async updateRating(recipeId: number, userId: number, rating: number): Promise<void> {
        await sequelize.query(
            "UPDATE Ratings SET rating = :rating, updatedAt = NOW() WHERE recipe_id = :recipeId AND user_id = :userId",
            {
                replacements: { recipeId, userId, rating },
                type: QueryTypes.UPDATE,
            }
        );
    },

    /**
     * Retrieves the average rating for a specific recipe.
     * 
     * @param {number} recipeId - The ID of the recipe to calculate the average rating for.
     * @returns {Promise<number>} - A promise that resolves to the average rating, or 0 if no ratings exist.
     */
    async getAverageRating(recipeId: number): Promise<number> {
        const result = await sequelize.query<{ avg_rating: number }>(
            "SELECT AVG(rating) AS avg_rating FROM Ratings WHERE recipe_id = :recipeId",
            {
                replacements: { recipeId },
                type: QueryTypes.SELECT,
            }
        );
        return result[0]?.avg_rating ?? 0; // Return avg_rating or 0 if undefined
    },

    /**
     * Deletes a rating by its rating ID.
     * 
     * @param {number} ratingId - The ID of the rating to delete.
     * @returns {Promise<void>} - A promise that resolves when the rating is successfully deleted.
     */
    async deleteRating(ratingId: number): Promise<void> {
        await sequelize.query(
            "DELETE FROM Ratings WHERE rate_id = :ratingId",
            {
                replacements: { ratingId },
                type: QueryTypes.DELETE,
            }
        );
    },

    /**
     * Retrieves a specific rating by its ID and the user ID who created it.
     * 
     * @param {number} ratingId - The ID of the rating to retrieve.
     * @param {number} userId - The ID of the user who rated the recipe.
     * @returns {Promise<Rating | undefined>} - A promise that resolves to the rating if found, or undefined.
     */
    async getRatingByIdAndUser(ratingId: number, userId: number): Promise<Rating | undefined> {
        const result = await sequelize.query<Rating>(
            "SELECT * FROM Ratings WHERE rate_id = :ratingId AND user_id = :userId",
            {
                replacements: { ratingId, userId },
                type: QueryTypes.SELECT,
            }
        );
        return result[0]; // Return the first result or undefined if not found
    }
};

export default RatingRepository;



import sequelize from "@/db/models";
import { QueryTypes } from "sequelize";

/**
 * Interface representing a Comment entity.
 * 
 * @interface
 */
interface Comment {
    comment_id: number;
    recipe_id: number;
    user_id: number;
    content: string;
    is_deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Repository for handling comment-related database operations.
 * This includes adding, retrieving, updating, and deleting comments from the database.
 * 
 * @namespace CommentRepository
 */
const CommentRepository = {
    /**
     * Adds a new comment to the database.
     * 
     * @param {number} recipeId - The ID of the recipe to which the comment belongs.
     * @param {number} userId - The ID of the user who is adding the comment.
     * @param {string} content - The content of the comment.
     * @returns {Promise<void>} - A promise that resolves when the comment is successfully added.
     */
    // async addComment(recipeId: number, userId: number, content: string): Promise<void> {
    //     await sequelize.query(
    //         `INSERT INTO Comments (recipe_id, user_id, content, createdAt, updatedAt) 
    //         VALUES (:recipeId, :userId, :content, NOW(), NOW())`,
    //         {
    //             replacements: { recipeId, userId, content },
    //             type: QueryTypes.INSERT,
    //         }
    //     );
    // },

    async addComment(recipeId: number, userId: number, content: string): Promise<Comment | null> {
        // Insert the comment into the database
        const insertResult = await sequelize.query(
            `INSERT INTO Comments (recipe_id, user_id, content, createdAt, updatedAt) 
            VALUES (:recipeId, :userId, :content, NOW(), NOW())`,
            {
                replacements: { recipeId, userId, content },
                type: QueryTypes.INSERT,
            }
        );

        // Fetch the latest inserted comment for the given user & recipe
        const newComment = await sequelize.query<Comment>(
            `SELECT c.comment_id, c.recipe_id, c.user_id, c.content, c.createdAt, c.updatedAt, 
                    u.username 
             FROM Comments c
             JOIN Users u ON c.user_id = u.user_id
             WHERE c.recipe_id = :recipeId AND c.user_id = :userId
             ORDER BY c.createdAt DESC
             LIMIT 1`,
            {
                replacements: { recipeId, userId },
                type: QueryTypes.SELECT,
            }
        );

        return newComment.length > 0 ? newComment[0] : null;
    },


    /**
     * Retrieves all comments associated with a particular recipe.
     * 
     * @param {number} recipeId - The ID of the recipe to retrieve comments for.
     * @returns {Promise<Comment[]>} - A promise that resolves to an array of comments.
     */
    // async getCommentsByRecipe(recipeId: number): Promise<Comment[]> {
    //     const result = await sequelize.query<Comment>(
    //         "SELECT * FROM Comments WHERE recipe_id = :recipeId",
    //         {
    //             replacements: { recipeId },
    //             type: QueryTypes.SELECT,
    //         }
    //     );
    //     return result;
    // },

    async getCommentsByRecipe(recipeId: number): Promise<Comment[]> {
        const result = await sequelize.query<Comment>(
            `SELECT c.comment_id, c.recipe_id, c.user_id, c.content, c.createdAt, c.updatedAt, 
                    u.username 
             FROM Comments c
             JOIN Users u ON c.user_id = u.user_id
             WHERE c.recipe_id = :recipeId
             ORDER BY c.createdAt DESC`,
            {
                replacements: { recipeId },
                type: QueryTypes.SELECT,
            }
        );
        return result;
    },


    /**
     * Retrieves a specific comment by its ID and the user ID who created it.
     * 
     * @param {number} commentId - The ID of the comment to retrieve.
     * @param {number} userId - The ID of the user who created the comment.
     * @returns {Promise<Comment | undefined>} - A promise that resolves to the comment if found, or undefined.
     */
    async getCommentByIdAndUser(commentId: number, userId: number): Promise<Comment | undefined> {
        const result = await sequelize.query<Comment>(
            "SELECT * FROM Comments WHERE comment_id = :commentId AND user_id = :userId",
            {
                replacements: { commentId, userId },
                type: QueryTypes.SELECT,
            }
        );
        return result[0]; // Return the first result or undefined if not found
    },

    /**
     * Updates the content of an existing comment.
     * 
     * @param {number} commentId - The ID of the comment to update.
     * @param {string} content - The new content for the comment.
     * @returns {Promise<void>} - A promise that resolves when the comment is successfully updated.
     */
    async updateComment(commentId: number, content: string): Promise<void> {
        await sequelize.query(
            "UPDATE Comments SET content = :content, updatedAt = NOW() WHERE comment_id = :commentId",
            {
                replacements: { content, commentId },
                type: QueryTypes.UPDATE,
            }
        );
    },

    /**
     * Soft deletes a comment by marking it as deleted (is_deleted = 1).
     * 
     * @param {number} commentId - The ID of the comment to delete.
     * @returns {Promise<void>} - A promise that resolves when the comment is successfully deleted.
     */
    async deleteComment(commentId: number): Promise<void> {
        await sequelize.query(
            "DELETE  FROM Comments  WHERE comment_id = :commentId",
            {
                replacements: { commentId },
                type: QueryTypes.UPDATE,
            }
        );
    },
};

export default CommentRepository;

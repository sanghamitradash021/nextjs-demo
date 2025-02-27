// app/api/comments/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import CommentRepository from '../../../../../lib/repository/commentRepository';
import recipeRepository from '../../../../../lib/repository/recipeRepository';

/**
 * Adds a new comment to a recipe.
 * 
 * @param {NextApiRequest} req - The request object, containing the comment data in the body and recipeId in the params.
 * @param {NextApiResponse} res - The response object used to send the response back to the client.
 * @returns {Promise<void>} - A promise indicating the completion of the operation.
 */
const addComment = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method === 'POST') {
        try {
            const { recipeId, userId, content } = req.body;

            // Fetch the recipe by ID to verify the owner
            const recipe = await recipeRepository.findById(recipeId);

            if (!recipe) {
                res.status(404).json({ message: 'Recipe not found' });
                return;
            }

            // Check if the user is the owner of the recipe
            if (recipe.user_id === userId) {
                res.status(403).json({ message: "You can't comment on your own recipe" });
                return;
            }

            // Add the comment and return the full comment details
            const newComment = await CommentRepository.addComment(recipeId, userId, content);

            if (!newComment) {
                res.status(500).json({ message: 'Failed to add comment' });
                return;
            }

            res.status(201).json(newComment); // Return the comment including username
        } catch (error: any) {
            console.error('Error adding comment:', error);
            res.status(500).json({ message: 'Error adding comment', error: error.message });
        }
    } else {
        // If the request method is not POST
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default addComment;

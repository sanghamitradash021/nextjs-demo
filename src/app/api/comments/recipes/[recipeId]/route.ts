
import { NextRequest, NextResponse } from 'next/server';
import CommentRepository from '../../../../../lib/repository/commentRepository';
import recipeRepository from '../../../../../lib/repository/recipeRepository';

/**
 * Adds a new comment to a recipe.
 * 
 * @param {NextApiRequest} req - The request object, containing the comment data in the body and recipeId in the params.
 * @param {NextApiResponse} res - The response object used to send the response back to the client.
 * @returns {Promise<void>} - A promise indicating the completion of the operation.
 */
export async function POST(req: NextRequest) {
    try {
        const { recipeId, userId, content } = await req.json();

        // Fetch the recipe by ID to verify the owner
        const recipe = await recipeRepository.findById(recipeId);

        if (!recipe) {
            return NextResponse.json({ message: 'Recipe not found' }, { status: 404 });
        }

        // Check if the user is the owner of the recipe
        if (recipe.user_id === userId) {
            return NextResponse.json({ message: "You can't comment on your own recipe" }, { status: 403 });
        }

        // Add the comment and return the full comment details
        const newComment = await CommentRepository.addComment(recipeId, userId, content);

        if (!newComment) {
            return NextResponse.json({ message: 'Failed to add comment' }, { status: 500 });
        }

        return NextResponse.json(newComment, { status: 201 });
    } catch (error: any) {
        console.error('Error adding comment:', error);
        return NextResponse.json({ message: 'Error adding comment', error: error.message }, { status: 500 });
    }
}

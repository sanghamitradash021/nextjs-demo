import { NextApiRequest, NextApiResponse } from 'next';
import CommentRepository from '../../../../lib/repository/commentRepository';

/**
 * Updates an existing comment.
 * 
 * @param {NextApiRequest} req - The request object, containing commentId, userId, and content in the body.
 * @param {NextApiResponse} res - The response object used to send the response back to the client.
 * @returns {Promise<void>} - A promise indicating the completion of the operation.
 */
const updateComment = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const { commentId } = req.query; // Get the commentId from the dynamic route
        const { userId, content } = req.body;

        if (!commentId || Array.isArray(commentId)) {
            res.status(400).json({ message: "Invalid commentId" });
            return;
        }

        // Check if the comment exists and belongs to the user
        const existingComment = await CommentRepository.getCommentByIdAndUser(Number(commentId), userId);

        if (!existingComment) {
            res.status(404).json({ message: "Comment not found or unauthorized" });
            return;
        }

        // Update the comment using the repository
        await CommentRepository.updateComment(Number(commentId), content);

        res.status(200).json({ message: "Comment updated successfully" });
    } catch (error: any) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: "Error updating comment", error: error.message });
    }
};

/**
 * Deletes a comment from the database.
 * 
 * @param {NextApiRequest} req - The request object, containing commentId and userId in the body.
 * @param {NextApiResponse} res - The response object used to send the response back to the client.
 * @returns {Promise<void>} - A promise indicating the completion of the operation.
 */
const deleteComment = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const { commentId } = req.query; // Get the commentId from the dynamic route
        const { userId } = req.body;

        if (!commentId || Array.isArray(commentId)) {
            res.status(400).json({ message: "Invalid commentId" });
            return;
        }

        // Check if the comment exists and belongs to the user
        const existingComment = await CommentRepository.getCommentByIdAndUser(Number(commentId), userId);

        if (!existingComment) {
            res.status(404).json({ message: "Comment not found or unauthorized" });
            return;
        }

        // Delete the comment using the repository
        await CommentRepository.deleteComment(Number(commentId));

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error: any) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: "Error deleting comment", error: error.message });
    }
};

export { updateComment, deleteComment };

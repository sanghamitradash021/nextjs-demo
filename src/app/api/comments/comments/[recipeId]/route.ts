import { NextRequest, NextResponse } from "next/server";
import CommentRepository from "../,,/../../../../../lib/repository/commentRepository";

/**
 * Handles GET requests to fetch comments for a specific recipe.
 *
 * @param {NextRequest} req - The incoming request object.
 * @param {Object} context - The request context containing route parameters.
 * @param {Object} context.params - The route parameters.
 * @param {string} context.params.recipeId - The ID of the recipe for which comments are being fetched.
 * @returns {Promise<NextResponse>} The response containing the comments or an error message.
 */

export async function GET(req: NextRequest, { params }: { params: { recipeId: string } }) {
    try {
        const recipeId = Number(params.recipeId);
        if (isNaN(recipeId)) {
            return NextResponse.json({ message: "Invalid recipe ID" }, { status: 400 });
        }

        const comments = await CommentRepository.getCommentsByRecipe(recipeId);
        return NextResponse.json(comments, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching comments", error }, { status: 500 });
    }
}

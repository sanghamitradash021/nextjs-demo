import { NextRequest, NextResponse } from 'next/server';
import RatingRepository from '../../../../lib/repository/ratingRepository';

/**
 * Adds a rating for a recipe or updates an existing rating if the user has already rated it.
 * 
 * @param {NextRequest} req - The request object, containing recipeId, userId, and rating in the body.
 * @returns {NextResponse} - A JSON response indicating success or failure.
 */
export async function POST(req: NextRequest) {
    const { recipeId, userId, rating } = await req.json();

    try {
        // Check if the user has already rated the recipe
        const existingRating = await RatingRepository.getRatingByUserAndRecipe(recipeId, userId);

        if (existingRating) {
            // Update existing rating
            await RatingRepository.updateRating(recipeId, userId, rating);
            return NextResponse.json({ message: "Rating updated successfully" });
        } else {
            // Add new rating
            await RatingRepository.addRating(recipeId, userId, rating);
            return NextResponse.json({ message: "Rating added successfully" });
        }
    } catch (error) {
        console.error("Error adding/updating rating:", error);
        return NextResponse.json({ message: "Error adding/updating rating", error }, { status: 500 });
    }
}

/**
 * Updates an existing rating for a recipe.
 * 
 * @param {NextRequest} req - The request object, containing ratingId, userId, and rating in the body.
 * @returns {NextResponse} - A JSON response indicating success or failure.
 */
export async function PUT(req: NextRequest) {
    const { ratingId, userId, rating } = await req.json();

    try {
        // Check if the rating exists and belongs to the user
        const existingRating = await RatingRepository.getRatingByIdAndUser(ratingId, userId);

        if (!existingRating) {
            return NextResponse.json({ message: "Rating not found or unauthorized" }, { status: 404 });
        }

        // Update the rating
        await RatingRepository.updateRating(existingRating.recipe_id, userId, rating);
        return NextResponse.json({ message: "Rating updated successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error updating rating", error }, { status: 500 });
    }
}

/**
 * Deletes a rating for a recipe.
 * 
 * @param {NextRequest} req - The request object, containing ratingId and userId in the body.
 * @returns {NextResponse} - A JSON response indicating success or failure.
 */
export async function DELETE(req: NextRequest) {
    const { ratingId, userId } = await req.json();

    try {
        // Check if the rating exists and belongs to the user
        const existingRating = await RatingRepository.getRatingByIdAndUser(ratingId, userId);

        if (!existingRating) {
            return NextResponse.json({ message: "Rating not found or unauthorized" }, { status: 404 });
        }

        // Delete the rating
        await RatingRepository.deleteRating(ratingId);
        return NextResponse.json({ message: "Rating deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting rating", error }, { status: 500 });
    }
}
